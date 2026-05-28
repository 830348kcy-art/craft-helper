import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { ScrollToTop } from "./components/ScrollToTop";

export const metadata: Metadata = {
  title: "Craft Helper",
  description: "Craft Helper — 한국어 마인크래프트 가이드. 블록, 아이템, 몹, 레드스톤, 자동 농장.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>

          <footer className="mt-12 border-t border-wiki-border bg-wiki-panel dark:bg-zinc-900 dark:border-zinc-700">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 text-[13px] text-wiki-muted dark:text-zinc-400">
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
                <Link href="/" className="hover:underline">대문</Link>
                <Link href="/wiki/getting-started" className="hover:underline">처음 시작하기</Link>
                <Link href="/category/items" className="hover:underline">전체 카테고리</Link>
                <Link href="/search" className="hover:underline">검색</Link>
                <a href="https://ko.minecraft.wiki" target="_blank" rel="noreferrer noopener" className="hover:underline">공식 ko.minecraft.wiki</a>
              </div>
              <p className="leading-relaxed">
                © {new Date().getFullYear()} Craft Helper (학습용 데모) ·
                본문은 <strong>CC BY-NC-SA 3.0</strong>으로 제공됩니다 ·
                마인크래프트는 <strong>Mojang Studios</strong>의 상표이며 본 사이트는 Mojang 또는 Microsoft와 무관합니다.
              </p>
            </div>
          </footer>

          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
