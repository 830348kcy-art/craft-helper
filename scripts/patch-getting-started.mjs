import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "data.ts");
let src = fs.readFileSync(dataPath, "utf8");

if (src.includes('id: "dont-mine"')) {
  console.log("Already patched.");
  process.exit(0);
}

const gsStart = src.indexOf('"getting-started":');
const nightStart = src.indexOf('id: "night",', gsStart);
const sectionsEnd = src.indexOf('"nether-portal":', nightStart);
if (nightStart < 0 || sectionsEnd < 0) {
  console.error("Section bounds not found");
  process.exit(1);
}
// Rewind to end of getting-started sections array: `    ],\n  },\n  `
let cut = sectionsEnd;
while (cut > nightStart && !src.slice(cut - 8, cut).includes("],")) cut--;
const arrayClose = src.lastIndexOf("    ],", sectionsEnd);
if (arrayClose < nightStart) {
  console.error("Array close not found");
  process.exit(1);
}
const cutAt = arrayClose;

const nightBlock = `id: "night",
        heading: "첫 밤 넘기기",
        html: \`<p>침대가 없다면 쉘터 안에서 기다리면 된다. <strong>횃불</strong>을 설치하면 7블록 안에서는 몬스터가 스폰되지 않는다.</p><ul><li>둥근돌·석탄 채굴, 인벤토리 정리</li><li>다음 날 철 광석·동굴 탐사 계획</li></ul><p>침대는 <strong>양털 3 + 판자 3</strong>. 가위로 양털을 깎으면 양을 죽이지 않아도 된다. 첫날 밤 밖 모험은 비추천.</p>\`,
      },
      {
        id: "dont-mine",
        heading: "채굴 — 하지 말 것",
        html: \`<p><a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%ED%95%98%EC%A7%80_%EB%A7%90%EC%95%84%EC%95%BC_%ED%95%A0%EA%B2%83" target="_blank" rel="noreferrer noopener">하지 말아야 할 것</a> 중 채굴 요약.</p><ul><li><strong>수직 굴 파기</strong>: 동굴·용암 낙사 위험. 계단식 채굴·표면 동굴 이용.</li><li><strong>약한 곡괭이로 고급 광석</strong>: 드롭 없음. 캐기 너무 느리면 도구 교체.</li><li><strong>물 양동이 없이 동굴</strong>: 용암·탈출·몹 차단에 필수.</li><li><strong>흑요석 바로 위에서 캐기</strong>: 아래 용암 주의.</li><li><strong>잘못된 도구</strong>: 삽·곡괭이 낭비만 늘어난다.</li></ul>\`,
      },
      {
        id: "dont-fight",
        heading: "전투·생존 — 하지 말 것",
        html: \`<ul><li><strong>첫날 밤 야외 모험</strong>: 갑옷·식량 부족 시 위험.</li><li><strong>크리퍼 근접</strong>: 활·히트앤런·방패 활용.</li><li><strong>네더문 주변 방치</strong>: 몹이 네더로 이동·문 파괴 가능.</li><li><strong>좀비화 피글린 선공</strong>: 주변 전원 적대화.</li><li><strong>쿨다운 무시 연타(JE)</strong>: 데미지가 극히 약해진다.</li></ul>\`,
      },
      {
        id: "dont-build",
        heading: "집 짓기 — 하지 말 것",
        html: \`<ul><li><strong>흙·모래·자갈만 집</strong>: 크리퍼에 취약.</li><li><strong>가연성 재료 남용</strong>: 목재·통나무·나뭇잎 등.</li><li><strong>판자 과다 제작</strong>: 보관함 낭비.</li><li><strong>용암 양동이 들고 상호작용</strong>: 실수 시 사망.</li><li><strong>주민 공격</strong>: 평판·거래 악화.</li></ul>\`,
      },
      {
        id: "tips",
        heading: "유용한 팁",
        html: \`<p><a href="https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%EA%B0%84%EB%8B%A8%ED%95%9C_%ED%8C%81%EA%B3%BC_%ED%8A%B8%EB%A6%AD" target="_blank" rel="noreferrer noopener">간단한 팁과 트릭</a> 요약.</p><ul><li><strong>모래·자갈</strong>: 아래 횃불로 연쇄 채굴.</li><li><strong>방향</strong>: 블록 옆면 균열로 북쪽(곡괭이 금지).</li><li><strong>나무</strong>: 위부터 캐고 맨 아래는 마지막.</li><li><strong>침대</strong>: 새 침대에 잔 뒤 옛 침대 제거.</li><li><strong>비상 쉘터</strong>: 3칸 아래+머리 막기·횃불.</li><li><strong>울타리 문</strong>: 좀비가 문으로 인식하지 않음.</li></ul>\`,
      },
`;

let out = src.slice(0, nightStart) + nightBlock + src.slice(cutAt);

const introOld = "초보자를 위한 가이드</a> 참고.</p>`,";
const introNew =
  "초보자 가이드</a>, <a href=\"https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%ED%95%98%EC%A7%80_%EB%A7%90%EC%95%84%EC%95%BC_%ED%95%A0%EA%B2%83\" target=\"_blank\" rel=\"noreferrer noopener\">하지 말 것</a>, <a href=\"https://ko.minecraft.wiki/w/%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC:%EA%B0%84%EB%8B%A8%ED%95%9C_%ED%8C%81%EA%B3%BC_%ED%8A%B8%EB%A6%AD\" target=\"_blank\" rel=\"noreferrer noopener\">팁과 트릭</a>.</p>`,";
if (out.includes(introOld)) out = out.replace(introOld, introNew);

fs.writeFileSync(dataPath, out);
console.log("Patched getting-started.");
