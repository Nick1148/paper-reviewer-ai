import { GlossaryTerm } from "@/lib/types";

export default function GlossarySection({ terms }: { terms: GlossaryTerm[] }) {
  if (!terms || terms.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        <span aria-hidden="true">📖</span> 이 논문의 핵심 용어
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {terms.map((term, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {term.term}
              </span>
              {term.fullName && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {term.fullName}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {term.explanation}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
