import { RawItem } from "@/types";

const MOCK_HEADLINES: RawItem[] = [
  {
    source: "newsapi",
    title: "Global markets tumble as new trade uncertainty spreads",
    snippet: "Investors are on edge as tariff negotiations collapse.",
    publishedAt: new Date().toISOString(),
    category: "business",
  },
  {
    source: "newsapi",
    title: "Tech giant announces surprise layoffs amid restructuring",
    snippet: "Thousands of employees affected across multiple divisions.",
    publishedAt: new Date().toISOString(),
    category: "technology",
  },
  {
    source: "newsapi",
    title: "Scientists discover promising new climate solution",
    snippet: "A breakthrough carbon capture method shows real potential.",
    publishedAt: new Date().toISOString(),
    category: "science",
  },
  {
    source: "newsapi",
    title: "Major sports upset shocks fans worldwide",
    snippet: "The underdog team pulls off an impossible victory.",
    publishedAt: new Date().toISOString(),
    category: "sports",
  },
  {
    source: "newsapi",
    title: "New AI model stuns researchers with unexpected capabilities",
    snippet: "Experts debate what this means for the near future.",
    publishedAt: new Date().toISOString(),
    category: "technology",
  },
];

export async function fetchNewsAPI(): Promise<RawItem[]> {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    console.warn("[newsapi] No NEWSAPI_KEY set, using mock data");
    return MOCK_HEADLINES;
  }

  try {
    // Note: NewsAPI free tier restricts server-side requests.
    // Using /v2/everything is more reliable than /v2/top-headlines on the free plan.
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=news&language=en&pageSize=30&sortBy=popularity&from=${yesterday}&apiKey=${apiKey}`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      console.warn(
        `[newsapi] Request failed (HTTP ${res.status}): ${body} — falling back to mock data`
      );
      return MOCK_HEADLINES;
    }

    const data = await res.json();

    // NewsAPI sometimes returns status "error" with HTTP 200
    if (data.status === "error") {
      console.warn(
        `[newsapi] API error: ${data.code} — ${data.message} — falling back to mock data`
      );
      return MOCK_HEADLINES;
    }

    const articles = (data.articles ?? [])
      .filter((a: Record<string, unknown>) => a.title && a.title !== "[Removed]")
      .map((a: Record<string, unknown>) => ({
        source: "newsapi" as const,
        title: a.title as string,
        snippet: a.description as string | undefined,
        url: a.url as string | undefined,
        publishedAt: a.publishedAt as string | undefined,
        category: (a.source as Record<string, string> | undefined)?.name,
      }));

    console.log(`[newsapi] Fetched ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.warn("[newsapi] Fetch error, falling back to mock data:", err);
    return MOCK_HEADLINES;
  }
}
