import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllItems } from "@/lib/search";
import { loadAllData } from "@/lib/sheets";
import { getItemTexture, getBlockTexture, getTextureByName, getHrefByKoName, getCategoryTexture } from "@/lib/textures";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { PrerequisiteRecipes } from "@/app/components/PrerequisiteRecipes";
import { SmartIcon } from "@/app/components/SmartIcon";
import { RelatedItems } from "@/app/components/RelatedItems";
import { RecipeGrid } from "@/app/components/RecipeGrid";

const TYPE_LABEL: Record<string, string> = { block: "블록", item: "아이템", recipe: "레시피" };
const TYPE_COLOR: Record<string, string> = {
  block:  "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  item:   "bg-blue-100  text-blue-800  dark:bg-blue-900/40  dark:text-blue-200",
  recipe: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
};
const HERO_BG: Record<string, string> = {
  block:  "from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-950",
  item:   "from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/40 dark:via-zinc-900 dark:to-zinc-950",
  recipe: "from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-zinc-900 dark:to-zinc-950",
};
const ACCENT: Record<string, string> = {
  block:  "amber",
  item:   "blue",
  recipe: "violet",
};

// 정적 배포에서 searchParams 사용 허용
export const dynamic = "force-static";

export async function generateStaticParams() {
  const all = await getAllItems();
  // 중복 ID 제거 (같은 ID의 item/recipe가 있을 때 하나만 생성)
  const seen = new Set<string>();
  return all
    .filter((r) => { if (seen.has(r.id)) return false; seen.add(r.id); return true; })
    .map((r) => ({ id: r.id }));
}

