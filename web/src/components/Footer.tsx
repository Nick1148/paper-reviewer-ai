import Link from "next/link";
import { getArxivCategories } from "@/lib/data";
import { navItems } from "@/lib/navigation";
import Logo from "./Logo";

export default function Footer() {
  const categories = getArxivCategories();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              매일 최신 AI 논문을 5분 만에 이해할 수 있는 한국어 해설을
              제공합니다. 연구자, 개발자, AI에 관심 있는 모든 분들을 위한
              논문 리뷰 서비스입니다.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              분야별 논문
            </h3>
            <ul className="mt-4 space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/papers?category=${cat.id}`}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {cat.icon} {cat.nameKo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              바로가기
            </h3>
            <ul className="mt-4 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} 논문읽어주는AI. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
