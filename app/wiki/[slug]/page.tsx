import { notFound } from "next/navigation";
import Link from "next/link";
import { docs, categories } from "@/lib/data";
import { InfoBox } from "@/app/components/InfoBox";
import { SmartIcon } from "@/app/components/SmartIcon";
import { WikiArticle } from "@/app/components/PageShell";
import { WikiSectionContent } from "@/app/components/WikiSectionContent";
import { OreDistributionContent } from "@/app/components/OreDistributionContent";
import { CropGuideContent } from "@/app/components/CropGuideContent";
import { DetailBackBar } from "@/app/components/DetailBackBar";
import { getCategoryTexture } from "@/lib/textures";

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export default function WikiDocPage({ params }: { params: { slug: string } }) {
  const doc = docs[params.slug];
  if (!doc) return notFound();
  const category = categories.find((c) => c.slug === doc.category);
  const backHref = category ? `/category/${category.slug}` : "/";
  const backLabel = category ? `${category.name} 분류` : "대문";

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <WikiArticle>
            <div className="wiki-hero-banner !border-0">
              <DetailBackBar href={backHref} label={backLabel} variant="hero" />
              <nav className="relative z-10 text-[12px] text-white/70 mb-3">
                <Link href="/" className="hover:text-white transition-colors">대문</Link>
                <span className="mx-1.5">›</span>
                {category && (
                  <>
                    <Link
                      href={`/category/${category.slug}`}
                      className="hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <SmartIcon image={getCategoryTexture(category.slug)} emoji={category.emoji} size="xs" alt={category.name} />
                      {category.name}
                    </Link>
                    <span className="mx-1.5">›</span>
                  </>
                )}
                <span className="text-white">{doc.title}</span>
              </nav>
              <h1 className="wiki-hero-title !text-[1.85rem] sm:!text-[2.15rem]">{doc.title}</h1>
            </div>

            <div className="px-6 sm:px-8 py-6 sm:py-8">
              <div className="prose-wiki">
                {/* 요약 (위키의 첫 문단 강조) */}
                <p className="text-[15px] leading-[1.7] text-wiki-text dark:text-zinc-200 mb-5">
                  <strong>{doc.title}</strong>{doc.summary.startsWith(doc.title) ? "" : "은(는)"} {doc.summary}
                </p>

                {/* 인포박스 (오른쪽 플로팅) */}
                <InfoBox title={doc.title} emoji={category?.emoji} image={doc.heroImage} rows={doc.infobox} />

                {/* 자동 목차 박스 (미디어위키 스타일) */}
                {doc.sections.length >= 1 && (
                  <div className="wiki-toc">
                    <p className="toc-title">목차</p>
                    <ol>
                      {doc.sections.map((s, i) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`} className="text-link dark:text-link-dark hover:underline">
                            <span className="toc-num">{i + 1}</span>
                            {s.heading.replace(/^\d+\.\s*/, "")}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {params.slug === "ore-distribution" ? (
                  <OreDistributionContent sections={doc.sections} />
                ) : params.slug === "crops" ? (
                  <CropGuideContent />
                ) : (
                  doc.sections.map((s) => (
                    <section key={s.id}>
                      <h2 id={s.id}>{s.heading}</h2>
                      <WikiSectionContent section={s} />
                    </section>
                  ))
                )}

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
          </WikiArticle>

          {/* 마지막 수정 정보 (미디어위키 풍) */}
          <p className="mt-4 text-[12px] text-wiki-muted dark:text-zinc-500 text-right pr-2">
            마지막 편집: {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
      </div>
    </div>
  );
}
