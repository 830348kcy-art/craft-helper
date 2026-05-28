import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";
import { SmartIcon } from "./SmartIcon";
import { getBlockTexture } from "@/lib/textures";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-wiki-header text-white shadow-md">
      {/* 상단 다크 그린 메인 바 */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-base shrink-0 group"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-white/10 group-hover:bg-white/20 transition p-1">
            <SmartIcon
              image={getBlockTexture("grass_block")}
              emoji="⛏"
              size="sm"
              alt="Wiki logo"
            />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight">마인크래프트 위키</span>
            <span className="text-[10px] text-white/60 font-normal -mt-0.5">한국어 비공식</span>
          </span>
        </Link>

        <div className="flex-1" />

        <SearchBox
          placeholder="위키 내 검색…"
          className="hidden sm:block w-64 lg:w-80"
        />
        <ThemeToggle />
      </div>

      {/* 하단 카테고리 네비게이션 (위키 탭) */}
      <nav className="bg-wiki-headerHover/40 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-1 text-[13px] overflow-x-auto">
          <NavTab href="/">대문</NavTab>
          <NavTab href="/wiki/getting-started">처음 시작하기</NavTab>
          <NavTab href="/wiki/diamond">다이아몬드</NavTab>
          <NavTab href="/wiki/nether-portal">네더 차원문</NavTab>
          <NavTab href="/wiki/auto-farm">자동 농장</NavTab>
          <span className="mx-2 text-white/30">|</span>
          <NavTab href="/category/blocks">블록</NavTab>
          <NavTab href="/category/items">아이템</NavTab>
          <NavTab href="/category/redstone">레드스톤</NavTab>
          <NavTab href="/category/nether">네더</NavTab>
          <NavTab href="/category/end">엔드</NavTab>
        </div>
      </nav>
    </header>
  );
}

function NavTab({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-sm text-white/85 hover:bg-white/10 hover:text-white whitespace-nowrap transition-colors"
    >
      {children}
    </Link>
  );
}
