"use client";

import { useState } from "react";
import { ArxivCategory } from "@/lib/types";
import { getCategoryChipColor } from "@/lib/colors";

interface CategoryFilterProps {
  categories: ArxivCategory[];
  onFilterChange: (selectedCategories: string[]) => void;
}

export default function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    const next = selected.includes(categoryId)
      ? selected.filter((id) => id !== categoryId)
      : [...selected, categoryId];
    setSelected(next);
    onFilterChange(next);
  };

  const toggleAll = () => {
    if (selected.length === 0) {
      const all = categories.map((c) => c.id);
      setSelected(all);
      onFilterChange(all);
    } else {
      setSelected([]);
      onFilterChange([]);
    }
  };

  return (
    <div className="flex max-h-24 flex-wrap items-center gap-2 overflow-y-auto sm:max-h-none">
      <button
        onClick={toggleAll}
        aria-pressed={selected.length === 0}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          selected.length === 0
            ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => {
        const isSelected = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            title={cat.descriptionSimple}
            aria-pressed={isSelected}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${getCategoryChipColor(cat.id, isSelected)}`}
          >
            {cat.icon} {cat.nameKo}
          </button>
        );
      })}
    </div>
  );
}
