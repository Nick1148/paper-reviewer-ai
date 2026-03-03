"use client";

import { useState, useCallback } from "react";
import PaperCard from "@/components/PaperCard";
import CategoryFilter from "@/components/CategoryFilter";
import DifficultyFilter from "@/components/DifficultyFilter";
import SearchBar from "@/components/SearchBar";
import AdSlot from "@/components/AdSlot";
import { PaperExplanation, ArxivCategory } from "@/lib/types";

interface PapersFeedProps {
  papers: PaperExplanation[];
  categories: ArxivCategory[];
  papersByDate: Record<string, PaperExplanation[]>;
  sortedDates: string[];
  maxCount?: number;
}

export default function PapersFeed({ papers, categories, maxCount }: PapersFeedProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 필터링된 논문
  let filteredPapers = papers.filter((paper) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(paper.category);
    const matchesDifficulty =
      selectedDifficulties.length === 0 || selectedDifficulties.includes(paper.difficulty);
    const matchesSearch =
      searchQuery === "" ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.titleKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tldr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // maxCount 적용
  if (maxCount) {
    filteredPapers = filteredPapers.slice(0, maxCount);
  }

  // 필터링된 날짜별 그룹핑
  const filteredByDate: Record<string, PaperExplanation[]> = {};
  for (const paper of filteredPapers) {
    const date = paper.publishedDate;
    if (!filteredByDate[date]) {
      filteredByDate[date] = [];
    }
    filteredByDate[date].push(paper);
  }

  const filteredDates = Object.keys(filteredByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      <div className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter categories={categories} onFilterChange={setSelectedCategories} />
        <DifficultyFilter onFilterChange={setSelectedDifficulties} />
      </div>

      {filteredDates.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            검색 조건에 맞는 논문이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredDates.map((date, dateIndex) => (
            <div key={date}>
              <h3 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                {new Date(date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="space-y-4">
                {filteredByDate[date].map((paper) => (
                  <PaperCard key={paper.id} paper={paper} />
                ))}
              </div>
              {dateIndex > 0 && dateIndex % 2 === 0 && (
                <AdSlot className="mt-6" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
