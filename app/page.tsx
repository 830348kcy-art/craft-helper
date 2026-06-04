import Link from "next/link";
import { categories, featuredGuides, docs } from "@/lib/data";
import { SmartIcon } from "./components/SmartIcon";
import { PageShell, WikiSection } from "./components/PageShell";
import { getBlockTexture, getItemTexture, getCategoryTexture } from "@/lib/textures";
import { loadAllData } from "@/lib/sheets";

const GUIDE_TEXTURE: Record<string, string> = {
  "getting-started": getBlockTexture("crafting_table"),
  diamond: getItemTexture("diamond"),
  "nether-portal": getBlockTexture("obsidian"),
  "auto-farm": getItemTexture("wheat"),
};

export default async function HomePage() {
  const { blocks, items, recipes } = await loadAllData();
  const stats = {
    blocks: blocks.length,
    items: items.length,
    recipes: recipes.length,
    guides: Object.keys(docs).length,
  };

  return (
    <PageShell>
      {/* 히어로 */}
      <div className="wiki-hero mb-6 sm:mb-8">
        <div className="wiki-hero-banner">
          <p className="wiki-badge relative z-10 mb-3 bg-white/15 text-white border border-white/20">
            서바이벌 1.21.4 · 제작 가능 항목
          </p>
          <h1 className="wiki-hero-title">Craft Helper에 오신 것을 환영합니다</h1>
          <p className="wiki-hero-sub">
            블록·아이템·레시피를 차원과 카테고리별로 탐색하고, 한국어 가이드로
            마인크래프트를 더 쉽게 즐기세요.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatTile label="블록" value={stats.blocks} />
            <StatTile label="아이템" value={stats.items} />
            <StatTile label="레시피" value={stats.recipes} />
            <StatTile label="가이드" value={stats.guides} />
          </div>

          <div className="prose-wiki max-w-3xl">
            <p>
              <strong>Craft Helper</strong>는 모장 스튜디오의 샌드박스 게임{" "}
              <em>마인크래프트</em>를 더 쉽고 재밌게 즐기기 위한 한국어 가이드
              사이트입니다. 처음이시라면{" "}
              <Link href="/wiki/getting-started">처음 시작하기</Link>부터,
              광물은 <Link href="/wiki/diamond">다이아몬드</Link>,
              차원 탐험은 <Link href="/wiki/nether-portal">네더 차원문</Link>,
              자동화는 <Link href="/wiki/auto-farm">자동 농장</Link>을
              참고하세요.
            </p>
          </div>
        </div>
      </div>

      <WikiSection title="주요 가이드" subtitle="핵심 문서로 빠르게 시작">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredGuides.map((g) => {
            const texture = GUIDE_TEXTURE[g.slug];
            return (
              <li key={g.slug}>
                <Link href={g.href} className="wiki-card-hover flex items-start gap-4 p-4 no-underline">
                  <div className="wiki-icon-frame">
                    <SmartIcon image={texture} emoji={g.emoji} size="lg" alt={g.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-wiki-text dark:text-zinc-100 group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {g.title}
                    </p>
                    <p className="text-[12.5px] text-wiki-muted dark:text-zinc-400 mt-1.5 leading-relaxed">
                      {g.description}
                    </p>
                    <span className="inline-block mt-2 text-[12px] font-medium text-brand-600 dark:text-brand-400">
                      읽기 →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </WikiSection>

      <WikiSection title="분류" subtitle="관심 분야로 탐색">
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className={`wiki-card-hover flex flex-col items-center gap-2 p-4 text-center no-underline border-l-4 ${accentBorder(c.slug)}`}
              >
                <div className="wiki-icon-frame">
                  <SmartIcon image={getCategoryTexture(c.slug)} emoji={c.emoji} size="md" alt={c.name} />
                </div>
                <span className="text-[14px] font-semibold text-wiki-text dark:text-zinc-100">
                  {c.name}
                </span>
                <span className="text-[11px] text-wiki-muted dark:text-zinc-500 line-clamp-2 leading-snug">
                  {c.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </WikiSection>

      <WikiSection title="최근 변경" subtitle="이번 업데이트" accent="neutral">
        <ul className="space-y-3 text-[14px]">
          <ChangelogItem href="/wiki/auto-farm" label="자동 농장">
            8가지 농장 단계별 제작법 및 영상 추가
          </ChangelogItem>
          <ChangelogItem href="/wiki/diamond" label="다이아몬드">
            Y레벨 분포 변화 반영
          </ChangelogItem>
          <ChangelogItem href="/wiki/nether-portal" label="네더 차원문">
            1:8 비율 가이드
          </ChangelogItem>
          <ChangelogItem href="/category/blocks" label="블록 분류">
            오버월드·네더·엔드 차원별 세부 카테고리
          </ChangelogItem>
        </ul>
      </WikiSection>
    </PageShell>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="wiki-stat-tile">
      <span className="wiki-stat-value">{value.toLocaleString()}</span>
      <span className="wiki-stat-label">{label}</span>
    </div>
  );
}

function accentBorder(slug: string): string {
  const map: Record<string, string> = {
    blocks: "border-l-amber-500",
    items: "border-l-rose-500",
    mobs: "border-l-emerald-500",
    biomes: "border-l-green-600",
    redstone: "border-l-red-500",
    enchanting: "border-l-violet-500",
    nether: "border-l-orange-500",
    end: "border-l-indigo-500",
  };
  return map[slug] ?? "border-l-brand-500";
}

function ChangelogItem({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 items-start p-3 rounded-wiki bg-wiki-panel/50 dark:bg-zinc-800/40 border border-wiki-borderSoft/60 dark:border-zinc-700/60">
      <span className="shrink-0 text-[11px] font-medium text-wiki-muted dark:text-zinc-500 tabular-nums pt-0.5">
        {new Date().toLocaleDateString("ko-KR")}
      </span>
      <div>
        <Link href={href} className="font-semibold text-link dark:text-link-dark hover:underline">
          {label}
        </Link>
        <span className="text-wiki-muted dark:text-zinc-400"> — {children}</span>
      </div>
    </li>
  );
}
