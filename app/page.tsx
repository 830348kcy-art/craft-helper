import Link from "next/link";
import { categories, featuredGuides } from "@/lib/data";
import { CategoryCard } from "./components/CategoryCard";
import { HeroSearch } from "./components/HeroSearch";
import { SmartIcon } from "./components/SmartIcon";
import { getBlockTexture, getItemTexture } from "@/lib/textures";
import { loadAllData } from "@/lib/sheets";

// 카드별 대표 텍스처 매핑
const GUIDE_TEXTURE: Record<string, string> = {
  "getting-started": getItemTexture("oak_planks"),
  "diamond":         getItemTexture("diamond"),
  "nether-portal":   getBlockTexture("obsidian"),
  "auto-farm":       getItemTexture("wheat"),
};

const GUIDE_GRADIENT: Record<string, string> = {
  "getting-started": "from-emerald-400 via-green-500 to-teal-600",
  "diamond":         "from-cyan-400 via-sky-500 to-blue-600",
  "nether-portal":   "from-rose-500 via-red-600 to-orange-700",
  "auto-farm":       "from-yellow-400 via-amber-500 to-orange-500",
};

export default async function HomePage() {
  const { blocks, items, recipes } = await loadAllData();
  const stats = {
    blocks:  blocks.length,
    items:   items.length,
    recipes: recipes.length,
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* HERO */}
      <section className="pt-20 pb-12 text-center relative">
        {/* 픽셀 그리드 배경 */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200 text-xs font-medium mb-5">
          <span>⛏</span> 한국어 마인크래프트 위키
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
          궁금한 점을 <span className="bg-gradient-to-r from-brand-500 to-emerald-500 bg-clip-text text-transparent">검색해보세요!</span>
        </h1>
        <p className="mt-5 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          블록부터 레드스톤 회로까지, 마인크래프트의 모든 것.<br className="hidden sm:block" />
          처음 시작하는 분도 베테랑도 환영합니다.
        </p>

        <HeroSearch />

        {/* 데이터 통계 */}
        <div className="mt-10 inline-flex items-center gap-6 sm:gap-10 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <Stat number={stats.blocks}  label="블록"   />
          <Divider />
          <Stat number={stats.items}   label="아이템" />
          <Divider />
          <Stat number={stats.recipes} label="레시피" />
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold">📖 주요 가이드</h2>
            <p className="text-sm text-zinc-500 mt-1">한눈에 보는 핵심 문서</p>
          </div>
          <Link href="/category/items" className="text-sm text-link dark:text-link-dark hover:underline">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {featuredGuides.map((g) => {
            const gradient = GUIDE_GRADIENT[g.slug] ?? "from-brand-400 via-brand-500 to-emerald-600";
            const texture = GUIDE_TEXTURE[g.slug];
            return (
              <Link
                key={g.slug}
                href={g.href}
                className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                  {/* 픽셀 패턴 */}
                  <div className="absolute inset-0 opacity-10"
                       style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                  <div className="relative p-3 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <SmartIcon image={texture} emoji={g.emoji} size="xl" alt={g.title} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {g.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    {g.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                    자세히 읽기 <span aria-hidden className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold">🗂 카테고리</h2>
          <p className="text-sm text-zinc-500 mt-1">관심 있는 분야를 골라보세요</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* 보조 영역 */}
      <section className="py-12 grid md:grid-cols-2 gap-5">
        <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <SmartIcon image={getItemTexture("book")} emoji="📚" size="xl" />
          </div>
          <h3 className="font-bold text-lg mb-2">🆕 최근 업데이트된 문서</h3>
          <ul className="text-sm space-y-1.5 text-zinc-700 dark:text-zinc-300 relative">
            <li>• <Link href="/wiki/diamond" className="text-link dark:text-link-dark hover:underline">다이아몬드</Link> — Y레벨 분포 변화 반영</li>
            <li>• <Link href="/wiki/nether-portal" className="text-link dark:text-link-dark hover:underline">네더 차원문</Link> — 1:8 비율 가이드</li>
            <li>• <Link href="/wiki/auto-farm" className="text-link dark:text-link-dark hover:underline">자동 농장</Link> — 8가지 농장 단계별 제작법</li>
          </ul>
        </div>
        <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/30 dark:to-zinc-950 overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <SmartIcon image={getItemTexture("diamond_pickaxe")} emoji="⛏" size="xl" />
          </div>
          <h3 className="font-bold text-lg mb-2">💡 처음이신가요?</h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed relative">
            마인크래프트가 처음이라면 <Link href="/wiki/getting-started" className="text-link dark:text-link-dark hover:underline font-medium">처음 시작하기</Link> 가이드부터 읽어보세요.
            첫 날 밤을 안전하게 넘기는 방법을 알려드립니다.
          </p>
        </div>
      </section>
    </main>
  );
}

function Stat({ number, label }: { number: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
        {number}
      </div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />;
}
