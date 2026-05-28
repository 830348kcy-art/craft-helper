import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white inline-flex items-center justify-center text-sm shadow-md shadow-brand-500/30 group-hover:shadow-lg group-hover:shadow-brand-500/40 transition-all">⛏</span>
          <span className="hidden sm:inline tracking-tight">마인크래프트 위키</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-2 text-sm shrink-0">
          <Link href="/" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">홈</Link>
          <Link href="/wiki/getting-started" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">처음 시작하기</Link>
          <Link href="/wiki/auto-farm" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">자동 농장</Link>
          <Link href="/category/items" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">카테고리</Link>
        </nav>
        <div className="flex-1" />
        <SearchBox
          placeholder="블록, 아이템, 레시피 검색…"
          className="hidden sm:block w-64 lg:w-80"
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
