import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getDocsByCategory } from "@/lib/data";
import { getEntriesByCategory } from "@/lib/search";
import { SmartIcon } from "@/app/components/SmartIcon";
import {
  DimensionBlockGrid,
  DimensionOnlyGrid,
  ItemSubCategoryGrid,
  type CatalogEntry,
} from "@/app/components/DimensionCategoryGrid";
import { WikiArticle } from "@/app/components/PageShell";
import { getCategoryTexture } from "@/lib/textures";

const TYPE_LABEL: Record<string, string> = { block: "블록", item: "아이템", recipe: "레시피" };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return notFound();
  const docs = getDocsByCategory(category.slug);
  const entries = await getEntriesByCategory(category.slug);
  const texture = getCategoryTexture(category.slug);

  const blocks  = entries.filter((e) => e.type === "block");
  const items   = entries.filter((e) => e.type === "item");
  const recipes = entries.filter((e) => e.type === "recipe");
  const totalCount = docs.length + entries.length;

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1100px]">
          <WikiArticle>
            <div className="wiki-hero-banner !border-0">
              <nav className="relative z-10 text-[12px] text-white/70 mb-3">
                <Link href="/" className="hover:text-white transition-colors">대문</Link>
                <span className="mx-1.5">›</span>
                <span>분류</span>
                <span className="mx-1.5">›</span>
                <span className="text-white">{category.name}</span>
              </nav>
              <h1 className="wiki-hero-title flex items-center gap-3 !text-[1.85rem] sm:!text-[2.1rem]">
                <span className="wiki-icon-frame !bg-white/15 !border-white/20 p-2">
                  <SmartIcon image={texture} emoji={category.emoji} size="lg" alt={category.name} />
                </span>
                {category.name}
              </h1>
              <p className="wiki-hero-sub">{category.description}</p>
            </div>

            <div className="px-6 sm:px-8 py-6 sm:py-8 prose-wiki">
              <p className="wiki-badge inline-flex mb-4">
                총 <strong>{totalCount}</strong>개 항목
              </p>
              <p className="text-[13px] text-wiki-muted dark:text-zinc-400 -mt-2 mb-6">
                {docs.length > 0 && <>가이드 <strong>{docs.length}</strong> · </>}
                {blocks.length > 0 && <>블록 <strong>{blocks.length}</strong> · </>}
                {items.length > 0 && <>아이템 <strong>{items.length}</strong> · </>}
                {recipes.length > 0 && <>레시피 <strong>{recipes.length}</strong></>}
              </p>

              {totalCount === 0 && (
                <div className="rounded-wiki-lg border border-dashed border-wiki-borderSoft dark:border-zinc-600 p-12 text-center text-wiki-muted dark:text-zinc-500 mt-6 bg-wiki-panel/30">
                  <p>이 분류에 등록된 항목이 없습니다.</p>
                  <Link href="/" className="text-link dark:text-link-dark hover:underline">← 대문으로</Link>
                </div>
              )}

              {/* 가이드 문서 */}
              {docs.length > 0 && (
                <Group title="📖 가이드 문서" count={docs.length}>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {docs.map((d) => (
                      <li key={d.slug}>
                        <Link href={`/wiki/${d.slug}`} className="text-link dark:text-link-dark hover:underline font-medium">
                          {d.title}
                        </Link>
                        <span className="text-[12px] text-wiki-muted dark:text-zinc-500 ml-1">— {d.summary.slice(0, 40)}…</span>
                      </li>
                    ))}
                  </ul>
                </Group>
              )}

              {/* 블록 — 차원별·세부 카테고리 */}
              {blocks.length > 0 && (
                <Group title="🟫 블록" count={blocks.length}>
                  {category.slug === "blocks" ? (
                    <DimensionBlockGrid entries={blocks as CatalogEntry[]} dimensionId={undefined} />
                  ) : category.slug === "nether" || category.slug === "end" ? (
                    <DimensionOnlyGrid
                      entries={[...blocks, ...items] as CatalogEntry[]}
                      dimension={category.slug === "nether" ? "nether" : "end"}
                    />
                  ) : (
                    <EntryGrid entries={blocks} />
                  )}
                </Group>
              )}

              {/* 아이템 */}
              {items.length > 0 && category.slug !== "nether" && category.slug !== "end" && (
                <Group title="📦 아이템" count={items.length}>
                  {category.slug === "items" ? (
                    <ItemSubCategoryGrid entries={items as CatalogEntry[]} />
                  ) : (
                    <EntryGrid entries={items} />
                  )}
                </Group>
              )}

              {/* 레시피 */}
              {recipes.length > 0 && (
                <Group title="📜 레시피" count={recipes.length}>
                  <EntryGrid entries={recipes} />
                </Group>
              )}

              <h2 className="!mt-12">다른 분류</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 list-none pl-0">
                {categories
                  .filter((c) => c.slug !== category.slug)
                  .map((c) => (
                    <li key={c.slug} className="list-none">
                      <Link
                        href={`/category/${c.slug}`}
                        className="wiki-card-hover inline-flex items-center gap-2 px-3 py-2 w-full no-underline"
                      >
                        <SmartIcon image={getCategoryTexture(c.slug)} emoji={c.emoji} size="xs" alt={c.name} />
                        <span className="font-medium text-wiki-text dark:text-zinc-100">{c.name}</span>
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

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mt-8 p-5 sm:p-6 rounded-wiki-lg border border-wiki-borderSoft/60 dark:border-zinc-700/60 bg-wiki-panel/20 dark:bg-zinc-800/20">
      <h2 className="font-sans text-[1.25rem] font-bold mb-4 flex items-center gap-2">
        {title}
        <span className="wiki-badge">{count}개</span>
      </h2>
      {children}
    </section>
  );
}

function EntryGrid({ entries }: { entries: { id: string; name: string; emoji: string; image?: string; href: string; category: string; type: string }[] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none pl-0">
      {entries.map((e) => (
        <li key={`${e.type}-${e.id}`} className="list-none">
          <Link
            href={e.href}
            className="wiki-card-hover flex items-center gap-2.5 p-3 no-underline"
          >
            <SmartIcon textureId={e.id} image={e.image} emoji={e.emoji} size="sm" alt={e.name} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-link dark:text-link-dark hover:underline truncate font-medium">
                {e.name}
              </p>
              <p className="text-[11px] text-wiki-muted dark:text-zinc-500 truncate">{e.category}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
