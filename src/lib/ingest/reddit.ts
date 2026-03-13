import { RawItem } from "@/types";

const MOCK_POSTS: RawItem[] = [
  {
    source: "reddit",
    title: "Why is everyone suddenly talking about this obscure 2003 movie?",
    url: "https://reddit.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 42000,
    category: "entertainment",
  },
  {
    source: "reddit",
    title: "This company's response to customer complaint is a masterclass in PR",
    url: "https://reddit.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 38500,
    category: "technology",
  },
  {
    source: "reddit",
    title: "Thread: people who quit their jobs with no backup plan, how did it go?",
    url: "https://reddit.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 55000,
    category: "life",
  },
  {
    source: "reddit",
    title: "The discourse around this celebrity has completely lost the plot",
    url: "https://reddit.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 29000,
    category: "celebrity",
  },
  {
    source: "reddit",
    title: "Unpopular opinion: the current outrage about this is completely overblown",
    url: "https://reddit.com",
    publishedAt: new Date().toISOString(),
    engagementScore: 67000,
    category: "opinion",
  },
];

interface RedditPost {
  data: {
    title: string;
    url: string;
    created_utc: number;
    score: number;
    subreddit: string;
  };
}

export async function fetchReddit(): Promise<RawItem[]> {
  try {
    const subreddits = "worldnews+technology+entertainment+television+gaming";
    const res = await fetch(
      `https://www.reddit.com/r/${subreddits}/hot.json?limit=30`,
      {
        headers: { "User-Agent": "InternetMoodTracker/1.0" },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      console.warn(`[reddit] Request failed (${res.status}), using mock data`);
      return MOCK_POSTS;
    }

    const data = await res.json();
    const posts: RedditPost[] = data?.data?.children ?? [];

    return posts
      .filter((p) => p.data?.title)
      .map((p) => ({
        source: "reddit" as const,
        title: p.data.title,
        url: p.data.url,
        publishedAt: new Date(p.data.created_utc * 1000).toISOString(),
        engagementScore: p.data.score,
        category: p.data.subreddit,
      }));
  } catch (err) {
    console.warn("[reddit] Fetch error, using mock data:", err);
    return MOCK_POSTS;
  }
}
