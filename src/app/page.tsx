import { MoodHero } from "@/components/MoodHero";
import { ThemeTags } from "@/components/ThemeTags";
import { SourceSnapshot } from "@/components/SourceSnapshot";
import { MoodHistory } from "@/components/MoodHistory";
import { MoodRun } from "@/types";

async function getCurrentMood(): Promise<MoodRun | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/mood`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.moodRun ?? null;
  } catch {
    return null;
  }
}

async function getMoodHistory(): Promise<
  { id: string; generated_at: string; mood: string; confidence: number }[]
> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/history`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.history ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [moodRun, history] = await Promise.all([
    getCurrentMood(),
    getMoodHistory(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            🌐 Internet Mood Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            How is the internet feeling today?
          </p>
        </div>

        {/* Main content */}
        {moodRun ? (
          <div className="space-y-6">
            <MoodHero moodRun={moodRun} />

            {moodRun.mood_themes && moodRun.mood_themes.length > 0 && (
              <ThemeTags themes={moodRun.mood_themes} />
            )}

            {moodRun.source_items && moodRun.source_items.length > 0 && (
              <SourceSnapshot sources={moodRun.source_items} />
            )}

            {history.length > 1 && <MoodHistory history={history.slice(1)} />}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-6xl">🌐</span>
            <h2 className="mt-6 text-xl font-bold text-gray-800 dark:text-gray-200">
              No mood data yet
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Trigger the first analysis to see how the internet is feeling.
            </p>
            <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-left">
              <code className="text-xs text-gray-600 dark:text-gray-300 break-all">
                curl -X POST http://localhost:3000/api/analyze \<br />
                &nbsp;&nbsp;-H &quot;x-secret: YOUR_ANALYZE_SECRET&quot;
              </code>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600">
          Powered by Claude AI · Sources: NewsAPI, Reddit, HackerNews
        </footer>
      </div>
    </main>
  );
}