export default async function SearchDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  const all = await getAllItems();
  // type 파라미터가 없으면 데이터에 존재하는 타입 중 우선순위로 자동 감지
  const preferredType = searchParams.type;
  const entry =
    (preferredType
      ? all.find((r) => r.id === params.id && r.type === preferredType)
      : undefined) ??
    all.find((r) => r.id === params.id && r.type === "recipe") ??
    all.find((r) => r.id === params.id && r.type === "item") ??
    all.find((r) => r.id === params.id && r.type === "block") ??
    all.find((r) => r.id === params.id);
  if (!entry) return notFound();
  const type = entry.type;

  const { blocks, items, recipes } = await loadAllData();
  const raw: any =
    type === "block"
      ? blocks.find((b) => b.id === params.id)
      : type === "item"
      ? items.find((it) => it.id === params.id)
      : recipes.find((r) => r.id === params.id);

  const related = all
    .filter((r) => r.id !== entry.id && r.category === entry.category)
    .slice(0, 6);

  const usedInRecipes =
    type === "recipe"
      ? []
      : recipes
          .filter((r) =>
            r.ingredients.some((ing) => ing.includes(entry.name))
          )
          .map((r) => all.find((a) => a.id === r.id && a.type === "recipe"))
          .filter((x): x is NonNullable<typeof x> => Boolean(x))
          .slice(0, 6);

  return (
    <main className="max-w-[920px] mx-auto px-4 sm:px-6 py-8 bg-wiki-bg dark:bg-zinc-950 min-h-[80vh]">
      <Breadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "검색", href: "/search" },
          { label: entry.name },
        ]}
      />

      {/* HERO — 큰 아이콘 + 제목 + 설명 */}
      <section className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${HERO_BG[entry.type]} border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8`}>
        {/* 픽셀 그리드 배경 */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
             style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

        <div className="relative flex items-center gap-6 p-6 sm:p-8 flex-col sm:flex-row">
          <div className="shrink-0 p-4 rounded-2xl bg-white/80 dark:bg-zinc-950/60 backdrop-blur-sm border border-white/60 dark:border-zinc-800 shadow-lg">
            <SmartIcon textureId={entry.id} image={entry.image} emoji={entry.emoji} size="hero" alt={entry.name} />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center gap-2 mb-2 flex-wrap justify-center sm:justify-start">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLOR[entry.type]}`}>
                {TYPE_LABEL[entry.type]}
              </span>
              <span className="text-sm text-zinc-500">{entry.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">{entry.name}</h1>
            <p className="mt-3 text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {entry.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4 justify-center sm:justify-start">
              {entry.tags.map((t) => (
                <Link
                  key={t}
                  href={`/search?q=${encodeURIComponent(t)}`}
                  className="px-2 py-0.5 rounded-full text-xs bg-white/70 dark:bg-zinc-950/40 hover:bg-white dark:hover:bg-zinc-800 border border-white/60 dark:border-zinc-800 transition"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 블록 전용 정보 */}
      {type === "block" && raw && (
        <InfoCard color="amber" emoji="🧱" image={getBlockTexture("crafting_table")} title="블록 정보" rows={[
          { label: "최적 도구",        value: raw.tool || "—" },
          { label: "경도 (Hardness)",  value: String(raw.hardness ?? "—") },
          { label: "카테고리",          value: raw.category },
          { label: "ID",               value: <code className="text-xs">{raw.id}</code> },
        ]} />
      )}

      {/* 아이템 전용 정보 */}
      {type === "item" && raw && (
        <InfoCard color="blue" emoji="📦" image={getBlockTexture("chest")} title="아이템 정보" rows={[
          { label: "카테고리",   value: raw.category },
          { label: "최대 스택", value: `${raw.stackSize}개` },
          { label: "ID",        value: <code className="text-xs">{raw.id}</code> },
        ]} />
      )}

      {/* 레시피 전용 정보 */}
      {type === "recipe" && raw && (
        <section className="mb-8">
          <InfoCard color="violet" emoji="📜" image={getItemTexture("writable_book")} title="레시피 정보" rows={[
            { label: "제작 결과",   value: `${raw.resultItem} ×${raw.resultCount}` },
            { label: "제작창 종류", value: raw.type },
            { label: "카테고리",   value: raw.category },
          ]} />

          {/* 마인크래프트 인벤토리 스타일 제작 시각화 */}
          {raw.grid && (
            <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm">
              <p className="text-sm font-semibold mb-4 text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <span>🛠</span> 제작 방법
              </p>
              <div className="flex items-center gap-5 sm:gap-8 flex-wrap justify-center">
                <RecipeGrid grid={raw.grid as string[][]} />

                <div className="flex flex-col items-center gap-1">
                  <ArrowIcon />
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">make</span>
                </div>

                <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl
                  bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30
                  border-2 border-dashed border-violet-400/60 dark:border-violet-500/40">
                  <SmartIcon
                    image={getTextureByName(raw.resultItem) ?? getItemTexture(raw.id)}
                    emoji={raw.emoji}
                    size="lg"
                    alt={raw.resultItem}
                  />
                  <div className="text-center">
                    <p className="text-sm font-bold text-violet-800 dark:text-violet-200">{raw.resultItem}</p>
                    <p className="text-xs text-violet-600 dark:text-violet-400">×{raw.resultCount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">재료 목록</p>
                <ul className="flex flex-wrap gap-2">
                  {(raw.ingredients as string[]).map((ing: string, i: number) => {
                    const parsed = ing.match(/^(.+?)\s*×\s*(\d+)$/);
                    const name = parsed ? parsed[1].trim() : ing;
                    const count = parsed ? parsed[2] : "";
                    const tex = getTextureByName(name);
                    const href = getHrefByKoName(name);
                    const inner = (
                      <>
                        <SmartIcon image={tex} emoji="🟫" size="sm" alt={name} />
                        <span>{name}</span>
                        {count && <span className="text-zinc-500 text-xs">×{count}</span>}
                      </>
                    );
                    return (
                      <li key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm">
                        {href ? (
                          <Link href={href} className="inline-flex items-center gap-2 hover:text-link dark:hover:text-link-dark transition">
                            {inner}
                          </Link>
                        ) : inner}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          <PrerequisiteRecipes recipe={raw} />
        </section>
      )}

      {usedInRecipes.length > 0 && (
        <RelatedItems
          title="이 항목을 사용하는 레시피"
          emoji="🔗"
          image={getBlockTexture("chain")}
          items={usedInRecipes}
        />
      )}

      <RelatedItems
        title={`같은 카테고리 (${entry.category})`}
        emoji="📚"
        image={getCategoryTexture(entry.category)}
        items={related}
      />

      <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm">
        <Link href="/search" className="text-link dark:text-link-dark hover:underline">
          ← 검색으로 돌아가기
        </Link>
        <Link href={`/search?q=${encodeURIComponent(entry.category)}`} className="text-link dark:text-link-dark hover:underline">
          {entry.category} 더 보기 →
        </Link>
      </div>
    </main>
  );
}

function InfoCard({
  color, emoji, image, title, rows,
}: {
  color: "amber" | "blue" | "violet";
  emoji: string;
  image?: string;
  title: string;
  rows: { label: string; value: React.ReactNode }[];
}) {
  const headerBg = { amber: "bg-amber-500", blue: "bg-blue-500", violet: "bg-violet-500" }[color];
  return (
    <section className="mb-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      <div className={`${headerBg} text-white px-5 py-2.5 font-semibold text-sm flex items-center gap-2`}>
        <SmartIcon image={image} emoji={emoji} size="sm" alt={title} /> {title}
      </div>
      <dl className="text-sm divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3">
            <dt className="text-zinc-500">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
