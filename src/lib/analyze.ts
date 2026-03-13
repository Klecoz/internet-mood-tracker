import { supabase } from "./supabase";
import { classifyMood } from "./claude";
import { fetchNewsAPI } from "./ingest/newsapi";
import { fetchReddit } from "./ingest/reddit";
import { fetchHackerNews } from "./ingest/hackernews";
import { RawItem, MoodRun } from "@/types";

function deduplicateItems(items: RawItem[]): RawItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .slice(0, 5)
      .join(" ");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Pick a balanced set of items across sources so no single source dominates.
 * Each source gets up to `perSource` slots, sorted by engagement within the source.
 */
function pickBalanced(
  bySource: Record<string, RawItem[]>,
  perSource: number
): RawItem[] {
  const result: RawItem[] = [];
  for (const items of Object.values(bySource)) {
    const sorted = [...items].sort(
      (a, b) => (b.engagementScore ?? 0) - (a.engagementScore ?? 0)
    );
    result.push(...sorted.slice(0, perSource));
  }
  return result;
}

export async function runAnalysis(): Promise<MoodRun> {
  // Fetch from all sources in parallel
  const [newsItems, redditItems, hnItems] = await Promise.all([
    fetchNewsAPI(),
    fetchReddit(),
    fetchHackerNews(),
  ]);

  console.log(
    `[analyze] Fetched: newsapi=${newsItems.length}, reddit=${redditItems.length}, hackernews=${hnItems.length}`
  );

  const bySource: Record<string, RawItem[]> = {
    newsapi: deduplicateItems(newsItems),
    reddit: deduplicateItems(redditItems),
    hackernews: deduplicateItems(hnItems),
  };

  // Give each source up to 14 slots → up to 42 items total for Claude
  const topItems = pickBalanced(bySource, 14);

  console.log(
    `[analyze] Sending ${topItems.length} items to Claude (balanced across sources)`
  );

  // Classify mood with Claude
  const result = await classifyMood(topItems);

  // Persist to Supabase
  const { data: moodRun, error: moodError } = await supabase
    .from("mood_runs")
    .insert({
      mood: result.mood,
      confidence: result.confidence,
      rationale: result.rationale,
      fun_paragraph: result.funParagraph,
    })
    .select()
    .single();

  if (moodError || !moodRun) {
    throw new Error(`Failed to insert mood_run: ${moodError?.message}`);
  }

  // Persist themes
  if (result.themes.length > 0) {
    const themeRows = result.themes.map((theme, i) => ({
      mood_run_id: moodRun.id,
      theme,
      rank: i + 1,
    }));
    const { error: themeError } = await supabase
      .from("mood_themes")
      .insert(themeRows);
    if (themeError) {
      console.warn("Failed to insert themes:", themeError.message);
    }
  }

  // Persist source items: up to 5 per source for a balanced snapshot
  const sourceRows = Object.entries(bySource).flatMap(([, items]) =>
    items
      .sort((a, b) => (b.engagementScore ?? 0) - (a.engagementScore ?? 0))
      .slice(0, 5)
      .map((item) => ({
        mood_run_id: moodRun.id,
        source: item.source,
        title: item.title,
        url: item.url ?? null,
        published_at: item.publishedAt ?? null,
      }))
  );

  const { error: sourceError } = await supabase
    .from("source_items")
    .insert(sourceRows);
  if (sourceError) {
    console.warn("Failed to insert source items:", sourceError.message);
  }

  return {
    ...moodRun,
    mood_themes: result.themes.map((theme, i) => ({
      id: "",
      mood_run_id: moodRun.id,
      theme,
      rank: i + 1,
    })),
    source_items: sourceRows.map((row) => ({
      id: "",
      ...row,
    })),
  };
}
