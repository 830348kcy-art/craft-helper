import { notFound } from "next/navigation";
import Link from "next/link";
import {
  DIMENSIONS,
  type DimensionId,
} from "@/lib/catalog-taxonomy";
import { getEntriesByDimension } from "@/lib/search";
import { SmartIcon } from "@/app/components/SmartIcon";
import { WikiArticle } from "@/app/components/PageShell";
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
  const entries = await getEntriesByDimension(params.id as DimensionId);
  const blocks = entries.filter((e) => e.type === "block");
  const items = entries.filter((e) => e.type === "item");

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1100px]">
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
              {dim.name} 차원의 제작 가능 블록·아이템을 세부 카테고리별로 탐색합니다.
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-8 prose-wiki">
            <p className="wiki-badge inline-flex mb-4">
              블록 <strong>{blocks.length}</strong> · 아이템 <strong>{items.length}</strong>
            </p>

            {blocks.length > 0 && (
              <section className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20">
                <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
                  🟫 블록 <span className="wiki-badge">{blocks.length}개</span>
                </h2>
                <DimensionBlockGrid
                  entries={blocks as CatalogEntry[]}
                  dimensionId={params.id as DimensionId}
                />
              </section>
            )}

            {items.length > 0 && (
              <section className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20">
                <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
                  📦 아이템 <span className="wiki-badge">{items.length}개</span>
                </h2>
                <ItemSubCategoryGrid entries={items as CatalogEntry[]} />
              </section>
            )}

            {blocks.length === 0 && items.length === 0 && (
              <p className="text-wiki-muted dark:text-zinc-500">이 차원에 등록된 항목이 없습니다.</p>
            )}

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
