import { MoodTheme } from "@/types";

interface ThemeTagsProps {
  themes: MoodTheme[];
}

const TAG_COLORS = [
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
];

export function ThemeTags({ themes }: ThemeTagsProps) {
  if (!themes.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        What&apos;s driving this
      </h2>
      <div className="flex flex-wrap gap-2">
        {themes.map((t, i) => (
          <span
            key={t.id || t.rank}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}
          >
            {t.theme}
          </span>
        ))}
      </div>
    </div>
  );
}
