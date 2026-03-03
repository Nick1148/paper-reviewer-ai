"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setIsOpen(false), []);

  // 페이지 이동 시 자동 닫기
  useEffect(() => {
    close();
  }, [pathname, close]);

  // ESC 키 지원
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // body scroll 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* 메뉴 패널 */}
          <nav
            id="mobile-menu"
            className="fixed inset-x-0 top-16 z-50 border-b border-gray-200 bg-white px-4 pb-4 pt-2 shadow-lg dark:border-gray-800 dark:bg-gray-950"
          >
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-800">
              <Link
                href="/newsletter"
                className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                구독하기
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
