import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";

const path = resolve(root, "lib/data.ts");
let s = readFileSync(path, "utf8");

if (s.includes("dont-mine")) {
  console.log("already patched");
  process.exit(0);
}

const extra = `,
      {
        id: "dont-mine",
        heading: "하지 말 것 — 채굴",
        html: \`<p><a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%ED%95%98%EC%A7%80_%EB%A7%90%EC%95%84%EC%95%BC_%ED%95%A0%EA%B2%83" target="_blank" rel="noreferrer noopener">하지 말아야 할 것</a> 요약</p><ul><li>수직 굴 — 용암·낙사. 계단·분기 채굴</li><li>낮은 곡괭이로 고급 광석 — 드롭 없음</li><li>물 양동이 없이 깊은 동굴</li></ul>\`,
      },
      {
        id: "dont-fight",
        heading: "하지 말 것 — 전투·생존",
        html: \`<ul><li>첫날 밤 야외 모험</li><li>크리퍼 근접 난타</li><li>네더문 주변 몹 방치</li><li>Java 공격 연타 스팸</li></ul>\`,
      },
      {
        id: "dont-build",
        heading: "하지 말 것 — 집·기타",
        html: \`<ul><li>흙·모래만 집 — 크리퍼에 약함</li><li>가연성 블록 위주 집</li><li>용암 양동이 들고 UI 조작</li><li>주민 공격</li></ul>\`,
      },
      {
        id: "tips",
        heading: "알아두면 좋은 팁",
        html: \`<p><a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%EA%B0%84%EB%8B%A8%ED%95%9C_%ED%8C%81%EA%B3%BC_%ED%8A%B8%EB%A6%AD" target="_blank" rel="noreferrer noopener">팁과 트릭</a> 요약: 분기 채굴(Y≈-54), 횃불로 밝기 7+, ESC 제작창. <a href="/dimension/overworld">오버월드</a>에서 블록·아이템 검색.</p>\``;

const anchor = `        id: "night",`;
const pos = s.indexOf(anchor);
if (pos < 0) throw new Error("night section not found");

const end = s.indexOf("      },\n    ],", pos);
if (end < 0) throw new Error("night end not found");

s =
  s.slice(0, end) +
  extra +
  s.slice(end);
s = s.replace('heading: "5. 첫 밤 넘기기"', 'heading: "첫 밤 넘기기"');

writeFileSync(path, s, "utf8");
console.log("patched getting-started sections");
