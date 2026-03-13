import { SourceItem } from "@/types";

interface SourceSnapshotProps {
  sources: SourceItem[];
}

const SOURCE_LABELS: Record<string, { label: string; icon: string }> = {
  newsapi: { label: "News", icon: "📰" },
  reddit: { label: "Reddit", icon: "🔴" },
  hackernews: { label: "HN", icon: "🟠" },
};

export function SourceSnapshot({ sources }: SourceSnapshotProps) {
  if (!sources.length) return null;

  const grouped = sources.reduce(
    (acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item);
      return acc;
    },
    {} as Record<string, SourceItem[]>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Source snapshot
      </h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([source, items]) => {
          const meta = SOURCE_LABELS[source] ?? { label: source, icon: "🌐" };
          return (
            <div key={source}>
              <div className="flex items-center gap-2 mb-2">
                <span>{meta.icon}</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {meta.label}
                </span>
                <span className="text-xs text-gray-400">
                  ({items.length} stories)
                </span>
              </div>
              <ul className="space-y-1">
                {items.slice(0, 4).map((item) => (
                  <li key={item.id || item.title} className="text-sm">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 line-clamp-1 hover:underline"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                        {item.title}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
