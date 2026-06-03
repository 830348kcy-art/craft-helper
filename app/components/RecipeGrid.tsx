"use client";
import Link from "next/link";
import { getTextureByName, getHrefByKoName } from "@/lib/textures";
import { SmartIcon } from "./SmartIcon";

const CELL_CLASS =
  "group relative w-14 h-14 rounded-md flex items-center justify-center " +
  "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 " +
  "border border-zinc-400/40 dark:border-zinc-600/40 shadow-sm " +
  "transition hover:from-white hover:to-zinc-100 dark:hover:from-zinc-700 dark:hover:to-zinc-800";

function RecipeCell({ cell }: { cell: string }) {
  const texture = getTextureByName(cell);
  const href = getHrefByKoName(cell);

  const content = (
    <>
      <SmartIcon image={texture} emoji="🟫" size="md" alt={cell} />
      <span
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1
          whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] leading-tight text-white
          bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        {cell}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${CELL_CLASS} cursor-pointer`}>
        {content}
      </Link>
    );
  }

  return <div className={CELL_CLASS}>{content}</div>;
}

/** 마인크래프트 인벤토리 스타일의 3×3 제작창 시각화. */
export function RecipeGrid({ grid }: { grid: string[][] }) {
  return (
    <div className="inline-grid grid-cols-3 gap-1 p-2 rounded-lg bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 shadow-inner">
      {grid.flat().map((cell, i) =>
        cell ? (
          <RecipeCell key={i} cell={cell} />
        ) : (
          <div
            key={i}
            className="w-14 h-14 rounded-md flex items-center justify-center
              bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900
              border border-zinc-400/40 dark:border-zinc-600/40 shadow-sm"
          >
            <span className="w-1 h-1 rounded-full bg-zinc-400/40" />
          </div>
        )
      )}
    </div>
  );
}
