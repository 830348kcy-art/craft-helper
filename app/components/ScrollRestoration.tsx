"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "craft-helper-scroll";

type ScrollEntry = { path: string; y: number };

function currentPath(): string {
  return window.location.pathname + window.location.search;
}

function readSaved(): ScrollEntry | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ScrollEntry;
    if (typeof parsed.path === "string" && typeof parsed.y === "number") return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

/** 내부 링크 이동 시 스크롤 위치 저장 · 뒤로가기 시 복원 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const saved = readSaved();
    if (saved && saved.path === currentPath()) {
      const y = saved.y;
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        sessionStorage.removeItem(STORAGE_KEY);
      });
      return;
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a[href]");
      if (!anchor) return;
      if (anchor.hasAttribute("data-back-link")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || anchor.hasAttribute("target")) return;
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ path: currentPath(), y: window.scrollY } satisfies ScrollEntry)
      );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [routeKey]);

  return null;
}
