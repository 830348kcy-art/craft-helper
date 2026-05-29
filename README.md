# 마인크래프트 위키 (데모)

마인크래프트 위키 데모입니다. Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## 반영한 UI 요소

| 요소 | 위치 |
|---|---|
| 중앙 검색창 강조 (hero) | `app/page.tsx` |
| 이미지 카드형 가이드 | `app/page.tsx` (FEATURED 섹션) |
| 이모지 + 카테고리 구분 | `app/components/CategoryCard.tsx` |
| 깔끔한 화이트/다크 계열 톤 | `app/globals.css`, Tailwind 색상 |
| 고정형 사이드바 네비게이션 | `app/components/Sidebar.tsx` |
| 우측 목차(TOC) 자동 생성 | `app/components/TableOfContents.tsx` |
| 다크모드 지원 | `app/components/ThemeProvider.tsx`, `ThemeToggle.tsx` |
| 정보 인포박스 (우측 상단 표) | `app/components/InfoBox.tsx` |
| 가독성 폰트 크기 (본문 15.5~16px) | `app/globals.css` (`.prose-wiki`) |
| 내부 링크 파란색 구분 | `tailwind.config.ts` (`link` 색) |
| 맨 위로 가기 버튼 | `app/components/ScrollToTop.tsx` |
| 빵부스러기 (Breadcrumb) | `app/components/Breadcrumb.tsx` |
| 여백 활용 + 주조색 1~2가지 통일 | 전반 (brand green + link blue) |

## 실행

```bash
cd minecraft-wiki
npm install
npm run dev
```

→ http://localhost:3000

## 페이지 구조

- `/` — 메인 (hero 검색 + 카드형 가이드 + 카테고리 그리드)
- `/wiki/[slug]` — 문서 페이지 (사이드바 + 빵부스러기 + 본문 + 인포박스 + 우측 TOC)
  - 예: `/wiki/diamond`, `/wiki/getting-started`, `/wiki/nether-portal`, `/wiki/auto-farm`
- `/category/[slug]` — 카테고리별 문서 목록
  - 예: `/category/items`, `/category/redstone`, `/category/nether`

## 다음 단계 아이디어

- 실제 검색 기능 (Fuse.js 또는 Algolia)
- MDX 본문 (현재는 sample HTML)
- 문서 편집 히스토리 / 토론 페이지
- 모바일에서 사이드바 슬라이드 드로어
- 검색 자동완성
