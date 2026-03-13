import { getMoodEmoji, formatRelativeTime } from "@/lib/utils";

interface HistoryEntry {
  id: string;
  generated_at: string;
  mood: string;
  confidence: number;
}

interface MoodHistoryProps {
  history: HistoryEntry[];
}

export function MoodHistory({ history }: MoodHistoryProps) {
  if (!history.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Mood history
      </h2>
      <div className="space-y-2">
        {history.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between py-2 ${
              i < history.length - 1
                ? "border-b border-gray-100 dark:border-gray-800"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {entry.mood}
                </p>
                <p className="text-xs text-gray-400">
                  {formatRelativeTime(entry.generated_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {Math.round(entry.confidence * 100)}% confident
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
