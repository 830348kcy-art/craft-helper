"use client";

import Link from "next/link";

export function WikiBackBar({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-[13px] font-medium text-link dark:text-link-dark hover:underline mb-4 ${className}`}
    >
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-wiki-borderSoft/70 dark:border-zinc-600 bg-wiki-panel/40 dark:bg-zinc-800/60 shrink-0"
        aria-hidden
      >
        ←
      </span>
      {label}
    </Link>
  );
}
