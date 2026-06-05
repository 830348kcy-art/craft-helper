"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { DimensionId } from "@/lib/catalog-taxonomy";
import type { MobEntry, BiomeEntry } from "@/lib/encyclopedia";
import { SmartIcon } from "./SmartIcon";
import { DimensionSearch } from "./DimensionSearch";
import { MobGrid, BiomeGrid } from "./MobBiomeGrid";
import {
  DimensionBlockGrid,
  ItemSubCategoryGrid,
  type CatalogEntry,
} from "./DimensionCategoryGrid";
import { getBlockTexture, getItemTexture } from "@/lib/textures";
import { WikiBackBar } from "./WikiBackBar";

type Category = "blocks" | "items" | "mobs" | "biomes";

const CATEGORIES: {
  id: Category;
  label: string;
  emoji: string;
  texture: (dim: DimensionId) => string | undefined;
}[] = [
  { id: "blocks", label: "블록", emoji: "🟫", texture: () => getBlockTexture("oak_planks") },
  { id: "items", label: "아이템", emoji: "📦", texture: () => getItemTexture("diamond") },
  { id: "mobs", label: "몹", emoji: "🐾", texture: () => undefined },
  { id: "biomes", label: "바이옴", emoji: "🌿", texture: () => getBlockTexture("grass_block") },
];

const VALID_SECTIONS = new Set<Category>(["blocks", "items", "mobs", "biomes"]);

export function DimensionExplorer({
  dimensionId,
  dimName,
  blocks,
  items,
  mobs,
  biomes,
}: {
  dimensionId: DimensionId;
  dimName: string;
  blocks: CatalogEntry[];
  items: CatalogEntry[];
  mobs: MobEntry[];
  biomes: BiomeEntry[];
}) {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const [active, setActive] = useState<Category | null>(null);

  useEffect(() => {
    if (sectionParam && VALID_SECTIONS.has(sectionParam as Category)) {
      setActive(sectionParam as Category);
    }
  }, [sectionParam]);

  const mobBackFrom = `/dimension/${dimensionId}?section=mobs`;

  const counts: Record<Category, number> = {
    blocks: blocks.length,
    items: items.length,
    mobs: mobs.length,
    biomes: biomes.length,
  };

  if (active === null) {
    return (
      <div>
        <DimensionSearch dimension={dimensionId} />
        <p className="text-[13px] text-wiki-muted dark:text-zinc-400 mb-4">
          {dimName}에서 찾을 분류를 선택하세요.
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 list-none pl-0">
          {CATEGORIES.map((cat) => {
            const n = counts[cat.id];
            if (n === 0) return null;
            return (
              <li key={cat.id} className="list-none">
                <Link
                  href={`/dimension/${dimensionId}?section=${cat.id}`}
                  className="wiki-portal-card w-full text-left group block no-underline"
                >
                  <div className="wiki-portal-card-icon">
                    <SmartIcon
                      image={cat.texture(dimensionId)}
                      emoji={cat.emoji}
                      size="lg"
                      alt={cat.label}
                    />
                  </div>
                  <div className="wiki-portal-card-label">
                    <span className="font-semibold text-[14px]">{cat.label}</span>
                    <span className="block text-[11px] text-wiki-muted mt-0.5">{n}개</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const catMeta = CATEGORIES.find((c) => c.id === active)!;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <WikiBackBar
          href={`/dimension/${dimensionId}`}
          label={`${dimName} 분류 선택`}
          className="!mb-0"
        />
        <span className="wiki-badge">
          {catMeta.emoji} {catMeta.label} · {counts[active]}개
        </span>
      </div>

      <DimensionSearch
        dimension={dimensionId}
        placeholder={`${dimName} · ${catMeta.label} 검색…`}
      />

      {active === "blocks" && (
        <DimensionBlockGrid entries={blocks} dimensionId={dimensionId} />
      )}
      {active === "items" && <ItemSubCategoryGrid entries={items} />}
      {active === "mobs" && <MobGrid mobs={mobs} backFrom={mobBackFrom} />}
      {active === "biomes" && <BiomeGrid biomes={biomes} />}
    </div>
  );
}
