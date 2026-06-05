"use client";

import { useEffect } from "react";
import { mobListBackPath, mobListBackLabel } from "@/lib/mob-taxonomy";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 정적 HTML의 뒤로가기 링크를 ?from= 쿼리에 맞게 갱신 */
export function MobBackFromSync({
  defaultHref,
  defaultLabel,
}: {
  defaultHref: string;
  defaultLabel: string;
}) {
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    const link = document.querySelector<HTMLAnchorElement>("[data-mob-back]");
    const labelEl = document.querySelector<HTMLElement>("[data-mob-back-label]");
    if (!link || !labelEl) return;

    if (!from) {
      link.href = `${BASE}${defaultHref}`;
      labelEl.textContent = defaultLabel;
      return;
    }

    link.href = `${BASE}${mobListBackPath(from)}`;
    labelEl.textContent = mobListBackLabel(from);
  }, [defaultHref, defaultLabel]);

  return null;
}
