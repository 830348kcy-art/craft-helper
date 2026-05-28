import { notFound } from "next/navigation";
import Link from "next/link";
import { docs, categories } from "@/lib/data";
import { Sidebar } from "@/app/components/Sidebar";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { TableOfContents } from "@/app/components/TableOfContents";
import { InfoBox } from "@/app/components/InfoBox";
import { SmartIcon } from "@/app/components/SmartIcon";
import { getCategoryTexture } from "@/lib/textures";

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export default function WikiDocPage({ params }: { params: { slug: string } }) {
  const doc = docs[params.slug];
  if (!doc) return notFound();
  const category = categories.find((c) => c.slug === doc.category);

  return (
    <div className="flex max-w-[1400px] mx-auto">
      <Sidebar activeSlug={doc.slug} />

      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8">
        <div className="flex gap-10">
          <article className="flex-1 min-w-0 max-w-[760px]">
            <Breadcrumb
              items={[
                { label: "홈", href: "/" },
                ...(category
                  ? [{ label: `${category.emoji} ${category.name}`, href: `/category/${category.slug}` }]
                  : []),
                { label: doc.title },
              ]}
            />

            <header className="mb-6 pb-5 border-b border-zinc-200 dark:border-zinc-800">
              {category && (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${category.color}`}>
                  <SmartIcon image={getCategoryTexture(category.slug)} emoji={category.emoji} size="xs" alt={category.name} />
                  <span>{category.name}</span>
                </div>
              )}
              <div className="flex items-center gap-4">
                {doc.heroImage && (
                  <div className="shrink-0 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <SmartIcon image={doc.heroImage} emoji={category?.emoji ?? "📘"} size="xl" alt={doc.title} />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{doc.title}</h1>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">{doc.summary}</p>
                </div>
              </div>
            </header>

            <div className="prose-wiki">
              <InfoBox title={doc.title} emoji={category?.emoji} image={doc.heroImage} rows={doc.infobox} />

              {doc.sections.map((s) => (
                <section key={s.id}>
                  <h2 id={s.id}>{s.heading}</h2>
                  <div dangerouslySetInnerHTML={{ __html: s.html }} />
                </section>
              ))}

              <div className="clear-both" />
            </div>

            <nav className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm">
              <Link href="/" className="text-link dark:text-link-dark hover:underline">← 메인으로</Link>
              {category && (
                <Link href={`/category/${category.slug}`} className="text-link dark:text-link-dark hover:underline">
                  {category.name} 카테고리 →
                </Link>
              )}
            </nav>
          </article>

          {/* 우측 TOC */}
          <TableOfContents items={doc.sections.map((s) => ({ id: s.id, heading: s.heading }))} />
        </div>
      </main>
    </div>
  );
}
