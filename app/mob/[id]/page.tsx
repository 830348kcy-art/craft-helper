import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getAllMobs, getMobById, getMobImageCandidates } from "@/lib/encyclopedia";
import { DIMENSIONS } from "@/lib/catalog-taxonomy";
import { SmartIcon } from "@/app/components/SmartIcon";
import { WikiArticle } from "@/app/components/PageShell";
import { getItemTexture, getHrefByKoName } from "@/lib/textures";
import { getMobCategoryLabel } from "@/lib/mob-taxonomy";
import { MobDetailBack } from "@/app/components/MobDetailBack";
import { WikiBackBar } from "@/app/components/WikiBackBar";
import officialKo from "@/scripts/ko-lang-official.json";

export function generateStaticParams() {
  return getAllMobs().map((m) => ({ id: m.id }));
}

const itemNames = officialKo.items as Record<string, string>;

export default function MobPage({ params }: { params: { id: string } }) {
  const mob = getMobById(params.id);
  if (!mob) return notFound();
  const dim = DIMENSIONS.find((d) => d.id === mob.dimension);
  const defaultBackHref = `/dimension/${mob.dimension}?section=mobs`;
  const defaultBackLabel = `${dim?.name ?? mob.dimension} · 몹 목록`;

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1 w-full">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WikiArticle>
          <div className="wiki-hero-banner !border-0">
            <Suspense
              fallback={
                <WikiBackBar href={defaultBackHref} label={defaultBackLabel} variant="hero" />
              }
            >
              <MobDetailBack dimension={mob.dimension} dimName={dim?.name ?? mob.dimension} />
            </Suspense>
            <nav className="relative z-10 text-[12px] text-white/70 mb-3">
              <Link href="/">대문</Link>
              <span className="mx-1.5">›</span>
              <Link href={`/dimension/${mob.dimension}`}>{dim?.name}</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">몹</span>
            </nav>
            <h1 className="wiki-hero-title flex items-center gap-3">
              <SmartIcon images={getMobImageCandidates(mob)} emoji={mob.emoji} size="xl" alt={mob.name} />
              {mob.name}
            </h1>
            <p className="wiki-hero-sub">{mob.description}</p>
          </div>

          <div className="px-6 sm:px-8 py-6 flex flex-wrap gap-6 items-start">
            <div className="wiki-icon-frame p-4">
              <SmartIcon images={getMobImageCandidates(mob)} emoji={mob.emoji} size="hero" alt={mob.name} />
            </div>
            <div className="flex-1 min-w-[240px] grid sm:grid-cols-2 gap-4">
              <InfoRow label="체력" value={`${mob.health} HP`} />
              <InfoRow label="분류" value={getMobCategoryLabel(mob.category)} />
              <InfoRow label="차원" value={dim?.name ?? mob.dimension} />
              <InfoRow label="생성 조건" value={mob.spawn} className="sm:col-span-2" />
              <InfoRow label="특징" value={mob.traits} className="sm:col-span-2" />
            </div>
          </div>

          {mob.drops.length > 0 && (
            <div className="px-6 sm:px-8 pb-8">
              <h2 className="text-lg font-bold mb-3">드롭 아이템</h2>
              <ul className="flex flex-wrap gap-2 list-none pl-0">
                {mob.drops.map((dropId) => {
                  const name = itemNames[dropId] ?? dropId;
                  const href = getHrefByKoName(name) ?? `/search/${dropId}?type=item`;
                  return (
                    <li key={dropId}>
                      <Link href={href} className="wiki-card-hover inline-flex items-center gap-2 px-3 py-2 no-underline">
                        <SmartIcon image={getItemTexture(dropId)} emoji="📦" size="sm" alt={name} />
                        <span className="text-sm font-medium">{name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </WikiArticle>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-wiki border border-wiki-borderSoft/60 bg-wiki-panel/30 ${className}`}>
      <p className="text-[11px] font-semibold text-wiki-muted uppercase tracking-wide">{label}</p>
      <p className="text-[14px] mt-1 text-wiki-text dark:text-zinc-200">{value}</p>
    </div>
  );
}
