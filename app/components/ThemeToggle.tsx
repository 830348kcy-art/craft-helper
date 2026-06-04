"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }
  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label="테마 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 inline-flex items-center justify-center rounded-wiki border border-white/25 text-white hover:bg-white/15 hover:scale-105 transition-all duration-150"
    >
      <span className="text-base">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
