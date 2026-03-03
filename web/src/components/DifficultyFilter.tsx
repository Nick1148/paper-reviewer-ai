"use client";

import { useState } from "react";
import { difficultyConfig } from "@/lib/colors";

const difficulties = Object.entries(difficultyConfig).map(([id, config]) => ({
  id,
  label: config.label,
  stars: config.stars,
  chipSelectedClass: config.chipSelectedClass,
}));

interface DifficultyFilterProps {
  onFilterChange: (selected: string[]) => void;
}

export default function DifficultyFilter({ onFilterChange }: DifficultyFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(next);
    onFilterChange(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">난이도:</span>
      <button
        onClick={() => { setSelected([]); onFilterChange([]); }}
        aria-pressed={selected.length === 0}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          selected.length === 0
            ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        전체
      </button>
      {difficulties.map((d) => {
        const isSelected = selected.includes(d.id);
        return (
          <button
            key={d.id}
            onClick={() => toggle(d.id)}
            aria-pressed={isSelected}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              isSelected
                ? d.chipSelectedClass
                : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {d.stars} {d.label}
          </button>
        );
      })}
    </div>
  );
}
