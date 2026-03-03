"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
