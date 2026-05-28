import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { ScrollToTop } from "./components/ScrollToTop";

export const metadata: Metadata = {
  title: "마인크래프트 위키",
  description: "한국어 마인크래프트 위키 — 블록, 아이템, 몹, 레드스톤 가이드.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} 마인크래프트 위키 (데모) — 마인크래프트는 Mojang Studios의 상표입니다.
          </footer>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
