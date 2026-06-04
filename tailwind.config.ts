import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#effaf3",
          100: "#d8f3e0",
          200: "#b3e7c4",
          300: "#83d5a1",
          400: "#52bd7c",
          500: "#2fa15e",   // 마인크래프트 그라스 그린 (주조색)
          600: "#218049",
          700: "#1c663c",
          800: "#185132",
          900: "#14432a",
        },
        link: {
          DEFAULT: "#0645ad", // MediaWiki 표준 링크 파랑
          visited: "#0b0080",
          dark: "#7eb8ff",
        },
        // ko.minecraft.wiki 스타일 위키 테마
        wiki: {
          header:      "#1d3829",  // 상단 다크 그린 헤더
          headerHover: "#2a5240",  // 헤더 호버
          accent:      "#4c8c4c",  // 위키 액센트 그린
          bg:          "#f8f9fa",  // 본문 크림 배경
          panel:       "#eaecf0",  // 인포박스/사이드 패널
          panelHead:   "#c8d4c8",  // 인포박스 헤더(연한 그린)
          border:      "#a2a9b1",  // 위키 경계선
          borderSoft:  "#c8ccd1",  // 더 부드러운 경계선
          text:        "#202122",  // 본문 텍스트
          muted:       "#54595d",  // 보조 텍스트
        },
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Apple SD Gothic Neo"', "system-ui", "sans-serif"],
        wiki: ['"Linux Libertine"', '"Georgia"', '"Times New Roman"', '"Pretendard"', "serif"],
      },
      fontSize: {
        base: ["16px", "1.7"],
      },
      boxShadow: {
        wiki: "0 4px 24px -4px rgba(29, 56, 41, 0.1), 0 1px 3px rgba(0,0,0,0.04)",
        "wiki-lg": "0 16px 48px -12px rgba(29, 56, 41, 0.14), 0 4px 12px rgba(0,0,0,0.05)",
        "wiki-glow": "0 0 0 1px rgba(47, 161, 94, 0.15), 0 8px 32px -8px rgba(47, 161, 94, 0.25)",
      },
      borderRadius: {
        wiki: "0.875rem",
        "wiki-lg": "1.125rem",
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
