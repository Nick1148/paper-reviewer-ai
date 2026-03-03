import { Metadata } from "next";
import Link from "next/link";
import { glossaryEntries } from "@/lib/data";
import GlossaryClient from "./glossary-client";

export const metadata: Metadata = {
  title: "AI 용어 사전 - 논문읽어주는AI",
  description:
    "AI/ML 핵심 용어를 초보자도 이해할 수 있도록 쉽게 설명합니다. LLM, Transformer, RLHF 등 주요 용어 해설.",
};

export default function GlossaryPage() {
  // 카테고리별 그룹핑
  const categories = ["기본 개념", "모델/아키텍처", "학습 방법", "평가 지표"];
  const grouped = categories.map((cat) => ({
    name: cat,
    entries: glossaryEntries.filter((e) => e.category === cat),
  }));

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 pb-12 pt-16 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            <span aria-hidden="true">📖</span> AI 용어 사전
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            AI 논문에서 자주 등장하는 용어를 초보자도 이해할 수 있도록
            쉬운 비유와 함께 설명합니다.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 pt-8">
        <div className="mx-auto max-w-4xl">
          <GlossaryClient grouped={grouped} />

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
