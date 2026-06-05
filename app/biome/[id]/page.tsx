import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBiomes, getBiomeById, getBiomeImageCandidates, getMobById, getMobImageCandidates } from "@/lib/encyclopedia";
import { DIMENSIONS } from "@/lib/catalog-taxonomy";
import { SmartIcon } from "@/app/components/SmartIcon";
import { WikiArticle } from "@/app/components/PageShell";
import { getBlockTexture, getHrefByKoName } from "@/lib/textures";
import officialKo from "@/scripts/ko-lang-official.json";

export function generateStaticParams() {
  return getAllBiomes().map((b) => ({ id: b.id }));
}

const blockNames = officialKo.blocks as Record<string, string>;

export default function BiomePage({ params }: { params: { id: string } }) {
  const biome = getBiomeById(params.id);
  if (!biome) return notFound();
  const dim = DIMENSIONS.find((d) => d.id === biome.dimension);

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1 w-full">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WikiArticle>
          <div className="wiki-hero-banner !border-0">
            <nav className="text-[12px] text-white/70 mb-3">
              <Link href="/">대문</Link>
              <span className="mx-1.5">›</span>
              <Link href={`/dimension/${biome.dimension}`}>{dim?.name}</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">바이옴</span>
            </nav>
            <h1 className="wiki-hero-title flex items-center gap-3">
              <SmartIcon images={getBiomeImageCandidates(biome)} emoji={biome.emoji} size="xl" alt={biome.name} />
              {biome.name}
            </h1>
            <p className="wiki-hero-sub">{biome.description}</p>
          </div>

          <div className="px-6 sm:px-8 py-6 flex flex-wrap gap-6 items-start">
            <div className="wiki-icon-frame p-4">
              <SmartIcon images={getBiomeImageCandidates(biome)} emoji={biome.emoji} size="hero" alt={biome.name} />
            </div>
            <div className="flex-1 min-w-[240px]">
              {biome.group && (
                <p className="wiki-badge inline-flex mb-3">{biome.group}</p>
              )}
              {biome.temperature !== undefined && (
                <p className="text-[13px] text-wiki-muted mb-3">
                  온도: <strong>{biome.temperature}</strong>
                  {biome.temperature <= 0.15 && " · 눈이 내림"}
                  {biome.temperature > 0.15 && biome.temperature < 0.95 && " · 비가 내림"}
                  {biome.temperature >= 0.95 && " · 강수 없음"}
                </p>
              )}
              <p className="text-[14px] leading-relaxed">{biome.traits}</p>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-4">
            <h2 className="text-lg font-bold mb-3">등장 블록</h2>
            <ul className="flex flex-wrap gap-2 list-none pl-0">
              {biome.blocks.map((blockId) => {
                const name = blockNames[blockId] ?? blockId;
                const href = getHrefByKoName(name) ?? `/search/${blockId}?type=block`;
                return (
                  <li key={blockId}>
                    <Link href={href} className="wiki-card-hover inline-flex items-center gap-2 px-3 py-2 no-underline">
                      <SmartIcon image={getBlockTexture(blockId)} emoji="🟫" size="sm" alt={name} />
                      <span className="text-sm font-medium">{name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-6 sm:px-8 pb-8">
            <h2 className="text-lg font-bold mb-3">등장 몹</h2>
            <ul className="flex flex-wrap gap-2 list-none pl-0">
              {biome.mobs.map((mobId) => {
                const mob = getMobById(mobId);
                return (
                  <li key={mobId}>
                    <Link href={`/mob/${mobId}`} className="wiki-card-hover inline-flex items-center gap-2 px-3 py-2 text-sm font-medium no-underline">
                      {mob && (
                        <SmartIcon images={getMobImageCandidates(mob)} emoji={mob.emoji} size="xs" alt={mob.name} />
                      )}
                      {mob?.name ?? mobId.replace(/_/g, " ")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </WikiArticle>
      </div>
    </div>
  );
}
