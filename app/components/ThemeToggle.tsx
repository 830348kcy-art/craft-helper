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
      className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-white/20 text-white hover:bg-white/10 transition"
    >
      <span className="text-base">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
