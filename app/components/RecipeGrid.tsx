"use client";
import { getTextureByName } from "@/lib/textures";
import { SmartIcon } from "./SmartIcon";

/** 마인크래프트 인벤토리 스타일의 3×3 제작창 시각화. */
export function RecipeGrid({ grid }: { grid: string[][] }) {
  return (
    <div className="inline-grid grid-cols-3 gap-1 p-2 rounded-lg bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 shadow-inner">
      {grid.flat().map((cell, i) => {
        const texture = cell ? getTextureByName(cell) : undefined;
        return (
          <div
            key={i}
            title={cell || ""}
            className="w-14 h-14 rounded-md flex items-center justify-center
              bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900
              border border-zinc-400/40 dark:border-zinc-600/40 shadow-sm
              transition hover:from-white hover:to-zinc-100 dark:hover:from-zinc-700 dark:hover:to-zinc-800"
          >
            {cell ? (
              <SmartIcon image={texture} emoji="🟫" size="md" alt={cell} />
            ) : (
              <span className="w-1 h-1 rounded-full bg-zinc-400/40" />
            )}
          </div>
        );
      })}
    </div>
  );
}
