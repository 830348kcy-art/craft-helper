/** 페이지 공통 배경·최대 너비 래퍼 */
export function PageShell({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={`wiki-page-bg ${className}`}>
      <div className="wiki-page-mesh" aria-hidden />
      <div
        className={`relative z-10 w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 ${
          wide ? "max-w-[1100px]" : "max-w-[1000px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/** 카드형 섹션 (대문·분류 등) */
export function WikiSection({
  title,
  subtitle,
  children,
  accent = "brand",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: "brand" | "neutral";
}) {
  return (
    <section className="wiki-section mt-6 sm:mt-8">
      <div
        className={
          accent === "brand" ? "wiki-section-header" : "wiki-section-header-neutral"
        }
      >
        <h2 className="wiki-section-title">{title}</h2>
        {subtitle && <p className="wiki-section-subtitle">{subtitle}</p>}
      </div>
      <div className="wiki-section-body">{children}</div>
    </section>
  );
}

/** 본문 아티클 패널 (위키·분류) */
export function WikiArticle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <article className={`wiki-article ${className}`}>{children}</article>;
}
