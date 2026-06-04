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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>

          <footer className="mt-auto border-t border-brand-900/20 bg-gradient-to-b from-wiki-header to-[#152a20] text-white/75">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 text-[13px]">
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 font-medium">
                <Link href="/" className="hover:text-white transition-colors">대문</Link>
                <Link href="/wiki/getting-started" className="hover:text-white transition-colors">처음 시작하기</Link>
                <Link href="/category/blocks" className="hover:text-white transition-colors">블록 분류</Link>
                <Link href="/search" className="hover:text-white transition-colors">검색</Link>
                <a href="https://ko.minecraft.wiki" target="_blank" rel="noreferrer noopener" className="hover:text-white transition-colors">ko.minecraft.wiki</a>
              </div>
              <p className="leading-relaxed text-white/55 max-w-3xl">
                © {new Date().getFullYear()} Craft Helper (학습용 데모) ·
                빌드 {process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) ?? "local"} ·
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
