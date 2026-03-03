// 카테고리별 배지 색상 (PaperCard, papers/[id])
export const categoryBadgeColors: Record<string, string> = {
  "cs.AI": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "cs.LG": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "cs.CL": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "cs.CV": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "stat.ML": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  "cs.RO": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "cs.NE": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  "cs.IR": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

// 카테고리별 좌측 컬러 바 (PaperCard)
export const categoryBarColors: Record<string, string> = {
  "cs.AI": "bg-blue-500",
  "cs.LG": "bg-green-500",
  "cs.CL": "bg-purple-500",
  "cs.CV": "bg-orange-500",
  "stat.ML": "bg-teal-500",
  "cs.RO": "bg-red-500",
  "cs.NE": "bg-indigo-500",
  "cs.IR": "bg-yellow-500",
};

// 카테고리별 칩 색상 (CategoryFilter 선택 상태)
export const categoryChipColors: Record<string, string> = {
  "cs.AI": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  "cs.LG": "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  "cs.CL": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  "cs.CV": "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  "stat.ML": "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700",
  "cs.RO": "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  "cs.NE": "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700",
  "cs.IR": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
};

// 난이도 설정
export const difficultyConfig = {
  beginner: {
    label: "입문",
    stars: "★☆☆",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    chipSelectedClass: "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  intermediate: {
    label: "중급",
    stars: "★★☆",
    badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    chipSelectedClass: "border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  advanced: {
    label: "심화",
    stars: "★★★",
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    chipSelectedClass: "border-red-300 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
} as const;

export function getCategoryBadgeColor(category: string): string {
  return categoryBadgeColors[category] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
}

export function getCategoryBarColor(category: string): string {
  return categoryBarColors[category] ?? "bg-gray-400";
}

export function getCategoryChipColor(categoryId: string, selected: boolean): string {
  if (!selected) {
    return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
  return categoryChipColors[categoryId] ?? "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
}
