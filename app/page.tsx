import Link from "next/link";
import { categories, featuredGuides, docs } from "@/lib/data";
import { SmartIcon } from "./components/SmartIcon";
import { getBlockTexture, getItemTexture, getCategoryTexture } from "@/lib/textures";
import { loadAllData } from "@/lib/sheets";

const GUIDE_TEXTURE: Record<string, string> = {
  "getting-started": getBlockTexture("crafting_table"),
  "diamond":         getItemTexture("diamond"),
  "nether-portal":   getBlockTexture("obsidian"),
  "auto-farm":       getItemTexture("wheat"),
};

export default async function HomePage() {
  const { blocks, items, recipes } = await loadAllData();
  const stats = {
    blocks: blocks.length,
    items: items.length,
    recipes: recipes.length,
  };

  return (
    <div className="bg-wiki-bg dark:bg-zinc-950 min-h-[80vh]">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* 대문 헤더 */}
        <div className="bg-white dark:bg-zinc-900 border border-wiki-border dark:border-zinc-700 shadow-sm">
          <div className="bg-wiki-panelHead/70 dark:bg-zinc-800 border-b border-wiki-border dark:border-zinc-700 px-6 py-3">
            <h1 className="font-wiki text-[1.8rem] font-normal text-wiki-text dark:text-zinc-100 leading-tight">
              Craft Helper에 오신 것을 환영합니다
            </h1>
            <p className="text-[13px] text-wiki-muted dark:text-zinc-400 mt-0.5">
              한국어 마인크래프트 가이드 · 블록 · 아이템 · 레시피 · 자동 농장
            </p>
          </div>

          <div className="p-6 grid md:grid-cols-[1fr_280px] gap-6">
            <div className="prose-wiki">
              <p>
                <strong>Craft Helper</strong>는 모장 스튜디오의 샌드박스 게임{" "}
                <em>마인크래프트</em>를 더 쉽고 재밌게 즐기기 위한 한국어 가이드 사이트입니다.
                현재 <strong>{stats.blocks}</strong>개의 블록, <strong>{stats.items}</strong>개의 아이템,{" "}
                <strong>{stats.recipes}</strong>개의 레시피와 4편의 주요 가이드가 등록되어 있습니다.
              </p>
              <p>
                처음 마인크래프트를 시작하시는 분은{" "}
                <Link href="/wiki/getting-started">처음 시작하기</Link>를 먼저 읽어보시고,
                광물을 찾고 계신다면 <Link href="/wiki/diamond">다이아몬드</Link> 문서를,
                네더 차원을 탐험하려면 <Link href="/wiki/nether-portal">네더 차원문</Link>을 참고하세요.
                자동화에 관심 있다면 <Link href="/wiki/auto-farm">자동 농장</Link>{" "}
                가이드에서 8가지 농장을 만드는 방법을 확인할 수 있습니다.
              </p>
            </div>

            {/* 우측 통계 박스 */}
            <aside className="border border-wiki-border dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[13px]">
              <div className="bg-wiki-panelHead dark:bg-zinc-800 border-b border-wiki-border dark:border-zinc-700 px-3 py-2 text-center font-bold">
                위키 통계
              </div>
              <dl className="divide-y divide-wiki-borderSoft dark:divide-zinc-800">
                <StatRow label="블록"  value={stats.blocks} />
                <StatRow label="아이템" value={stats.items} />
                <StatRow label="레시피" value={stats.recipes} />
                <StatRow label="가이드" value={Object.keys(docs).length} />
              </dl>
            </aside>
          </div>
        </div>

        {/* 주요 가이드 */}
        <WikiSection title="주요 가이드" subtitle="자주 찾는 핵심 문서">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredGuides.map((g) => {
              const texture = GUIDE_TEXTURE[g.slug];
              return (
                <li key={g.slug}>
                  <Link
                    href={g.href}
                    className="flex items-start gap-3 p-3 border border-wiki-borderSoft dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-wiki-panel/50 dark:hover:bg-zinc-800 transition"
                  >
                    <div className="shrink-0 p-2 border border-wiki-borderSoft dark:border-zinc-700 bg-wiki-panel dark:bg-zinc-800">
                      <SmartIcon image={texture} emoji={g.emoji} size="lg" alt={g.title} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-link dark:text-link-dark hover:underline">
                        {g.title}
                      </p>
                      <p className="text-[12.5px] text-wiki-muted dark:text-zinc-400 mt-1 leading-snug">
                        {g.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </WikiSection>

        {/* 카테고리 */}
        <WikiSection title="분류" subtitle="관심 분야로 탐색">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 p-2.5 border border-wiki-borderSoft dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-wiki-panel/50 dark:hover:bg-zinc-800 transition"
                >
                  <SmartIcon image={getCategoryTexture(c.slug)} emoji={c.emoji} size="sm" alt={c.name} />
                  <span className="text-[13.5px] text-link dark:text-link-dark hover:underline font-medium">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </WikiSection>

        {/* 알림 박스 */}
        <WikiSection title="최근 변경" subtitle="이번 주 업데이트">
          <ul className="space-y-1.5 text-[14px] prose-wiki">
            <li>
              <span className="text-wiki-muted dark:text-zinc-500 text-[12px] mr-2">
                {new Date().toLocaleDateString("ko-KR")}
              </span>
              <Link href="/wiki/auto-farm">자동 농장</Link> — 8가지 농장 단계별 제작법 및 영상 추가
            </li>
            <li>
              <span className="text-wiki-muted dark:text-zinc-500 text-[12px] mr-2">
                {new Date().toLocaleDateString("ko-KR")}
              </span>
              <Link href="/wiki/diamond">다이아몬드</Link> — Y레벨 분포 변화 반영
            </li>
            <li>
              <span className="text-wiki-muted dark:text-zinc-500 text-[12px] mr-2">
                {new Date().toLocaleDateString("ko-KR")}
              </span>
              <Link href="/wiki/nether-portal">네더 차원문</Link> — 1:8 비율 가이드
            </li>
          </ul>
        </WikiSection>

        {/* 도움말 박스 */}
        <div className="mt-6 border-l-4 border-wiki-accent bg-wiki-panel/50 dark:bg-zinc-900 dark:border-brand-500 p-4 text-[13.5px] text-wiki-text dark:text-zinc-300 leading-relaxed">
          <strong className="block mb-1">💡 알림</strong>
          이 위키는 학습용 데모입니다. 공식 정보는{" "}
          <a
            href="https://ko.minecraft.wiki"
            target="_blank"
            rel="noreferrer noopener"
            className="text-link dark:text-link-dark hover:underline"
          >
            ko.minecraft.wiki
          </a>
          를 참고하세요.
        </div>
      </main>
    </div>
  );
}

function WikiSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 bg-white dark:bg-zinc-900 border border-wiki-border dark:border-zinc-700 shadow-sm">
      <div className="bg-wiki-panelHead/70 dark:bg-zinc-800 border-b border-wiki-border dark:border-zinc-700 px-5 py-2.5">
        <h2 className="font-wiki text-[1.25rem] font-normal text-wiki-text dark:text-zinc-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[12px] text-wiki-muted dark:text-zinc-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-2 px-3 py-1.5">
      <dt className="text-wiki-muted dark:text-zinc-400">{label}</dt>
      <dd className="text-right font-bold text-wiki-text dark:text-zinc-100">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}
