import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOOD_EMOJIS: Record<string, string> = {
  "Mildly Chaotic": "🌀",
  "Collectively Doomed": "😮‍💨",
  "Suspiciously Hopeful": "🌱",
  "Chronically Online": "📱",
  "Victory Lap": "🏆",
  "Deeply Tired": "😴",
  "Cautiously Optimistic": "🤞",
  "Chaotically Vibing": "✨",
};

export const MOOD_COLORS: Record<string, string> = {
  "Mildly Chaotic": "from-orange-500 to-yellow-400",
  "Collectively Doomed": "from-slate-600 to-slate-800",
  "Suspiciously Hopeful": "from-emerald-500 to-teal-400",
  "Chronically Online": "from-purple-500 to-violet-400",
  "Victory Lap": "from-yellow-400 to-amber-500",
  "Deeply Tired": "from-indigo-400 to-blue-500",
  "Cautiously Optimistic": "from-sky-400 to-cyan-500",
  "Chaotically Vibing": "from-pink-500 to-rose-400",
};

export function getMoodEmoji(mood: string): string {
  return MOOD_EMOJIS[mood] ?? "🌐";
}

export function getMoodGradient(mood: string): string {
  return MOOD_COLORS[mood] ?? "from-gray-500 to-gray-600";
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays}d ago`;
}
