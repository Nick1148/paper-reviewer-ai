import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaperById, getAllPaperIds, getAllPapers, getCategoryLabel, formatDateKo } from "@/lib/data";
import { PaperExplanation } from "@/lib/types";
import { getCategoryBadgeColor } from "@/lib/colors";
import ShareButtonsWrapper from "./share-buttons-wrapper";
import AdSlot from "@/components/AdSlot";
import PaperCard from "@/components/PaperCard";
import DifficultyBadge from "@/components/DifficultyBadge";
import GlossarySection from "@/components/GlossarySection";
import TechnicalDetailAccordion from "@/components/TechnicalDetailAccordion";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllPaperIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = await getPaperById(id);
  if (!paper) return { title: "논문을 찾을 수 없습니다" };

  const displayTitle = paper.titleKo || paper.title;
  return {
    title: `${displayTitle} - AI 논문 해설`,
    description: paper.tldr,
    openGraph: {
      title: displayTitle,
      description: paper.tldr,
      type: "article",
    },
  };
}

function JsonLd({ paper }: { paper: PaperExplanation }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.titleKo || paper.title,
    description: paper.tldr,
    author: paper.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    datePublished: paper.publishedDate,
    url: paper.arxivUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { id } = await params;
  const paper = await getPaperById(id);

  if (!paper) {
    notFound();
  }

  // 관련 논문 추천
  const allPapers = await getAllPapers();
  const relatedPapers = allPapers
    .filter((p) => p.id !== paper.id && p.category === paper.category)
    .slice(0, 3);

  const catColor = getCategoryBadgeColor(paper.category);

  return (
    <>
      <JsonLd paper={paper} />

      <article className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
              홈
            </Link>
            <span>/</span>
            <Link href="/papers" className="hover:text-gray-900 dark:hover:text-white">
              논문 해설
            </Link>
            <span>/</span>
            <span className="truncate text-gray-900 dark:text-white">
              {(paper.titleKo || paper.title).length > 40
                ? (paper.titleKo || paper.title).slice(0, 40) + "..."
                : paper.titleKo || paper.title}
            </span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${catColor}`}>
                {getCategoryLabel(paper.category)}
              </span>
              <DifficultyBadge difficulty={paper.difficulty} />
              <time className="text-sm text-gray-500 dark:text-gray-500">
                {formatDateKo(paper.publishedDate)}
              </time>
            </div>
            <h1
              className="mt-4 text-2xl font-bold leading-[1.4] text-gray-900 dark:text-white sm:text-3xl"
            >
              {paper.titleKo || paper.title}
            </h1>
            {paper.titleKo && paper.titleKo !== paper.title && (
              <p className="mt-2 text-sm italic text-gray-400 dark:text-gray-600">
                {paper.title}
              </p>
            )}
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              {paper.authors.join(", ")}
            </p>
          </div>

          {/* 공유 버튼 */}
          <div className="mb-8">
            <ShareButtonsWrapper title={paper.titleKo || paper.title} paperId={paper.id} />
          </div>

          {/* 핵심 한줄 요약 */}
          <div className="mb-10 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/10">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
              핵심 한줄 요약
            </p>
            <p className="mt-2 text-sm leading-[1.8] text-blue-900 dark:text-blue-300">
              {paper.tldr}
            </p>
          </div>

          {/* 초보자 안내 박스 */}
          {paper.beginnerSummary && (
            <div className="mb-10 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/10">
              <p className="text-sm font-semibold text-green-800 dark:text-green-400">
                <span aria-hidden="true">🔰</span> 쉽게 이해하기
              </p>
              <p className="mt-2 text-sm leading-[1.8] text-green-900 dark:text-green-300">
                {paper.beginnerSummary}
              </p>
            </div>
          )}

          {/* 이 논문은 무엇을 연구했나요? */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              이 논문은 무엇을 연구했나요?
            </h2>
            <p className="mt-4 leading-[1.8] text-gray-600 dark:text-gray-400">
              {paper.summary}
            </p>
          </section>

          {/* 주요 발견 사항 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              주요 발견 사항
            </h2>
            <ul className="mt-4 space-y-3">
              {paper.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {i + 1}
                  </span>
                  <span className="leading-[1.7] text-gray-700 dark:text-gray-300">
                    {finding}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 용어 해설 */}
          <GlossarySection terms={paper.glossary} />

          {/* 우리 생활에 어떤 영향이 있을까요? */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              우리 생활에 어떤 영향이 있을까요?
            </h2>
            <p className="mt-4 leading-[1.8] text-gray-600 dark:text-gray-400">
              {paper.whyItMatters}
            </p>
          </section>

          {/* 기술 상세 (기본 접힘) */}
          <TechnicalDetailAccordion content={paper.technicalDetail} />

          {/* 광고 슬롯 */}
          <AdSlot className="mb-10" />

          {/* arXiv 링크 */}
          <div className="mb-4 flex items-center gap-4">
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              arXiv 원문 보기
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <Link
              href="/papers"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              목록으로 돌아가기
            </Link>
          </div>
          <p className="mb-10 text-xs text-gray-400 dark:text-gray-600">
            arXiv는 전 세계 연구자들이 논문을 공유하는 무료 학술 저장소입니다.
          </p>

          {/* 다음에 읽어볼 논문 */}
          {relatedPapers.length > 0 && (
            <section className="border-t border-gray-200 pt-10 dark:border-gray-800">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                다음에 읽어볼 논문
              </h2>
              <div className="space-y-4">
                {relatedPapers.map((p) => (
                  <PaperCard key={p.id} paper={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
