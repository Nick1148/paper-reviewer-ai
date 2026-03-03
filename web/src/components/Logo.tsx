import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
        AI
      </div>
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        논문읽어주는AI
      </span>
    </Link>
  );
}
