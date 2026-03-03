import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { getAllPapers, getArxivCategories } from "@/lib/data";
import PapersFeed from "./papers-feed";

export default async function HomePage() {
  const papers = await getAllPapers();
  const categories = getArxivCategories();

  // 날짜별 그룹핑
  const papersByDate: Record<string, typeof papers> = {};
  for (const paper of papers) {
    const date = paper.publishedDate;
    if (!papersByDate[date]) {
      papersByDate[date] = [];
    }
    papersByDate[date].push(paper);
  }

  const sortedDates = Object.keys(papersByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 pb-16 pt-20 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            AI 논문,{" "}
            <span className="text-blue-600">5분이면 충분합니다</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            전문 지식 없이도 이해할 수 있도록 한국어로 풀어드립니다.
            매일 arXiv에서 엄선된 최신 AI 논문을 쉽고 재미있게 해설합니다.
          </p>

          {/* 초보자 안심 배지 */}
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-3">
            <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              <span aria-hidden="true">✅</span> 전문 용어 해설 포함
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              <span aria-hidden="true">📖</span> 난이도 표시
            </span>
            <span className="rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              <span aria-hidden="true">🇰🇷</span> 100% 한국어
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
            매일 엄선된 AI 논문 해설을 받아보세요. 언제든지 구독 취소 가능합니다.
          </p>
        </div>
      </section>

      {/* 논문 피드 */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              오늘의 논문 해설
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              매일 업데이트되는 AI 논문 해설
            </p>
          </div>

          <PapersFeed
            papers={papers}
            categories={categories}
            papersByDate={papersByDate}
            sortedDates={sortedDates}
            maxCount={6}
          />

          <div className="mt-8 text-center">
            <Link
              href="/papers"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              모든 논문 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 하단 뉴스레터 CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            매일 AI 논문 해설을 받아보세요
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            매일 엄선된 AI 논문 해설과 핵심 인사이트를 이메일로 보내드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
