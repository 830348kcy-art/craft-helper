import Link from "next/link";
import { categories, docs } from "@/lib/data";

export function Sidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pl-4 pr-3 text-sm">
        <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">탐색</p>
        <ul className="space-y-0.5 mb-6">
          <li><Link href="/" className="block px-2 py-1.5 rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800">🏠 메인 페이지</Link></li>
          <li><Link href="/wiki/getting-started" className="block px-2 py-1.5 rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800">🌅 처음 시작하기</Link></li>
        </ul>

        <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">카테고리</p>
        <ul className="space-y-0.5 mb-6">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">최근 문서</p>
        <ul className="space-y-0.5">
          {Object.values(docs).map((d) => (
            <li key={d.slug}>
              <Link
                href={`/wiki/${d.slug}`}
                className={`block px-2 py-1.5 rounded hover:bg-zinc-200/60 dark:hover:bg-zinc-800 ${
                  activeSlug === d.slug ? "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200 font-medium" : ""
                }`}
              >
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
