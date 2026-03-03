"use client";

import { useState } from "react";

export default function TechnicalDetailAccordion({
  content,
}: {
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-10">
      <h2 className="sr-only">기술 상세</h2>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="technical-detail-panel"
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800/50"
      >
        <div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            기술 상세
          </span>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            <span aria-hidden="true">⚠️</span> 이 섹션은 AI/ML 배경지식이 필요합니다
          </p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          id="technical-detail-panel"
          className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50"
        >
          <p className="text-sm leading-[1.8] text-gray-700 dark:text-gray-300">
            {content}
          </p>
        </div>
      )}
    </section>
  );
}
