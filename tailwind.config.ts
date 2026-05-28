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
          DEFAULT: "#1d6fe0", // 내부 링크 파란색
          dark: "#7eb8ff",
        },
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Apple SD Gothic Neo"', "system-ui", "sans-serif"],
      },
      fontSize: {
        base: ["16px", "1.7"],
      },
    },
  },
  plugins: [],
};
export default config;
