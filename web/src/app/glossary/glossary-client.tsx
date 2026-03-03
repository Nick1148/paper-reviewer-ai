"use client";

import { useState } from "react";
import { GlossaryEntry } from "@/lib/types";
import SearchBar from "@/components/SearchBar";

interface GlossaryGroup {
  name: string;
  entries: GlossaryEntry[];
}

const categoryIcons: Record<string, string> = {
  "기본 개념": "📌",
  "모델/아키텍처": "🏗️",
  "학습 방법": "🎓",
  "평가 지표": "📊",
};

export default function GlossaryClient({ grouped }: { grouped: GlossaryGroup[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = grouped
    .map((group) => ({
      ...group,
      entries: group.entries.filter(
        (e) =>
          searchQuery === "" ||
          e.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.nameKo.includes(searchQuery) ||
          e.shortDesc.includes(searchQuery) ||
          e.analogy.includes(searchQuery)
      ),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <>
      {/* 검색 */}
      <div className="mb-8">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="용어를 검색하세요 (예: LLM, 트랜스포머, 학습...)"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredGroups.map((group) => (
            <div key={group.name}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <span aria-hidden="true">{categoryIcons[group.name] || "📄"}</span>
                {group.name}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.entries.map((entry) => (
                  <div
                    key={entry.term}
                    className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {entry.term}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-600">
                        {entry.fullName}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {entry.nameKo} — {entry.shortDesc}
                    </p>
                    <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
                      <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
                        <span aria-hidden="true">💡</span> {entry.analogy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
