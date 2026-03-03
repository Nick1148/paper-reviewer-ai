import Link from "next/link";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <DesktopNav />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/newsletter"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:block"
            >
              구독하기
            </Link>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
