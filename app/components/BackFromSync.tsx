"use client";

import { useEffect } from "react";
import { listBackPath, listBackLabel } from "@/lib/back-navigation";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function resolveBack(from: string | null, defaultHref: string, defaultLabel: string) {
  if (!from) return { href: defaultHref, label: defaultLabel };
  return {
    href: listBackPath(from, defaultHref),
    label: listBackLabel(from, defaultLabel),
  };
}

/** 정적 HTML 뒤로가기 링크를 ?from= 쿼리에 맞게 갱신 */
export function BackFromSync({
  defaultHref,
  defaultLabel,
}: {
  defaultHref: string;
  defaultLabel: string;
}) {
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    const link = document.querySelector<HTMLAnchorElement>("[data-back-link]");
    const labelEl = document.querySelector<HTMLElement>("[data-back-label]");
    if (!link || !labelEl) return;

    const { href, label } = resolveBack(from, defaultHref, defaultLabel);
    link.href = `${BASE}${href}`;
    labelEl.textContent = label;
  }, [defaultHref, defaultLabel]);

  return null;
}
