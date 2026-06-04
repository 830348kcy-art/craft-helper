import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";
import { SmartIcon } from "./SmartIcon";
import { getBlockTexture } from "@/lib/textures";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 shadow-wiki-lg">
      <div className="bg-wiki-header/95 dark:bg-zinc-950/90 backdrop-blur-md text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[3.75rem] flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold shrink-0 group"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-wiki bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/20 group-hover:ring-white/40 group-hover:scale-[1.02] transition-all duration-200 p-1.5 shadow-wiki-glow">
              <SmartIcon
                image={getBlockTexture("grass_block")}
                emoji="⛏"
                size="sm"
                alt="Craft Helper"
              />
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-[15px] font-bold tracking-tight">Craft Helper</span>
              <span className="text-[10px] text-white/55 font-normal">
                한국어 마인크래프트 가이드
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          <SearchBox
            placeholder="블록·아이템·레시피 검색…"
            className="hidden sm:block w-64 lg:w-80"
          />
          <ThemeToggle />
        </div>
      </div>

      <nav className="bg-wiki-headerHover/90 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-white/8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-0.5 text-[13px] overflow-x-auto scrollbar-thin">
          <NavTab href="/">대문</NavTab>
          <NavTab href="/wiki/getting-started">처음 시작하기</NavTab>
          <NavTab href="/wiki/diamond">다이아몬드</NavTab>
          <NavTab href="/wiki/nether-portal">네더</NavTab>
          <NavTab href="/wiki/auto-farm">자동 농장</NavTab>
          <span className="mx-2 h-4 w-px bg-white/20 shrink-0" aria-hidden />
          <NavTab href="/category/blocks">블록</NavTab>
          <NavTab href="/category/items">아이템</NavTab>
          <NavTab href="/category/redstone">레드스톤</NavTab>
          <NavTab href="/category/nether">네더</NavTab>
          <NavTab href="/category/end">엔드</NavTab>
          <NavTab href="/search" className="ml-auto sm:ml-2">
            검색
          </NavTab>
        </div>
      </nav>
    </header>
  );
}

function NavTab({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-white/80 hover:bg-white/12 hover:text-white whitespace-nowrap transition-all duration-150 font-medium ${className}`}
    >
      {children}
    </Link>
  );
}
