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
    },
  },
  plugins: [],
};
export default config;
