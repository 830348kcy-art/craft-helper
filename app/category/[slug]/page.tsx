import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getDocsByCategory } from "@/lib/data";
import { getEntriesByCategory } from "@/lib/search";
import { Sidebar } from "@/app/components/Sidebar";
import { SmartIcon } from "@/app/components/SmartIcon";
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
    <div className="bg-wiki-bg dark:bg-zinc-950 min-h-[80vh]">
      <div className="max-w-[1400px] mx-auto flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6">
          <article className="bg-white dark:bg-zinc-900 border border-wiki-border dark:border-zinc-700 shadow-sm">
            {/* 헤더 */}
            <div className="px-6 sm:px-8 pt-6 pb-3 border-b border-wiki-border dark:border-zinc-700">
              <nav className="text-[12px] text-wiki-muted dark:text-zinc-400 mb-2">
                <Link href="/" className="text-link dark:text-link-dark hover:underline">대문</Link>
                <span className="mx-1.5">›</span>
                <span>분류</span>
                <span className="mx-1.5">›</span>
                <span>{category.name}</span>
              </nav>
              <h1 className="font-wiki text-[2.1rem] font-normal leading-tight pb-2 border-b border-wiki-border dark:border-zinc-700 flex items-center gap-3">
                <SmartIcon image={texture} emoji={category.emoji} size="lg" alt={category.name} />
                분류: {category.name}
              </h1>
            </div>

            <div className="px-6 sm:px-8 py-6 prose-wiki">
              <p>{category.description}</p>
              <p className="text-[13px] text-wiki-muted dark:text-zinc-400">
                이 분류에는 총 <strong>{totalCount}</strong>개 항목
                {docs.length > 0 && <> (가이드 <strong>{docs.length}</strong></>}
                {blocks.length > 0 && <>, 블록 <strong>{blocks.length}</strong></>}
                {items.length > 0 && <>, 아이템 <strong>{items.length}</strong></>}
                {recipes.length > 0 && <>, 레시피 <strong>{recipes.length}</strong></>}
                {(docs.length > 0 || blocks.length > 0 || items.length > 0 || recipes.length > 0) && <>)</>}
                이 있습니다.
              </p>

              {totalCount === 0 && (
                <div className="border border-dashed border-wiki-border dark:border-zinc-700 p-8 text-center text-wiki-muted dark:text-zinc-500 mt-6">
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

              {/* 블록 */}
              {blocks.length > 0 && (
                <Group title="🟫 블록" count={blocks.length}>
                  <EntryGrid entries={blocks} />
                </Group>
              )}

              {/* 아이템 */}
              {items.length > 0 && (
                <Group title="📦 아이템" count={items.length}>
                  <EntryGrid entries={items} />
                </Group>
              )}

              {/* 레시피 */}
              {recipes.length > 0 && (
                <Group title="📜 레시피" count={recipes.length}>
                  <EntryGrid entries={recipes} />
                </Group>
              )}

              <h2>다른 분류</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 list-none pl-0">
                {categories
                  .filter((c) => c.slug !== category.slug)
                  .map((c) => (
                    <li key={c.slug} className="list-none">
                      <Link
                        href={`/category/${c.slug}`}
                        className="inline-flex items-center gap-1.5 text-link dark:text-link-dark hover:underline"
                      >
                        <SmartIcon image={getCategoryTexture(c.slug)} emoji={c.emoji} size="xs" alt={c.name} />
                        {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="font-wiki text-[1.4rem] font-normal mt-8 mb-3 pb-1.5 border-b border-wiki-border dark:border-zinc-700">
        {title} <span className="text-[14px] text-wiki-muted dark:text-zinc-500 font-sans font-normal">({count}개)</span>
      </h2>
      {children}
    </section>
  );
}

function EntryGrid({ entries }: { entries: { id: string; name: string; emoji: string; image?: string; href: string; category: string; type: string }[] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 list-none pl-0">
      {entries.map((e) => (
        <li key={`${e.type}-${e.id}`} className="list-none">
          <Link
            href={e.href}
            className="flex items-center gap-2 p-2 border border-wiki-borderSoft dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-wiki-panel/60 dark:hover:bg-zinc-800 transition no-underline"
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
