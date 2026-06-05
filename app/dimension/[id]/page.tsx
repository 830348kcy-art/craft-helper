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
import { DimensionExplorer } from "@/app/components/DimensionExplorer";
import { type CatalogEntry } from "@/app/components/DimensionCategoryGrid";
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
  const blocks = entries.filter((e) => e.type === "block") as CatalogEntry[];
  const items = entries.filter((e) => e.type === "item") as CatalogEntry[];
  const mobs = getMobsByDimension(dimensionId);
  const biomes = getBiomesByDimension(dimensionId);

  const counts = [blocks.length, items.length, mobs.length, biomes.length];

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
              분류를 선택한 뒤 블록·아이템·몹·바이옴을 탐색하세요.
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-8 prose-wiki">
            <p className="wiki-badge inline-flex mb-6 flex-wrap gap-2">
              <span>블록 <strong>{counts[0]}</strong></span>
              <span>·</span>
              <span>아이템 <strong>{counts[1]}</strong></span>
              <span>·</span>
              <span>몹 <strong>{counts[2]}</strong></span>
              <span>·</span>
              <span>바이옴 <strong>{counts[3]}</strong></span>
            </p>

            <DimensionExplorer
              dimensionId={dimensionId}
              dimName={dim.name}
              blocks={blocks}
              items={items}
              mobs={mobs}
              biomes={biomes}
            />

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
