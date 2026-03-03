import Link from "next/link";
import { PaperExplanation } from "@/lib/types";
import { getCategoryLabel, formatDateKo } from "@/lib/data";
import { getCategoryBadgeColor, getCategoryBarColor } from "@/lib/colors";
import DifficultyBadge from "./DifficultyBadge";

export default function PaperCard({ paper }: { paper: PaperExplanation }) {
  return (
    <Link href={`/papers/${paper.id}`} className="group block">
      <article className="flex overflow-hidden rounded-xl border border-gray-200 bg-white transition-all active:scale-[0.98] hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700">
        {/* 좌측 카테고리 컬러 바 */}
        <div className={`w-1 shrink-0 rounded-l-xl ${getCategoryBarColor(paper.category)}`} />

        <div className="flex min-w-0 flex-1 flex-col p-5">
          {/* 상단: 카테고리 배지 + 난이도 + 날짜 */}
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryBadgeColor(paper.category)}`}
            >
              {getCategoryLabel(paper.category)}
            </span>
            <DifficultyBadge difficulty={paper.difficulty} />
            <time className="ml-auto shrink-0 text-xs text-gray-500 dark:text-gray-500">
              {formatDateKo(paper.publishedDate)}
            </time>
          </div>

          {/* 제목 */}
          <h2 className="mt-3 text-xl font-bold leading-snug text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {paper.titleKo || paper.title}
          </h2>
          {paper.titleKo && paper.titleKo !== paper.title && (
            <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-600">
              {paper.title}
            </p>
          )}

          {/* TL;DR (2줄 제한) */}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {paper.tldr}
          </p>

          {/* 하단: CTA - 모바일에서도 표시 */}
          <div className="mt-4 flex items-center justify-end">
            <span className="text-sm font-medium text-blue-600 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 dark:text-blue-400">
              5분 읽기 →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
