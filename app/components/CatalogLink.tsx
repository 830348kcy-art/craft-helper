"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 목록 → 상세 이동 시 ?from= 으로 출발 경로 전달 */
export function CatalogLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sep = href.includes("?") ? "&" : "?";
  const dest = `${href}${sep}from=${encodeURIComponent(pathname)}`;

  return (
    <Link href={dest} className={className} prefetch={false}>
      {children}
    </Link>
  );
}
