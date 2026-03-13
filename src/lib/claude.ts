import Anthropic from "@anthropic-ai/sdk";
import { MoodResult, RawItem } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function classifyMood(items: RawItem[]): Promise<MoodResult> {
  const itemList = items
    .slice(0, 40)
    .map((item, i) => `${i + 1}. [${item.source}] ${item.title}`)
    .join("\n");

  const prompt = `You are analyzing public internet conversation from the last 24 hours across news, Reddit, and HackerNews.

Here are the top stories and posts right now:
${itemList}

Based on these signals, return a JSON object with exactly these fields:
{
  "mood": string (one of: "Mildly Chaotic", "Collectively Doomed", "Suspiciously Hopeful", "Chronically Online", "Victory Lap", "Deeply Tired", "Cautiously Optimistic", "Chaotically Vibing"),
  "confidence": number from 0 to 1,
  "themes": string[] (3 to 5 short theme tags, e.g. "sports outrage", "AI discourse", "celebrity drama"),
  "rationale": string (one sentence explaining what drove this mood classification),
  "funParagraph": string (60 to 120 words, witty and observant, written like a clever friend who is very online but not exhausting about it)
}

Rules:
1. Choose the mood that best reflects the dominant cross-platform vibe.
2. The funParagraph should be witty, readable, and grounded in the actual content.
3. Do not invent events not present in the input.
4. Avoid slang overload and avoid sounding like a corporate brand account.
5. Write the funParagraph in one paragraph with one sharp observation, one concrete detail about what people are reacting to, and one playful closing line.
6. Return ONLY valid JSON, no markdown, no explanation.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const raw = content.text.trim();
  const jsonStr = raw.startsWith("```")
    ? raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : raw;

  return JSON.parse(jsonStr) as MoodResult;
}
