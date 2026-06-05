import Link from "next/link";
import { BackFromSync } from "./BackFromSync";

/** 상세 페이지 상단 뒤로가기 — 정적 HTML + ?from= 지원 */
export function DetailBackBar({
  href,
  label,
  variant = "default",
  className = "",
}: {
  href: string;
  label: string;
  variant?: "default" | "hero";
  className?: string;
}) {
  const isHero = variant === "hero";

  return (
    <>
      <Link
        href={href}
        data-back-link
        className={
          isHero
            ? `relative z-10 inline-flex items-center gap-2 text-[13px] font-medium text-white/90 hover:text-white mb-3 no-underline hover:underline ${className}`
            : `inline-flex items-center gap-2 text-[13px] font-medium text-link dark:text-link-dark hover:underline mb-4 ${className}`
        }
      >
        <span
          className={
            isHero
              ? "inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/25 bg-white/10 shrink-0"
              : "inline-flex items-center justify-center w-8 h-8 rounded-lg border border-wiki-borderSoft/70 dark:border-zinc-600 bg-wiki-panel/40 dark:bg-zinc-800/60 shrink-0"
          }
          aria-hidden
        >
          ←
        </span>
        <span data-back-label>{label}</span>
      </Link>
      <BackFromSync defaultHref={href} defaultLabel={label} />
    </>
  );
}
