import { notFound } from "next/navigation";
import Link from "next/link";
import {
  DIMENSIONS,
  type DimensionId,
} from "@/lib/catalog-taxonomy";
import { getEntriesByDimension } from "@/lib/search";
import { getMobsByDimension, getBiomesByDimension } from "@/lib/encyclopedia";
import { SmartIcon } from "@/app/components/SmartIcon";
import { WikiArticle } from "@/app/components/PageShell";
import { DimensionSearch } from "@/app/components/DimensionSearch";
import { MobGrid, BiomeGrid } from "@/app/components/MobBiomeGrid";
import {
  DimensionBlockGrid,
  ItemSubCategoryGrid,
  type CatalogEntry,
} from "@/app/components/DimensionCategoryGrid";
import { getCategoryTexture } from "@/lib/textures";

const VALID = new Set(DIMENSIONS.map((d) => d.id));

export function generateStaticParams() {
  return DIMENSIONS.map((d) => ({ id: d.id }));
}

export default async function DimensionPage({ params }: { params: { id: string } }) {
  if (!VALID.has(params.id as DimensionId)) return notFound();
  const dim = DIMENSIONS.find((d) => d.id === params.id)!;
  const dimensionId = params.id as DimensionId;
  const entries = await getEntriesByDimension(dimensionId);
  const blocks = entries.filter((e) => e.type === "block");
  const items = entries.filter((e) => e.type === "item");
  const mobs = getMobsByDimension(dimensionId);
  const biomes = getBiomesByDimension(dimensionId);

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1 w-full">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WikiArticle>
          <div className="wiki-hero-banner !border-0">
            <nav className="relative z-10 text-[12px] text-white/70 mb-3">
              <Link href="/" className="hover:text-white transition-colors">대문</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">{dim.name}</span>
            </nav>
            <h1 className="wiki-hero-title flex items-center gap-3 !text-[1.85rem] sm:!text-[2.1rem]">
              <span className="wiki-icon-frame !bg-white/15 !border-white/20 p-2">
                <SmartIcon
                  image={getCategoryTexture(dim.id)}
                  emoji={dim.emoji}
                  size="lg"
                  alt={dim.name}
                />
              </span>
              {dim.name}
            </h1>
            <p className="wiki-hero-sub">
              블록 · 아이템 · 몹 · 바이옴을 차원 안에서만 탐색합니다.
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-8 prose-wiki">
            <DimensionSearch dimension={dimensionId} />

            <p className="wiki-badge inline-flex mb-6 flex-wrap gap-2">
              <span>블록 <strong>{blocks.length}</strong></span>
              <span>·</span>
              <span>아이템 <strong>{items.length}</strong></span>
              <span>·</span>
              <span>몹 <strong>{mobs.length}</strong></span>
              <span>·</span>
              <span>바이옴 <strong>{biomes.length}</strong></span>
            </p>

            {blocks.length > 0 && (
              <section id="blocks" className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20 scroll-mt-24">
                <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
                  🟫 블록 <span className="wiki-badge">{blocks.length}개</span>
                </h2>
                <DimensionBlockGrid
                  entries={blocks as CatalogEntry[]}
                  dimensionId={dimensionId}
                />
              </section>
            )}

            {items.length > 0 && (
              <section id="items" className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20 scroll-mt-24">
                <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
                  📦 아이템 <span className="wiki-badge">{items.length}개</span>
                </h2>
                <ItemSubCategoryGrid entries={items as CatalogEntry[]} />
              </section>
            )}

            {mobs.length > 0 && (
              <section id="mobs" className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20 scroll-mt-24">
                <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
                  🐾 몹 <span className="wiki-badge">{mobs.length}개</span>
                </h2>
                <MobGrid mobs={mobs} />
              </section>
            )}

            {biomes.length > 0 && (
              <section id="biomes" className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20 scroll-mt-24">
                <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
                  🌿 바이옴 <span className="wiki-badge">{biomes.length}개</span>
                </h2>
                <BiomeGrid biomes={biomes} />
              </section>
            )}

            <nav className="!mt-10 flex flex-wrap gap-2 text-sm">
              <a href="#blocks" className="wiki-badge hover:bg-brand-50">블록</a>
              <a href="#items" className="wiki-badge hover:bg-brand-50">아이템</a>
              <a href="#mobs" className="wiki-badge hover:bg-brand-50">몹</a>
              <a href="#biomes" className="wiki-badge hover:bg-brand-50">바이옴</a>
            </nav>

            <h2 className="!mt-12">다른 차원</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 list-none pl-0">
              {DIMENSIONS.filter((d) => d.id !== dim.id).map((d) => (
                <li key={d.id} className="list-none">
                  <Link
                    href={`/dimension/${d.id}`}
                    className={`wiki-card-hover flex items-center gap-2 px-4 py-3 no-underline ${d.color}`}
                  >
                    <span>{d.emoji}</span>
                    <span className="font-semibold">{d.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </WikiArticle>
      </div>
    </div>
  );
}
