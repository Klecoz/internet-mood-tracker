"use client";

import { MoodRun } from "@/types";
import { getMoodEmoji, getMoodGradient } from "@/lib/utils";

interface MoodHeroProps {
  moodRun: MoodRun;
}

export function MoodHero({ moodRun }: MoodHeroProps) {
  const emoji = getMoodEmoji(moodRun.mood);
  const gradient = getMoodGradient(moodRun.mood);
  const pct = Math.round(moodRun.confidence * 100);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-2xl">
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${gradient} px-8 py-12 text-white`}>
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-4">
          Internet mood right now
        </p>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-7xl">{emoji}</span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            {moodRun.mood}
          </h1>
        </div>

        {/* Confidence bar */}
        <div className="mt-6 max-w-xs">
          <div className="flex justify-between text-xs font-medium opacity-80 mb-1">
            <span>Confidence</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fun paragraph */}
      <div className="bg-white dark:bg-gray-900 px-8 py-8">
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
          {moodRun.fun_paragraph}
        </p>
        {moodRun.rationale && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500 italic border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {moodRun.rationale}
          </p>
        )}
      </div>
    </div>
  );
}
