"use client";
import Link from "next/link";
import { SearchBox } from "./SearchBox";

const HOT = ["다이아몬드", "네더라이트", "화로", "마법부여대", "호퍼"];

export function HeroSearch() {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <SearchBox
        placeholder="예: 다이아몬드, 화로, 호퍼, 레시피…"
        className="w-full [&>form>div]:h-14 [&>form>div]:rounded-xl [&>form>div]:shadow-md [&>form>div>span]:text-xl [&>form>div>input]:text-base"
      />
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-zinc-500">
        <span>인기 검색어:</span>
        {HOT.map((t) => (
          <Link
            key={t}
            href={`/search?q=${encodeURIComponent(t)}`}
            className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            {t}
          </Link>
        ))}
      </div>
    </div>
  );
}
