import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getDocsByCategory } from "@/lib/data";
import { Sidebar } from "@/app/components/Sidebar";
import { SmartIcon } from "@/app/components/SmartIcon";
import { getCategoryTexture } from "@/lib/textures";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return notFound();
  const docs = getDocsByCategory(category.slug);
  const texture = getCategoryTexture(category.slug);

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

              {docs.length === 0 ? (
                <div className="border border-dashed border-wiki-border dark:border-zinc-700 p-8 text-center text-wiki-muted dark:text-zinc-500 mt-6">
                  <p>이 분류에 등록된 문서가 없습니다.</p>
                  <Link href="/" className="text-link dark:text-link-dark hover:underline">← 대문으로</Link>
                </div>
              ) : (
                <>
                  <h2>이 분류에 속한 문서</h2>
                  <p className="text-[13px] text-wiki-muted dark:text-zinc-400">
                    이 분류에는 다음의 문서 <strong>{docs.length}</strong>개가 속해 있습니다.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {docs.map((d) => (
                      <li key={d.slug}>
                        <Link href={`/wiki/${d.slug}`} className="text-link dark:text-link-dark hover:underline">
                          {d.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
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
