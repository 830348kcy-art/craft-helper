import { farmDiagram } from "./diagrams";
import { getItemTexture, getBlockTexture } from "./textures";

// GitHub Pages 서브경로(/craft-helper) 대응.
// raw HTML(dangerouslySetInnerHTML) 안의 정적 자원은 Next.js가 자동으로
// basePath를 붙여주지 않으므로 직접 접두어를 추가한다.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type Category = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  color: string; // tailwind bg class
};

export type WikiDoc = {
  slug: string;
  title: string;
  category: string; // category slug
  summary: string;
  heroImage?: string;
  infobox: { label: string; value: string }[];
  // 본문: 섹션 단위 (TOC 자동생성용)
  sections: { id: string; heading: string; html: string }[];
};

export const categories: Category[] = [
  { slug: "blocks",     name: "블록",     emoji: "🟫", description: "오버월드·네더·엔드별로 건축, 기능, 식물 등 세부 분류", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200" },
  { slug: "items",      name: "아이템",   emoji: "🍎", description: "도구, 음식, 자원",      color: "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200" },
  { slug: "mobs",       name: "몹",       emoji: "🐗", description: "몬스터와 동물",        color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200" },
  { slug: "biomes",     name: "생물군계", emoji: "🌲", description: "지형과 환경",          color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" },
  { slug: "redstone",   name: "레드스톤", emoji: "🟥", description: "회로와 자동화",        color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200" },
  { slug: "enchanting", name: "마법부여", emoji: "✨", description: "장비 강화",            color: "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200" },
  { slug: "nether",     name: "네더",     emoji: "🔥", description: "지옥 차원",            color: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200" },
  { slug: "end",        name: "엔드",     emoji: "🌌", description: "최종 차원",            color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200" },
];

export const featuredGuides: { slug: string; title: string; description: string; emoji: string; href: string }[] = [
  { slug: "getting-started", title: "처음 시작하는 모험가를 위해", description: "첫날 밤을 안전하게 넘기는 방법부터, 기본 도구 제작까지.", emoji: "🌅", href: "/wiki/getting-started" },
  { slug: "ore-distribution", title: "광물별 분포 정보", description: "석탄·철·구리·금·레드스톤·라피스·다이아·에메랄드·네더라이트 Y레벨 요약.", emoji: "⛏️", href: "/wiki/ore-distribution" },
  { slug: "smithing", title: "대장장이 작업 · 갑옷 장식", description: "18종 형판과 11종 재료별 색상·무늬 미리보기.", emoji: "⚒️", href: "/smithing" },
  { slug: "farm-auto", title: "자동 농장 설계 입문", description: "물줄기와 호퍼만으로 만드는 무한 식량 시스템.", emoji: "🌾", href: "/wiki/auto-farm" },
];

export const docs: Record<string, WikiDoc> = {
  "diamond": {
    slug: "diamond",
    title: "다이아몬드",
    category: "items",
    heroImage: getItemTexture("diamond"),
    summary: "다이아몬드는 어둠 속에서 푸르게 빛나는, 광부의 최고의 친구로 불리는 자원이다. 네더라이트 다음으로 우수한 내구도와 효율을 자랑하며, 최고급 도구·무기·갑옷과 마법부여대의 핵심 재료로 사용된다.",
    infobox: [
      { label: "분류", value: "광물 / 자원" },
      { label: "재생 가능", value: "아니오" },
      { label: "스택 크기", value: "64" },
      { label: "최적 채굴 도구", value: "철 곡괭이 이상" },
      { label: "분포 Y레벨", value: "Y=16 이하 (최적: -54 ~ -60)" },
      { label: "행운 III 최대 드롭", value: "4개" },
      { label: "추가됨", value: "Indev 0.31 (2010)" },
    ],
    sections: [
      {
        id: "overview",
        heading: "개요",
        html: `<p>다이아몬드는 마인크래프트에서 가장 가치 있는 광물 중 하나로, <em>"어둠속에서 파랗게 빛을 내는 광부의 최고의 친구"</em>라고 불린다. 네더라이트가 추가되기 전까지는 게임 내 최강 등급의 재료였으며, 지금도 <code>네더라이트 장비 업그레이드</code>의 기초가 되기 때문에 여전히 필수 자원으로 꼽힌다.</p>
<p>자세한 채굴 가이드는 <a href="/wiki/getting-started">처음 시작하기</a> 문서에서 기초 도구 제작을 먼저 익힌 뒤 도전하는 것을 추천한다.</p>`,
      },
      {
        id: "obtain",
        heading: "획득 방법",
        html: `<h3>다이아몬드 원석 채굴</h3><p>다이아몬드 원석은 오직 <strong>Y=16 이하</strong>에서만 생성되며, <strong>Y=-54 ~ -60 구간</strong>에서 가장 많이 분포한다. <code>철 곡괭이 이상</code>의 도구로만 채굴할 수 있고, 그보다 낮은 등급의 곡괭이를 사용하면 아무것도 드롭되지 않으니 주의해야 한다.</p><h3>행운 마법부여로 드롭량 증가</h3><p>곡괭이에 <code>행운 III</code> 마법을 부여하면 광석 하나당 최대 <strong>4개</strong>까지 드롭량이 증가한다. 단, <code>섬세한 손길</code>을 부여하면 광석 블록 자체가 드롭되어 화로에서 다시 제련해야 한다.</p><h3>구조물 보물상자</h3><ul><li>폐광의 보물 미니카트</li><li>사막 사원 / 정글 사원의 함정 상자</li><li>요새의 제단 상자</li><li>엔드 도시의 보물선</li><li>마을 대장장이 집의 상자</li></ul><h3>주민 거래</h3><p>마스터급 <strong>무기 제조인 / 도구 제조인 / 갑옷 제조인</strong> 주민과 거래하여 에메랄드로 다이아몬드 장비를 살 수 있다.</p>`,
      },
      {
        id: "uses",
        heading: "용도",
        html: `<h3>제작 재료</h3><ul><li>다이아몬드 장비 일식: 검 · 곡괭이 · 도끼 · 삽 · 괭이 · 헬멧 · 흉갑 · 레깅스 · 부츠</li><li><a href="/wiki/nether-portal">마법부여대</a> (다이아몬드 2개 + 흑요석 4개 + 책 1권)</li><li>주크박스, 발사기</li><li>네더라이트 장비 업그레이드 — 다이아몬드 장비가 기초 재료가 된다</li></ul><h3>기타 활용</h3><ul><li><strong>신호기 효과 선택</strong>: 신호기에 다이아몬드를 넣어 효과를 활성화할 수 있다 (에메랄드, 철, 금, 네더라이트도 사용 가능).</li><li><strong>주민 거래</strong>: 무기 제조인 등 일부 주민은 다이아몬드를 받고 에메랄드를 준다.</li></ul>`,
      },
      {
        id: "tips",
        heading: "채굴 팁",
        html: `<h3>분기식 채굴</h3><p>Y=-58 ~ -59에 진입한 후 2칸 간격으로 수평 터널을 뚫으면 다이아몬드 광맥을 안정적으로 찾을 수 있다. 시간은 오래 걸리지만 가장 안전한 방법이다.</p><h3>동굴 탐사</h3><p>1.18 동굴과 절벽 업데이트 이후 거대 동굴이 자주 생성되어, 깊은 동굴을 따라 내려가는 편이 분기 채굴보다 빠르다. <code>야간 투시</code> 마법약을 챙기면 큰 도움이 된다.</p><h3>용암 주의</h3><p>다이아몬드 광석은 용암 호수 근처에 자주 노출되어 있다. 광석을 부수면 그 아래/옆에 용암이 있는 경우가 많으니 <strong>물 양동이는 반드시 휴대</strong>해야 한다.</p>`,
      },
      {
        id: "trivia",
        heading: "여담",
        html: `<ul><li>다이아몬드는 원래 게임 내에서 <strong>"에메랄드"</strong>로 불렸으나, 2012년 1.3.1에 진짜 에메랄드가 추가되며 지금의 이름으로 정착되었다.</li><li>현실에서도 다이아몬드는 보석뿐 아니라 드릴 날·톱날 등 <strong>공업용 절삭 도구</strong>의 핵심 재료로 사용된다.</li><li>마인크래프트 커뮤니티에서 <em>"diamonds!"</em>는 동영상에 좋아요를 의미하는 관용 표현으로 쓰일 만큼 상징적인 자원이다.</li></ul>`,
      },
    ],
  },
  "getting-started": {
    slug: "getting-started",
    title: "처음 시작하기",
    category: "items",
    heroImage: getItemTexture("oak_planks"),
    summary: "Java Edition 초보자를 위한 첫날 생존 가이드. ko.minecraft.wiki 튜토리얼을 바탕으로 핵심만 정리했으며, 목차를 누르면 해당 절로 이동합니다.",
    infobox: [
      { label: "에디션", value: "Java Edition" },
      { label: "소요 시간", value: "약 10~20분 (게임 내 1일)" },
      { label: "목표", value: "첫 밤 생존" },
      { label: "참고", value: "ko.minecraft.wiki 튜토리얼" },
    ],
    sections: [
      {
        id: "intro",
        heading: "시작하기 전에",
        html: `<p>첫날은 대략 <strong>10분</strong> 안에 도구·쉘터·음식을 갖춰야 한다. 해가 지면 좀비·스켈레톤·거미가 스폰된다.</p><p><strong>기본 조작</strong>: WASD 이동, Space 점프, Shift 웅크리기, 왼쪽 클릭 채굴·공격, 오른쪽 클릭 설치·사용, E 보관함.</p><p>스폰 후 <strong>나무·평지·동굴</strong>을 확인하고 F3 좌표를 기록하자. <a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%EC%B4%88%EB%B3%B4%EC%9E%90%EB%A5%BC_%EC%9C%84%ED%95%9C_%EA%B0%80%EC%9D%B4%EB%93%9C" target="_blank" rel="noreferrer noopener">초보자 가이드</a>, <a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%ED%95%98%EC%A7%80_%EB%A7%90%EC%95%84%EC%95%BC_%ED%95%A0%EA%B2%83" target="_blank" rel="noreferrer noopener">하지 말 것</a>, <a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%EA%B0%84%EB%8B%A8%ED%95%9C_%ED%8C%81%EA%B3%BC_%ED%8A%B8%EB%A6%AD" target="_blank" rel="noreferrer noopener">팁과 트릭</a>.</p>`,
      },
      {
        id: "wood",
        heading: "나무 모으기",
        html: `<p>주변의 나무로 다가가 <strong>맨손으로 원목을 부순다</strong>. 약 3초간 누르면 원목 1개가 드롭된다. 최소 <strong>원목 5~6개</strong>는 확보하자.</p><p>원목을 인벤토리 제작창(2×2)에 넣으면 <code>판자</code>가 되고, 판자 4개를 2×2로 배치하면 <code>제작대</code>가 만들어진다.</p>`,
      },
      {
        id: "tools",
        heading: "도구 제작",
        html: `<p>제작대를 바닥에 놓고 우클릭하면 3×3 제작창이 열린다. 다음 순서로 제작한다:</p><ol><li><strong>막대기</strong>: 판자 2개를 세로로 → 막대기 4개</li><li><strong>나무 곡괭이</strong>: 판자 3개 + 막대기 2개</li><li><strong>나무 검</strong>: 판자 2개 + 막대기 1개</li></ol><p>곡괭이가 생겼으니 바로 돌(회색 블록)을 캐서 <strong>둥근돌 5~10개</strong>를 모으고, 다시 제작대로 와서 <strong>돌 곡괭이·돌 검·화로</strong>로 업그레이드한다.</p>`,
      },
      {
        id: "food",
        heading: "음식 확보",
        html: `<p>허기 게이지가 떨어지면 체력이 회복되지 않으니 음식 확보는 필수다. 첫날의 식량은 다음 중 하나를 노리자:</p><ul><li><strong>양·소·돼지</strong> 사냥 → 생고기 드롭 → 화로에서 굽기</li><li>마을 발견 시 <strong>밭에서 밀·당근·감자</strong> 채집</li><li>물에서 <strong>낚시</strong> (낚싯대가 있다면)</li></ul>`,
      },
      {
        id: "shelter",
        heading: "쉘터 짓기",
        html: `<p>해가 기울기 시작하면 즉시 쉘터를 만들어야 한다. 가장 빠른 방법:</p><ul><li>언덕 옆면을 곡괭이로 1×2 크기로 파고 들어간다</li><li>입구를 흙이나 둥근돌로 막는다</li><li>안에 제작대, 화로, 상자를 배치</li></ul><p>창문을 한 칸 만들어두면 밖이 밝아진 것을 확인할 수 있다.</p>`,
      },
      {
        id: "night",
        heading: "첫 밤 넘기기",
        html: `<p>침대가 없다면 쉘터 안에서 기다리면 된다. <strong>횃불</strong>을 설치하면 7블록 안에서는 몬스터가 스폰되지 않는다.</p><ul><li>둥근돌·석탄 채굴, 인벤토리 정리</li><li>다음 날 철 광석·동굴 탐사 계획</li></ul><p>침대는 <strong>양털 3 + 판자 3</strong>. 가위로 양털을 깎으면 양을 죽이지 않아도 된다. 첫날 밤 밖 모험은 비추천.</p>`,
      },
      {
        id: "dont-mine",
        heading: "채굴 — 하지 말 것",
        html: `<p><a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%ED%95%98%EC%A7%80_%EB%A7%90%EC%95%84%EC%95%BC_%ED%95%A0%EA%B2%83" target="_blank" rel="noreferrer noopener">하지 말아야 할 것</a> 중 채굴 요약.</p><ul><li><strong>수직 굴 파기</strong>: 동굴·용암 낙사 위험. 계단식 채굴·표면 동굴 이용.</li><li><strong>약한 곡괭이로 고급 광석</strong>: 드롭 없음. 캐기 너무 느리면 도구 교체.</li><li><strong>물 양동이 없이 동굴</strong>: 용암·탈출·몹 차단에 필수.</li><li><strong>흑요석 바로 위에서 캐기</strong>: 아래 용암 주의.</li><li><strong>잘못된 도구</strong>: 삽·곡괭이 낭비만 늘어난다.</li></ul>`,
      },
      {
        id: "dont-fight",
        heading: "전투·생존 — 하지 말 것",
        html: `<ul><li><strong>첫날 밤 야외 모험</strong>: 갑옷·식량 부족 시 위험.</li><li><strong>크리퍼 근접</strong>: 활·히트앤런·방패 활용.</li><li><strong>네더문 주변 방치</strong>: 몹이 네더로 이동·문 파괴 가능.</li><li><strong>좀비화 피글린 선공</strong>: 주변 전원 적대화.</li><li><strong>쿨다운 무시 연타(JE)</strong>: 데미지가 극히 약해진다.</li></ul>`,
      },
      {
        id: "dont-build",
        heading: "집 짓기 — 하지 말 것",
        html: `<ul><li><strong>흙·모래·자갈만 집</strong>: 크리퍼에 취약.</li><li><strong>가연성 재료 남용</strong>: 목재·통나무·나뭇잎 등.</li><li><strong>판자 과다 제작</strong>: 보관함 낭비.</li><li><strong>용암 양동이 들고 상호작용</strong>: 실수 시 사망.</li><li><strong>주민 공격</strong>: 평판·거래 악화.</li></ul>`,
      },
      {
        id: "tips",
        heading: "유용한 팁",
        html: `<p><a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%EA%B0%84%EB%8B%A8%ED%95%9C_%ED%8C%81%EA%B3%BC_%ED%8A%B8%EB%A6%AD" target="_blank" rel="noreferrer noopener">간단한 팁과 트릭</a> 요약.</p><ul><li><strong>모래·자갈</strong>: 아래 횃불로 연쇄 채굴.</li><li><strong>방향</strong>: 블록 옆면 균열로 북쪽(곡괭이 금지).</li><li><strong>나무</strong>: 위부터 캐고 맨 아래는 마지막.</li><li><strong>침대</strong>: 새 침대에 잔 뒤 옛 침대 제거.</li><li><strong>비상 쉘터</strong>: 3칸 아래+머리 막기·횃불.</li><li><strong>울타리 문</strong>: 좀비가 문으로 인식하지 않음.</li></ul>`,
      },
    ],
  },
  "ore-distribution": {
    slug: "ore-distribution",
    title: "광물별 분포 정보",
    category: "blocks",
    heroImage: getItemTexture("diamond"),
    summary: "Java Edition 1.21 기준 주요 광물의 생성 높이(Y레벨)와 채굴 팁을 한눈에 정리한 문서입니다.",
    infobox: [
      { label: "에디션", value: "Java Edition 1.21.x" },
      { label: "최적 채굴", value: "Y=-58 ~ -59 (1.18+)" },
      { label: "네더라이트", value: "네더 고고학 Y=8~22" },
    ],
    sections: [
      {
        id: "intro",
        heading: "개요",
        html: `<p>1.18 이후 지형 생성이 바뀌어 <strong>Y=-64 ~ 320</strong> 전 구간에서 광석이 분포합니다. 대부분의 광물은 <strong>Y=-58 ~ -59</strong> 근처에서 가장 많이 나옵니다.</p>`,
      },
      {
        id: "coal",
        heading: "석탄",
        html: `<p><strong>Y=0 ~ 320</strong> 및 <strong>심층암(Y=-64~-8)</strong>. 표면~동굴에서도 자주 보입니다. 목탄 대체 연료.</p>`,
      },
      {
        id: "iron",
        heading: "철",
        html: `<p><strong>Y=-64 ~ 72</strong>, 최다 <strong>Y=16</strong> 부근. 초반 동굴·심층암 채굴로 확보.</p>`,
      },
      {
        id: "copper",
        heading: "구리",
        html: `<p><strong>Y=-16 ~ 112</strong>, 최다 <strong>Y=48</strong> 부근. 번개로 산화 구리 블록 생성 가능.</p>`,
      },
      {
        id: "gold",
        heading: "금",
        html: `<p>오버월드 <strong>Y=-64 ~ 32</strong>(최다 Y=-16). 네더 <strong>Y=0 ~ 127</strong> 전역(바드락 제외).</p>`,
      },
      {
        id: "redstone",
        heading: "레드스톤",
        html: `<p><strong>Y=-64 ~ 15</strong>, 최다 <strong>Y=-58</strong> 부근. 레드스톤 회로·마법부여 재료.</p>`,
      },
      {
        id: "lapis",
        heading: "라피스",
        html: `<p><strong>Y=-64 ~ 64</strong>, 최다 <strong>Y=0</strong> 부근. 마법부여·경험치 구슬 재료.</p>`,
      },
      {
        id: "diamond",
        heading: "다이아몬드",
        html: `<p><strong>Y=-64 ~ 16</strong>, 최다 <strong>Y=-58 ~ -59</strong>. <code>철 곡괭이 이상</code> 필수. <a href="/wiki/diamond">다이아몬드</a> 문서 참고.</p>`,
      },
      {
        id: "emerald",
        heading: "에메랄드",
        html: `<p>산악·윈드스윕 바이옴에서만 광석 생성. 주민 거래가 더 흔한 획득 경로.</p>`,
      },
      {
        id: "netherite",
        heading: "네더라이트",
        html: `<p><strong>고대 잔해</strong>가 네더 <strong>Y=8 ~ 22</strong>에 매우 희귀 생성. 폭발·용암 주의, <code>다이아몬드/네더라이트 곡괭이</code>로 채굴.</p>`,
      },
    ],
  },
  "nether-portal": {
    slug: "nether-portal",
    title: "네더 차원문",
    category: "nether",
    heroImage: getBlockTexture("obsidian"),
    summary: "네더 차원문은 오버월드와 네더 차원을 연결하는 관문 역할의 구조물이다. 흑요석으로 직사각형 프레임을 만들고 부싯돌과 부시로 점화하면 보라색 차원문이 활성화된다.",
    infobox: [
      { label: "필요 재료", value: "흑요석 10개 (최소), 부싯돌과 부시" },
      { label: "최소 크기", value: "4 × 5 (내부 2 × 3)" },
      { label: "최대 크기", value: "23 × 23" },
      { label: "차원 이동 비율", value: "네더 1블록 = 오버월드 8블록" },
      { label: "활성화 시간", value: "차원문 위에서 4초" },
      { label: "추가됨", value: "Alpha v1.2.0 (할로윈 업데이트)" },
    ],
    sections: [
      {
        id: "overview",
        heading: "개요",
        html: `<p>네더 차원문은 <strong>오버월드와 네더 차원 사이의 관문 역할</strong>을 하는 제작 가능한 구조물이다. 차원문을 통해 두 차원을 자유롭게 오갈 수 있으며, 마인크래프트의 탐험 범위를 크게 확장한다.</p><p>차원문 안에서 <strong>4초 이상 머무르면</strong> 반대편 차원으로 이동하며, 그곳에 대응하는 차원문이 없으면 자동으로 새 차원문이 생성된다.</p>`,
      },
      {
        id: "build",
        heading: "만드는 방법",
        html: `<h3>흑요석 확보</h3><p>네더 차원문의 핵심 재료는 흑요석이다. 흑요석은 다음 방법으로 얻을 수 있다:</p><ul><li><strong>용암 + 물</strong>: 정지한 용암 위에 물을 부으면 그 자리가 흑요석이 된다</li><li><strong>다이아몬드 곡괭이</strong>로만 채굴 가능 (그 외는 드롭 없음)</li><li>요새, 폐광 등 구조물에서 자연 생성</li></ul><h3>프레임 쌓기</h3><p>흑요석을 다음과 같이 <strong>4 × 5 직사각형</strong>으로 쌓는다 (내부 공간 2 × 3):</p><pre><code>■ ■ ■ ■
■ . . ■
■ . . ■
■ . . ■
■ ■ ■ ■</code></pre><p>모서리 4칸은 흑요석이 아니어도 되므로 <strong>최소 10개</strong>만 있어도 완성 가능하다. 최대 23×23 크기까지 만들 수 있다.</p><h3>점화</h3><p>완성된 프레임 내부의 어느 한 칸에 <code>부싯돌과 부시</code>를 사용하거나, <strong>화염구·라바·블레이즈 화염</strong>을 맞추면 보라색 차원문이 활성화된다.</p>`,
      },
      {
        id: "ratio",
        heading: "1:8 차원 비율",
        html: `<p>네더에서 이동한 거리는 오버월드의 <strong>8배 거리</strong>에 해당한다. 즉, 네더에서 100블록 걸으면 오버월드 800블록만큼 이동한 셈이다.</p><p>이 비율을 활용하면 <strong>오버월드의 먼 지점을 네더 고속도로로 빠르게 이동</strong>할 수 있어, 베이스 ↔ 베이스 간 이동에 자주 쓰인다. 좌표 변환은 단순히 <code>오버월드 좌표 ÷ 8 = 네더 좌표</code>다.</p>`,
      },
      {
        id: "warnings",
        heading: "주의사항",
        html: `<ul><li><strong>몹 통과</strong>: 위더와 엔더 드래곤을 제외한 모든 몹은 차원문을 통과할 수 있다. 좀비 피글린이 오버월드로 따라 나올 수 있으니 주의.</li><li><strong>청크 언로드</strong>: 플레이어가 떠난 차원의 청크는 시간이 멈추므로, 한쪽에 두고 온 아이템은 다시 돌아와야 회수할 수 있다.</li><li><strong>차원문 링크</strong>: 두 차원문 좌표가 1:8 비율에 가까우면 자동으로 연결된다. 가까이 다른 차원문을 만들면 의도하지 않은 곳에 연결될 수 있으니 좌표 계산이 중요하다.</li><li><strong>좀비 피글린 스폰</strong>: 차원문 블록 위에는 낮은 확률로 좀비 피글린이 스폰될 수 있다.</li></ul>`,
      },
    ],
  },
  "auto-farm": {
    slug: "auto-farm",
    title: "자동 농장",
    category: "redstone",
    heroImage: getItemTexture("wheat"),
    summary: "물줄기·호퍼·디스펜서·옵저버 등을 조합해 사람의 개입 없이 작물과 자원을 수집하는 시스템. 이 문서는 초보자가 그대로 따라할 수 있는 8가지 자동 농장 제작법을 단계별로 안내한다.",
    infobox: [
      { label: "분야", value: "농업 / 레드스톤" },
      { label: "공통 부품", value: "호퍼 · 상자 · 물 양동이" },
      { label: "권장 부품", value: "옵저버 · 디스펜서 · 피스톤" },
      { label: "농장 종류", value: "8개 (사탕수수·대나무·선인장·밀·수박·닭·화로·낚시)" },
    ],
    sections: [
      {
        id: "intro",
        heading: "시작하기 전에",
        html: `<p>이 문서의 모든 농장은 <strong>철 30개 미만</strong>으로 만들 수 있는 초보자용 설계다. 효율보다 <em>"만들기 쉬움"</em>과 <em>"안정성"</em>에 초점을 맞췄다.</p><p>각 농장마다 다음을 표시한다:</p><ul><li><strong>★ 난이도</strong> — 1~5 스케일</li><li><strong>📦 재료 목록</strong> — 정확한 개수</li><li><strong>🏗 만드는 법</strong> — 그림과 함께 단계별로</li><li><strong>⚙ 작동 원리</strong> — 왜 작동하는지</li><li><strong>💡 팁</strong> — 흔한 실수 방지</li></ul>`,
      },
      {
        id: "principles",
        heading: "꼭 알아야 할 4가지 원리",
        html: `<h3>1. 호퍼는 위의 아이템을 빨아들인다</h3><p>호퍼 위 1칸 안에 떨어진 아이템은 자동으로 호퍼에 들어간다. 호퍼 → 호퍼 → 상자 식으로 체인 연결 가능.</p><h3>2. 물은 7칸까지 흐르며 아이템을 민다</h3><p>1×8 도랑에 물 한 칸을 부으면 끝까지 흐른다. 아이템은 물에 떠밀려 호퍼 방향으로 자동 이동.</p><h3>3. 옵저버는 앞 블록의 변화를 감지한다</h3><p>옵저버 얼굴 앞 블록이 바뀌면(작물 성장, 피스톤 작동 등) <strong>한 번만 짧은 펄스</strong>를 출력한다. "다 자랐을 때 자동 수확"의 핵심.</p><h3>4. 피스톤은 12블록까지 밀어낸다</h3><p>레드스톤 신호가 들어오면 앞 블록을 1칸 밀고, 신호가 끊기면 일반 피스톤은 그대로 두지만 <strong>끈끈이 피스톤</strong>은 다시 당긴다.</p>`,
      },
      {
        id: "farm-sugar",
        heading: "1. 사탕수수 자동 농장 ★☆☆☆☆",
        html: `<p>가장 쉬운 자동 농장. <strong>한 줄짜리 사탕수수 1칸당 옵저버+피스톤 1쌍</strong>이면 끝난다.</p>

<figure class="my-5">
  <video controls preload="metadata" playsinline class="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md bg-black">
    <source src="${BASE}/videos/sugar-cane.mp4" type="video/mp4" />
    브라우저가 비디오를 지원하지 않습니다.
  </video>
  <figcaption class="text-xs text-zinc-500 mt-2 text-center">▶ 실제 사탕수수 자동 농장 작동 영상</figcaption>
</figure>

<h3>📦 재료 (1칸 기준)</h3>
<ul>
  <li>사탕수수 1개</li>
  <li>흙 또는 모래 1개</li>
  <li>물 양동이 1개</li>
  <li>옵저버 1개</li>
  <li>일반 피스톤 1개</li>
  <li>호퍼 1개 + 상자 1개</li>
  <li>아무 블록(둥근돌 등) 약간</li>
</ul>

<h3>🏗 만드는 법</h3>
<p>옆에서 본 단면도 (가장 단순한 1칸짜리):</p>
${farmDiagram([
  [null, null, "옵저버", "피스톤", null],
  [null, "사탕수수", null, null, null],
  [null, "사탕수수", null, null, null],
  ["둥근돌", "흙", "물", "둥근돌", null],
  ["호퍼", "호퍼", null, null, "상자"],
], "사탕수수 자동 농장 — 옆에서 본 단면도")}
<ol>
  <li>바닥에 <strong>흙 1칸, 물 1칸</strong> 도랑을 판다 (사탕수수는 물 옆에서만 자람).</li>
  <li>흙 위에 사탕수수를 심는다.</li>
  <li>사탕수수가 자라는 <strong>두 번째 칸 옆</strong>에 옵저버를 사탕수수 쪽으로 향하게 설치한다.</li>
  <li>옵저버 반대편(출력)에 일반 피스톤을 두고, 피스톤이 두 번째 사탕수수를 밀도록 배치.</li>
  <li>사탕수수 아래쪽 물 도랑이 호퍼로 흘러가게 한다. 호퍼는 상자에 연결.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>사탕수수가 1칸에서 2칸으로 자라는 순간 옵저버가 감지 → 펄스 출력 → 피스톤이 위쪽 사탕수수를 부숨 → 아이템이 떨어져 물에 휩쓸려 호퍼로 → 상자에 모임. 반복.</p>

<h3>💡 팁</h3>
<ul>
  <li>가로로 늘리면 무한 확장 가능. 옵저버+피스톤 쌍을 옆에 계속 붙이면 된다.</li>
  <li>피스톤은 <strong>일반 피스톤</strong>을 써야 한다 (끈끈이는 다시 당겨서 안 됨).</li>
  <li>맨 아래 사탕수수는 부숴지지 않으므로 영구히 다시 자란다.</li>
</ul>`,
      },
      {
        id: "farm-bamboo",
        heading: "2. 대나무 자동 농장 ★☆☆☆☆",
        html: `<p>사탕수수 농장과 거의 동일한 구조. 차이점은 <strong>대나무는 물이 필요 없고 흙·이끼·모래 어디서나 자란다</strong>는 점.</p>

<figure class="my-5">
  <video controls preload="metadata" playsinline class="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md bg-black">
    <source src="${BASE}/videos/bamboo.mp4" type="video/mp4" />
    브라우저가 비디오를 지원하지 않습니다.
  </video>
  <figcaption class="text-xs text-zinc-500 mt-2 text-center">▶ 실제 대나무 자동 농장 작동 영상</figcaption>
</figure>

<h3>📦 재료 (1칸 기준)</h3>
<ul>
  <li>대나무 묘목 1개</li>
  <li>흙 1개</li>
  <li>옵저버 1개 · 일반 피스톤 1개</li>
  <li>호퍼 1개 + 상자 1개</li>
  <li>물 양동이 1개 (수집용)</li>
</ul>

<h3>🏗 만드는 법</h3>
${farmDiagram([
  [null, "대나무", null, null, null],
  [null, "대나무", null, null, null],
  [null, "대나무", "옵저버", "피스톤", null],
  [null, "대나무", null, null, null],
  ["둥근돌", "흙", "물", null, null],
  ["호퍼", "호퍼", null, null, "상자"],
], "대나무 자동 농장 — 3블록 높이에서 감지")}
<ol>
  <li>흙 위에 대나무 1개를 심는다.</li>
  <li>대나무 <strong>3블록 높이</strong> 옆에 옵저버를 대나무 쪽으로 설치.</li>
  <li>옵저버 출력 쪽에 피스톤을 두어 그 높이의 대나무를 부수도록 배치.</li>
  <li>밑에 물줄기와 호퍼+상자로 수집부.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>대나무가 3번째 칸에 도달하면 옵저버가 감지 → 피스톤이 그 칸을 부숨 → 위쪽 대나무가 모두 떨어져 아이템화 → 물에 휩쓸려 호퍼로.</p>

<h3>💡 팁</h3>
<ul>
  <li>대나무는 <strong>화로 연료</strong>로 사용 가능 (대나무 1개 = 0.25 아이템 제련). 자동 제련소와 연결하면 무한 연료.</li>
  <li>4개를 압축하면 <strong>대나무 블록</strong>이 되고, 다시 판자로 만들 수 있다.</li>
</ul>`,
      },
      {
        id: "farm-cactus",
        heading: "3. 선인장 자동 농장 ★☆☆☆☆",
        html: `<p>레드스톤 부품이 <strong>0개</strong> 필요한 가장 저렴한 농장. 선인장은 옆에 다른 블록이 닿으면 스스로 부서지는 특성을 활용.</p>

<figure class="my-5">
  <video controls preload="metadata" playsinline class="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md bg-black">
    <source src="${BASE}/videos/cactus.mp4" type="video/mp4" />
    브라우저가 비디오를 지원하지 않습니다.
  </video>
  <figcaption class="text-xs text-zinc-500 mt-2 text-center">▶ 실제 선인장 자동 농장 작동 영상</figcaption>
</figure>

<h3>📦 재료 (1칸 기준)</h3>
<ul>
  <li>선인장 1개</li>
  <li>모래 1개</li>
  <li>아무 블록(유리 추천) 1개</li>
  <li>호퍼 1개 + 상자 1개</li>
</ul>

<h3>🏗 만드는 법</h3>
${farmDiagram([
  [null, "유리", null],
  ["선인장", null, null],
  ["선인장", null, null],
  ["모래", null, null],
  ["호퍼", null, "상자"],
], "선인장 자동 농장 — 자라서 옆 블록에 닿으면 자동 파괴")}
<ol>
  <li>호퍼 위에 모래를 놓고 그 위에 선인장 심기.</li>
  <li>선인장이 <strong>2번째 칸까지 자랄 위치 옆</strong>에 아무 블록 하나를 붙여 둔다 (유리가 보기 좋음).</li>
  <li>호퍼는 상자에 연결.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>선인장이 1칸 자라면 옆 블록과 닿게 되고, 마인크래프트의 규칙에 의해 <strong>즉시 부숴져 아이템으로 떨어진다</strong>. 바로 아래 호퍼가 수집.</p>

<h3>💡 팁</h3>
<ul>
  <li>레드스톤이 전혀 안 들어가므로 게임 시작 후 며칠 만에 만들 수 있다.</li>
  <li>선인장은 <strong>초록 염료</strong> 제작 + 화로 연료로 사용. AFK 농장으로 가장 인기.</li>
  <li>옆 블록이 호퍼와 같은 높이가 되면 안 됨 — 항상 <strong>모래보다 1칸 위</strong>에 옆 블록이 있어야 한다.</li>
</ul>`,
      },
      {
        id: "farm-wheat",
        heading: "4. 밀·당근·감자 반자동 농장 ★★☆☆☆",
        html: `<p>레버 한 번으로 모든 작물을 일괄 수확. 9×9 표준 농장에 디스펜서 물탱크를 결합한 구조다.</p>

<figure class="my-5">
  <video controls preload="metadata" playsinline class="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md bg-black">
    <source src="${BASE}/videos/wheat.mp4" type="video/mp4" />
    브라우저가 비디오를 지원하지 않습니다.
  </video>
  <figcaption class="text-xs text-zinc-500 mt-2 text-center">▶ 실제 밀 자동 농장 작동 영상</figcaption>
</figure>

<h3>📦 재료 (9×9 농장 기준)</h3>
<ul>
  <li>흙 80개 (괭이로 갈아 경작지)</li>
  <li>씨앗(밀)/당근/감자 80개</li>
  <li>물 양동이 1개</li>
  <li>호퍼 9개 + 상자 1~2개</li>
  <li>유리/울타리 (벽용, 약 36개)</li>
  <li>횃불 4개 (선택)</li>
</ul>

<h3>🏗 만드는 법</h3>
<p>위에서 본 9×9 평면도 (간략 버전):</p>
${farmDiagram([
  ["디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서"],
  ["흙", "흙", "흙", "흙", "흙", "흙", "흙", "흙", "흙"],
  ["흙", "흙", "흙", "흙", "물", "흙", "흙", "흙", "흙"],
  ["흙", "흙", "흙", "흙", "흙", "흙", "흙", "흙", "흙"],
  ["호퍼", "호퍼", "호퍼", "호퍼", "호퍼", "호퍼", "호퍼", "호퍼", "호퍼"],
], "밀·당근·감자 반자동 농장 — 위에서 본 평면도")}
<ol>
  <li>9×9 사각형을 흙으로 깐다. 중앙에 물 한 칸을 부어 모든 경작지를 축축하게.</li>
  <li>괭이로 모든 흙을 경작지로 변환 후 씨앗/당근/감자 심기.</li>
  <li>한쪽 끝(아래쪽)을 <strong>한 칸 낮춰서 호퍼 9개를 일렬로</strong>, 상자에 연결.</li>
  <li>반대편 끝(위쪽)에 디스펜서를 호퍼 줄을 향하도록 설치, 물 양동이를 디스펜서 안에 넣음.</li>
  <li>디스펜서 옆에 레버 또는 버튼 연결.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>레버 ON → 디스펜서가 물을 흘림 → 물이 9칸을 휩쓸며 모든 다 자란 작물을 부숨 → 호퍼로 수집 → 레버 OFF → 디스펜서가 물 회수. 약 1분 만에 80칸 수확 완료.</p>

<h3>💡 팁</h3>
<ul>
  <li>전체 작물이 다 자라기 전에 수확하면 손해. 멀리서 봐서 <strong>모두 익었을 때만</strong> 레버를 켜자.</li>
  <li>당근·감자는 씨앗 없이 작물 자체가 다시 심을 거리가 되므로 무한 농장.</li>
  <li>경작지 주위에 <strong>울타리</strong>로 막아야 점프하다 경작지가 흙으로 변하지 않는다.</li>
</ul>`,
      },
      {
        id: "farm-melon",
        heading: "5. 수박·호박 자동 농장 ★★☆☆☆",
        html: `<p>줄기가 옆 칸에 열매를 만드는 특성을 이용한 완전 자동 농장. 한 번 설치하면 평생 수확.</p>

<figure class="my-5">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid #3f3f46;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
    <iframe src="https://www.youtube.com/embed/spGSyplOuYg" title="수박·호박 자동 농장 만들기 마인크래프트" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>
  </div>
  <figcaption style="margin-top:8px;font-size:12px;color:#71717a;text-align:center;">🎬 수박·호박 자동 농장 만들기</figcaption>
</figure>

<h3>📦 재료 (4줄기 기준)</h3>
<ul>
  <li>수박/호박 씨앗 4개</li>
  <li>경작지 4개</li>
  <li>옵저버 4개 · 일반 피스톤 4개</li>
  <li>호퍼 4개 + 상자 1개</li>
  <li>물 양동이 1개</li>
  <li>흙·아무 블록 약간</li>
</ul>

<h3>🏗 만드는 법</h3>
${farmDiagram([
  ["흙", "수박 줄기", "수박 블록", "옵저버", "피스톤"],
  ["둥근돌", null, "물", "호퍼", "호퍼"],
  [null, null, null, null, "상자"],
], "수박 자동 농장 — 위에서 본 평면도 (줄기 → 열매 → 피스톤)")}
<ol>
  <li>경작지 1칸 + 옆에 흙 1칸(열매 생성용)을 배치, 옆에 물 1칸으로 경작지 축축하게.</li>
  <li>경작지에 수박/호박 씨앗 심기.</li>
  <li>흙 칸 옆면에 옵저버를 흙 쪽으로 향하게 설치.</li>
  <li>옵저버 출력에 피스톤을 두어, 열매가 생기면 부수도록 배치.</li>
  <li>피스톤이 부순 열매가 떨어지는 자리 아래에 물 + 호퍼 + 상자.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>줄기가 자라 옆 칸에 열매를 생성 → 옵저버가 열매 생성을 감지 → 피스톤이 열매 부숨 → 아이템 떨어짐 → 물에 휩쓸려 호퍼로. 줄기는 그대로이므로 다시 열매가 생기고 반복.</p>

<h3>💡 팁</h3>
<ul>
  <li>호박은 <strong>호박 파이</strong>의 핵심 재료. 가성비 좋은 식량으로 자주 만든다.</li>
  <li>수박 조각 9개로 다시 수박 블록 제작 가능 — 저장 효율 9배.</li>
  <li>줄기가 자라는 데 시간이 걸리므로 첫 수확까지 인내 필요.</li>
</ul>`,
      },
      {
        id: "farm-chicken",
        heading: "6. 닭 자동 농장 ★★☆☆☆",
        html: `<p>달걀이 자동으로 모이고 던져서 부화 → 자란 닭은 용암으로 자동 도살 → 구운 닭이 모이는 구조. 식량+깃털 동시 확보.</p>

<figure class="my-5">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid #3f3f46;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
    <iframe src="https://www.youtube.com/embed/5EAhaozHkAM" title="마인크래프트 100% 자동 초간단 닭 농장" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>
  </div>
  <figcaption style="margin-top:8px;font-size:12px;color:#71717a;text-align:center;">🎬 레드스톤 강좌 — 초간단 자동 닭 농장 만들기</figcaption>
</figure>

<h3>📦 재료</h3>
<ul>
  <li>닭 2마리 (또는 알 몇 개)</li>
  <li>디스펜서 1개</li>
  <li>호퍼 3개 + 상자 1개</li>
  <li>유리 블록 약 12개 (관찰용 벽)</li>
  <li>둥근돌 약간</li>
  <li>용암 양동이 1개</li>
  <li>레드스톤 시계 (간단한 비교기 루프) 또는 버튼</li>
</ul>

<h3>🏗 만드는 법</h3>
${farmDiagram([
  [null, "디스펜서", null, null],
  [null, "유리", null, null],
  ["유리", "닭", "유리", null],
  ["유리", "트랩도어", "유리", null],
  ["유리", "닭", "유리", null],
  [null, "용암", null, null],
  ["호퍼", "호퍼", "호퍼", "상자"],
], "닭 자동 농장 — 옆에서 본 단면도 (알 발사 → 부화 → 용암 도살)")}
<ol>
  <li>2×2 공간을 만들고 위쪽엔 닭 성체용, 아래쪽엔 새끼 닭용 칸.</li>
  <li>두 공간 사이는 <strong>트랩도어</strong> 또는 빈 공간 1칸 — 새끼만 떨어지고 성체는 떨어지지 않도록.</li>
  <li>성체 공간 바닥에 호퍼를 깔아 알을 수집.</li>
  <li>호퍼와 디스펜서를 연결. 디스펜서에 레드스톤 시계로 약 1초에 한 번 신호 → 알 발사.</li>
  <li>발사된 알은 1/8 확률로 새끼 부화. 새끼는 트랩도어를 빠져나가 용암 칸으로.</li>
  <li>새끼가 성체가 되는 순간 용암에 닿아 죽고 구운 닭고기가 호퍼로 수집.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>닭은 가만히 있어도 5~10분마다 알을 낳음 → 호퍼 수집 → 디스펜서로 발사 → 알이 부딪힐 때 새끼 부화 → 자라서 용암 → 도살. 닭은 1번만 가두고 평생 식량 확보.</p>

<h3>💡 팁</h3>
<ul>
  <li>레드스톤 시계는 <strong>비교기 + 호퍼</strong> 조합으로 간단히 만들 수 있다.</li>
  <li>용암은 새끼는 안 죽이고 성체만 죽인다 — 트랩도어 높이 조절이 핵심.</li>
  <li>화재 위험이 있으니 주변은 둥근돌·유리 등 <strong>불에 안 타는</strong> 블록으로.</li>
</ul>`,
      },
      {
        id: "farm-smelter",
        heading: "7. 자동 화로 (제련소) ★★☆☆☆",
        html: `<p>광물을 넣으면 자동으로 연료를 공급해 제련하고, 결과물이 상자에 모이는 시스템. 광부의 필수품.</p>

<figure class="my-5">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid #3f3f46;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
    <iframe src="https://www.youtube.com/embed/R3_kUKgADII" title="자동 화로 만들기 마인크래프트" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>
  </div>
  <figcaption style="margin-top:8px;font-size:12px;color:#71717a;text-align:center;">🎬 자동 화로(제련소) 만들기</figcaption>
</figure>

<h3>📦 재료 (화로 1개 기준)</h3>
<ul>
  <li>화로 1개</li>
  <li>호퍼 3개</li>
  <li>상자 3개</li>
</ul>

<h3>🏗 만드는 법</h3>
${farmDiagram([
  [null, "상자", null, null, null],
  [null, "호퍼", null, null, null],
  ["상자", "호퍼", "화로", null, null],
  [null, "호퍼", null, null, null],
  [null, "상자", null, null, null],
], "자동 제련소 — 옆에서 본 구조 (원료↓ · 연료→ · 결과물↓)")}
<ol>
  <li>먼저 가장 아래에 <strong>결과물 상자</strong>를 두고 위에 호퍼를 화로 방향으로 설치 (Shift + 우클릭으로 호퍼를 위 블록에 향하게).</li>
  <li>그 위에 <strong>화로</strong>.</li>
  <li>화로 <strong>옆면</strong>에 호퍼를 화로 쪽으로 → 옆에 <strong>연료 상자</strong>. (연료는 화로의 아래쪽 슬롯에 들어간다.)</li>
  <li>화로 <strong>위쪽</strong>에 호퍼를 화로 쪽으로 → 그 위에 <strong>원재료 상자</strong>. (광물은 위쪽 슬롯.)</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>위 상자에 철광석 넣음 → 호퍼가 화로 윗칸에 투입 → 옆 상자의 석탄이 호퍼로 화로 연료칸에 자동 공급 → 화로가 제련 → 완성된 철 주괴를 아래 호퍼가 빨아 상자로 이동.</p>

<h3>💡 팁</h3>
<ul>
  <li>호퍼 방향이 중요: 화로 윗칸은 원료 슬롯, 옆칸은 연료 슬롯, 아랫칸은 결과물 슬롯.</li>
  <li>연료는 <strong>용암 양동이(100개 제련) > 석탄 블록(80개) > 석탄(8개)</strong> 순으로 효율적.</li>
  <li>광물이 많다면 화로를 <strong>3~6개 옆으로 늘려</strong> 같은 상자에 연결하면 6배속 제련.</li>
</ul>`,
      },
      {
        id: "farm-fishing",
        heading: "8. AFK 낚시기 ★★☆☆☆",
        html: `<p>마우스 우클릭만 자동화하면 잠자는 동안 활·마법 책·이름표·안장 같은 보물이 모인다.</p>

<figure class="my-5">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid #3f3f46;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
    <iframe src="https://www.youtube.com/embed/eQDq4f4XLNU" title="1.21+ 5초만에 만드는 자동낚시장치" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>
  </div>
  <figcaption style="margin-top:8px;font-size:12px;color:#71717a;text-align:center;">🎬 1.21+ 자동 낚시장치 만들기</figcaption>
</figure>

<h3>📦 재료</h3>
<ul>
  <li>운수 III · 미끼 III 마법부여된 낚싯대 1개</li>
  <li>호퍼 2개 + 상자 1개</li>
  <li>흙·블록 약간</li>
  <li>자동 클릭 도구 (게임 옵션이 아닌 외부 — 또는 단순 무게로 마우스 누름)</li>
</ul>

<h3>🏗 만드는 법</h3>
${farmDiagram([
  [null, "둥근돌", null],
  ["둥근돌", "물", "둥근돌"],
  [null, "호퍼", null],
  [null, "상자", null],
], "AFK 낚시기 — 위에서 본 평면도 (호퍼가 물 옆에서 아이템 회수)")}
<ol>
  <li>1×1 물 웅덩이를 만든다.</li>
  <li>물 칸 옆에 호퍼를 물 쪽으로 향하게 설치 (Shift + 우클릭).</li>
  <li>호퍼 아래에 상자.</li>
  <li>플레이어가 물 위를 정확히 바라보고 낚싯대를 던진다.</li>
  <li>마우스 우클릭 자동화로 낚시 반복.</li>
</ol>

<h3>⚙ 작동 원리</h3>
<p>입질이 오면 자동 클릭으로 낚싯대를 당김 → 물에서 아이템 튀어나옴 → 인벤토리로 가지 않고 물 위 호퍼가 빨아들임 → 상자로 이동. <strong>미끼 III</strong> 마법이 있으면 입질 시간 단축.</p>

<h3>💡 팁</h3>
<ul>
  <li>일반 모드에선 약 2~3분에 1번 입질. 자기 전에 켜두면 아침에 보물 수십 개.</li>
  <li>마법부여 책 · 이름표 · 안장 · 활 등 <strong>구하기 힘든 아이템</strong>이 주로 나옴.</li>
  <li>1.20부터 보물 풀이 너프되어 이전만큼 효율은 아니지만 여전히 강력하다.</li>
</ul>`,
      },
      {
        id: "comparison",
        heading: "어떤 농장부터 만들까?",
        html: `<p>난이도와 재료 비용을 기준으로 추천 순서:</p>
<ol>
  <li><strong>🥇 선인장 농장</strong> — 레드스톤 없이도 가능. 게임 시작 첫째 주에 가능.</li>
  <li><strong>🥈 사탕수수 농장</strong> — 옵저버 하나만 있으면 됨. 종이·책 무한.</li>
  <li><strong>🥉 자동 화로</strong> — 호퍼 3개로 광부 라이프 혁명.</li>
  <li>대나무 농장 — 사탕수수와 같은 원리, 연료로 활용.</li>
  <li>밀/당근/감자 반자동 — 식량 비축용.</li>
  <li>수박·호박 — 호박 파이를 위한 호박 확보.</li>
  <li>닭 농장 — 가장 효율적인 식량+깃털 농장. 레드스톤 시계 필요.</li>
  <li>AFK 낚시 — 마법부여 책 수급 필요할 때.</li>
</ol>`,
      },
      {
        id: "tips",
        heading: "공통 주의사항",
        html: `<ul>
  <li><strong>청크 로딩</strong>: 플레이어가 멀리 떠나면 청크가 언로드되어 농장이 멈춘다. 베이스에서 128블록 이내에 만들거나 <em>스폰 청크</em>에 두자.</li>
  <li><strong>빛 레벨 9 이상</strong>: 작물은 빛이 부족하면 자라지 않는다. 발광석·횃불을 충분히.</li>
  <li><strong>물 영향 범위</strong>: 경작지는 주변 4칸 이내 물이 있어야 축축해진다. 물 1칸으로 9×2(흙 18칸) 커버 가능.</li>
  <li><strong>호퍼 방향</strong>: <code>Shift + 우클릭</code>으로 호퍼를 특정 블록에 향하게 설치. 잘못 놓으면 아이템이 안 흘러간다.</li>
  <li><strong>점진적 확장</strong>: 한 번에 큰 농장을 짓지 말고, 작은 1유닛으로 작동 확인 후 옆으로 늘리자.</li>
</ul>`,
      },
    ],
  },
};

export function getDocsByCategory(catSlug: string): WikiDoc[] {
  return Object.values(docs).filter((d) => d.category === catSlug);
}
