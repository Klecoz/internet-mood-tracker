import { RawItem } from "@/types";

const MOCK_STORIES: RawItem[] = [
  {
    source: "hackernews",
    title: "Ask HN: What's the most underrated productivity tool you use?",
    url: "https://news.ycombinator.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 850,
    category: "productivity",
  },
  {
    source: "hackernews",
    title: "We built a distributed system and here's everything that went wrong",
    url: "https://news.ycombinator.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 1200,
    category: "engineering",
  },
  {
    source: "hackernews",
    title: "The case against microservices (2025)",
    url: "https://news.ycombinator.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 2400,
    category: "engineering",
  },
  {
    source: "hackernews",
    title: "Researchers find major vulnerability in widely-used open source library",
    url: "https://news.ycombinator.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 1800,
    category: "security",
  },
  {
    source: "hackernews",
    title: "Show HN: I built a tool that summarizes your entire codebase in one prompt",
    url: "https://news.ycombinator.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 960,
    category: "ai",
  },
];

interface HNHit {
  title: string;
  url: string;
  created_at: string;
  points: number;
  _tags: string[];
}

export async function fetchHackerNews(): Promise<RawItem[]> {
  try {
    const res = await fetch(
      "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30",
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      console.warn(
        `[hackernews] Request failed (${res.status}), using mock data`
      );
      return MOCK_STORIES;
    }

    const data = await res.json();
    const hits: HNHit[] = data?.hits ?? [];

    return hits
      .filter((h) => h.title)
      .map((h) => ({
        source: "hackernews" as const,
        title: h.title,
        url: h.url,
        publishedAt: h.created_at,
        engagementScore: h.points,
        category: h._tags?.[0],
      }));
  } catch (err) {
    console.warn("[hackernews] Fetch error, using mock data:", err);
    return MOCK_STORIES;
  }
}
