import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";
import { SmartIcon } from "./SmartIcon";
import { getBlockTexture } from "@/lib/textures";

export function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 shadow-wiki-lg">
      <div className="site-header-bar text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-4 sm:gap-5 shrink-0 group min-w-0">
            <span className="site-header-logo group-hover:scale-[1.02] transition-transform duration-200">
              <SmartIcon
                image={getBlockTexture("grass_block")}
                emoji="⛏"
                size="md"
                alt="Craft Helper"
              />
            </span>
            <span className="flex flex-col min-w-0 leading-tight">
              <span className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[1.35rem] sm:text-[1.65rem] font-bold tracking-tight">
                  Craft Helper
                </span>
                <span className="text-[0.7rem] sm:text-[0.8rem] font-normal text-white/50 tracking-wide">
                  with java
                </span>
              </span>
              <span className="text-[11px] sm:text-[12px] text-white/45 font-normal mt-1">
                한국어 마인크래프트 가이드
              </span>
            </span>
          </Link>

          <div className="flex-1 min-w-[1rem]" />

          <SearchBox
            placeholder="블록·아이템·레시피 검색…"
            className="hidden sm:block w-52 md:w-64 lg:w-80 max-w-[40vw]"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
