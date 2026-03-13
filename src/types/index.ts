export interface RawItem {
  source: "newsapi" | "reddit" | "hackernews";
  title: string;
  snippet?: string;
  url?: string;
  publishedAt?: string;
  engagementScore?: number;
  category?: string;
}

export interface MoodResult {
  mood: string;
  confidence: number;
  themes: string[];
  rationale: string;
  funParagraph: string;
}

export interface MoodTheme {
  id: string;
  mood_run_id: string;
  theme: string;
  rank: number;
}

export interface SourceItem {
  id: string;
  mood_run_id: string;
  source: "newsapi" | "reddit" | "hackernews";
  title: string;
  url?: string;
  published_at?: string;
}

export interface MoodRun {
  id: string;
  generated_at: string;
  mood: string;
  confidence: number;
  rationale?: string;
  fun_paragraph: string;
  mood_themes?: MoodTheme[];
  source_items?: SourceItem[];
}
