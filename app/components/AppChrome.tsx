"use client";

import { useState } from "react";
import { SiteSidebar } from "./SiteSidebar";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-1 min-h-0 w-full">
      <SiteSidebar className="hidden md:block" />

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="메뉴 닫기"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <SiteSidebar
        className={`md:hidden fixed z-50 top-[var(--site-header-h)] left-0 bottom-0 shadow-wiki-lg transition-transform duration-200 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <button
          type="button"
          className="md:hidden sticky top-[var(--site-header-h)] z-30 mx-4 mt-3 mb-0 px-4 py-2.5 rounded-wiki text-sm font-semibold bg-white/95 dark:bg-zinc-900/95 border border-wiki-borderSoft dark:border-zinc-700 shadow-wiki"
          onClick={() => setMenuOpen((o) => !o)}
        >
          ☰ 메뉴
        </button>
        {children}
      </div>
    </div>
  );
}
