import { notFound } from "next/navigation";
import Link from "next/link";
import { docs, categories } from "@/lib/data";
import { Sidebar } from "@/app/components/Sidebar";
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
    <div className="bg-wiki-bg dark:bg-zinc-950 min-h-[80vh]">
      <div className="max-w-[1400px] mx-auto flex">
        <Sidebar activeSlug={doc.slug} />

        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6">
          {/* 위키 페이지 컨테이너 */}
          <article className="bg-white dark:bg-zinc-900 border border-wiki-border dark:border-zinc-700 shadow-sm">
            {/* 페이지 헤더 — 미디어위키 스타일 (제목 + 밑줄) */}
            <div className="px-6 sm:px-8 pt-6 pb-3 border-b border-wiki-border dark:border-zinc-700">
              {/* 빵부스러기 (미니멀 위키 스타일) */}
              <nav className="text-[12px] text-wiki-muted dark:text-zinc-400 mb-2">
                <Link href="/" className="text-link dark:text-link-dark hover:underline">대문</Link>
                <span className="mx-1.5">›</span>
                {category && (
                  <>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-link dark:text-link-dark hover:underline inline-flex items-center gap-1"
                    >
                      <SmartIcon image={getCategoryTexture(category.slug)} emoji={category.emoji} size="xs" alt={category.name} />
                      {category.name}
                    </Link>
                    <span className="mx-1.5">›</span>
                  </>
                )}
                <span>{doc.title}</span>
              </nav>
              <h1 className="prose-wiki">
                <span className="block font-wiki text-[2.1rem] font-normal leading-tight pb-2 border-b border-wiki-border dark:border-zinc-700">
                  {doc.title}
                </span>
              </h1>
            </div>

            {/* 본문 */}
            <div className="px-6 sm:px-8 py-6">
              <div className="prose-wiki">
                {/* 요약 (위키의 첫 문단 강조) */}
                <p className="text-[15px] leading-[1.7] text-wiki-text dark:text-zinc-200 mb-5">
                  <strong>{doc.title}</strong>{doc.summary.startsWith(doc.title) ? "" : "은(는)"} {doc.summary}
                </p>

                {/* 인포박스 (오른쪽 플로팅) */}
                <InfoBox title={doc.title} emoji={category?.emoji} image={doc.heroImage} rows={doc.infobox} />

                {/* 자동 목차 박스 (미디어위키 스타일) */}
                {doc.sections.length > 2 && (
                  <div className="wiki-toc">
                    <p className="toc-title">목차</p>
                    <ol>
                      {doc.sections.map((s, i) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`} className="text-link dark:text-link-dark hover:underline">
                            <span className="text-wiki-muted dark:text-zinc-400 mr-1">{i + 1}</span>
                            {s.heading.replace(/^\d+\.\s*/, "")}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {doc.sections.map((s) => (
                  <section key={s.id}>
                    <h2 id={s.id}>{s.heading}</h2>
                    <div dangerouslySetInnerHTML={{ __html: s.html }} />
                  </section>
                ))}

                <div className="clear-both" />
              </div>

              {/* 페이지 하단 카테고리 박스 (미디어위키 스타일) */}
              {category && (
                <div className="mt-10 pt-3 border-t border-wiki-border dark:border-zinc-700 text-[13px]">
                  <span className="font-bold text-wiki-text dark:text-zinc-200">분류: </span>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-link dark:text-link-dark hover:underline"
                  >
                    {category.name}
                  </Link>
                </div>
              )}
            </div>
          </article>

          {/* 마지막 수정 정보 (미디어위키 풍) */}
          <p className="mt-4 text-[12px] text-wiki-muted dark:text-zinc-500 text-right pr-2">
            마지막 편집: {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </main>
      </div>
    </div>
  );
}
