"use client";

import Link from "next/link";
import { SmartIcon } from "./SmartIcon";

/** ko.minecraft.wiki/w/작물 기준 작물 목록 */
const CROPS = [
  {
    id: "wheat_seeds",
    type: "item" as const,
    name: "밀 씨앗",
    desc: "밀 씨앗 블록을 키우는 것을 게임 내에서 \"작물\"이라고 부릅니다.",
    group: "씨앗",
  },
  {
    id: "wheat",
    type: "item" as const,
    name: "밀",
    desc: "밀 씨앗을 심어 완전히 자란 밀로부터 수확한 작물.",
    group: "수확물",
  },
  {
    id: "melon",
    type: "block" as const,
    name: "수박",
    desc: "수박씨를 심어 완전히 자란 수박으로부터 수확한 과일 작물.",
    group: "수확물",
  },
  {
    id: "pumpkin",
    type: "block" as const,
    name: "호박",
    desc: "호박씨를 심어 완전히 자란 호박으로부터 수확한 작물.",
    group: "수확물",
  },
  {
    id: "sugar_cane",
    type: "block" as const,
    name: "사탕수수",
    desc: "사탕수수로부터 수확한 작물. 설탕·종이 재료.",
    group: "수확물",
  },
  {
    id: "potato",
    type: "item" as const,
    name: "감자",
    desc: "감자 작물로부터 수확한 작물. 구워 먹거나 다시 심을 수 있습니다.",
    group: "수확물",
  },
  {
    id: "poisonous_potato",
    type: "item" as const,
    name: "독이 있는 감자",
    desc: "감자 수확 시 소량 드롭. 먹으면 중독 효과가 있습니다.",
    group: "수확물",
  },
  {
    id: "carrot",
    type: "item" as const,
    name: "당근",
    desc: "당근 작물로부터 수확한 작물. 금당근 제작·토끼 먹이.",
    group: "수확물",
  },
  {
    id: "cocoa_beans",
    type: "item" as const,
    name: "코코아 콩",
    desc: "정글의 코코아 식물로부터 수확한 작물. 쿠키·갈색 염료.",
    group: "수확물",
  },
  {
    id: "beetroot",
    type: "item" as const,
    name: "비트",
    desc: "사탕무(비트) 작물로부터 수확한 작물.",
    group: "수확물",
  },
  {
    id: "farmland",
    type: "block" as const,
    name: "경작지",
    desc: "작물을 심을 수 있는 블록. 흙·잔디 블록에 괭이를 사용해 만듭니다.",
    group: "재배 기반",
  },
  {
    id: "nether_wart",
    type: "item" as const,
    name: "네더 사마귀",
    desc: "영혼 모래에만 심을 수 있는 작물. 주로 양조에 사용됩니다.",
    group: "네더",
  },
] as const;

const GROUP_ORDER = ["씨앗", "수확물", "재배 기반", "네더"] as const;

export function CropGuideContent() {
  return (
    <div className="crop-guide">
      <p className="crop-intro text-[15px] leading-[1.7] mb-6">
        <strong>작물</strong>이란 재배용 식물 또는 곡물·채소·과일 등의 농업 산출물 그룹입니다.
        아래 목록은{" "}
        <a
          href="https://ko.minecraft.wiki/w/%EC%9E%91%EB%AC%BC"
          target="_blank"
          rel="noreferrer noopener"
          className="text-link dark:text-link-dark hover:underline"
        >
          ko.minecraft.wiki — 작물
        </a>
        을 기준으로 정리했습니다.
      </p>

      {GROUP_ORDER.map((group) => {
        const entries = CROPS.filter((c) => c.group === group);
        if (entries.length === 0) return null;
        return (
          <section key={group} className="mb-8">
            <h3 className="font-sans font-bold text-[1.1rem] mb-3 text-wiki-text dark:text-zinc-100">
              {group}
            </h3>
            <div className="ore-grid">
              {entries.map((crop) => (
                <Link
                  key={crop.id}
                  href={`/search/${crop.id}?type=${crop.type}`}
                  className="ore-card no-underline hover:border-brand-400/60 transition-colors"
                >
                  <div className="ore-card-icon">
                    <SmartIcon
                      textureId={crop.id}
                      emoji="🌾"
                      size="lg"
                      alt={crop.name}
                      framed
                    />
                  </div>
                  <div className="ore-card-body">
                    <p className="ore-card-title">{crop.name}</p>
                    <p className="text-[13px] text-wiki-muted dark:text-zinc-400 leading-relaxed">
                      {crop.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-[13px] text-wiki-muted dark:text-zinc-500 mt-6">
        관련 씨앗:{" "}
        <Link href="/search/melon_seeds?type=item" className="text-link dark:text-link-dark hover:underline">수박씨</Link>
        {" · "}
        <Link href="/search/pumpkin_seeds?type=item" className="text-link dark:text-link-dark hover:underline">호박씨</Link>
        {" · "}
        <Link href="/search/beetroot_seeds?type=item" className="text-link dark:text-link-dark hover:underline">비트 씨앗</Link>
        {" · "}
        <Link href="/category/blocks" className="text-link dark:text-link-dark hover:underline">블록 분류 → 식물</Link>
        {" · "}
        <Link href="/wiki/auto-farm" className="text-link dark:text-link-dark hover:underline">자동 농장 가이드</Link>
      </p>
    </div>
  );
}
