import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getDocsByCategory } from "@/lib/data";
import { Sidebar } from "@/app/components/Sidebar";
import { Breadcrumb } from "@/app/components/Breadcrumb";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return notFound();
  const docs = getDocsByCategory(category.slug);

  return (
    <div className="flex max-w-[1400px] mx-auto">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8">
        <div className="max-w-[860px]">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "카테고리" },
              { label: `${category.emoji} ${category.name}` },
            ]}
          />

          <header className="mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${category.color}`}>
              <span>{category.emoji}</span>
              <span>카테고리</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {category.emoji} {category.name}
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">{category.description}</p>
          </header>

          {docs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center text-zinc-500">
              아직 이 카테고리에 등록된 문서가 없습니다.
              <br />
              <Link href="/" className="text-link dark:text-link-dark hover:underline">메인으로 돌아가기 →</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-500 mb-4">총 <strong>{docs.length}</strong>개의 문서</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {docs.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/wiki/${d.slug}`}
                      className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-brand-400 hover:shadow-md transition"
                    >
                      <h3 className="font-bold text-lg text-link dark:text-link-dark">{d.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2">
                        {d.summary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">다른 카테고리 둘러보기</h2>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter((c) => c.slug !== category.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm hover:opacity-90 transition ${c.color}`}
                  >
                    <span>{c.emoji}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
