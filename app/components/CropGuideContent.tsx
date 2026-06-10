"use client";

import Link from "next/link";
import { WIKI_CROP_ENTRIES } from "@/lib/crop-catalog";
import { SmartIcon } from "./SmartIcon";

const CROP_DESC: Record<string, string> = {
  wheat_seeds: "밀 씨앗 블록을 키우는 것을 게임 내에서 \"작물\"이라고 부릅니다.",
  wheat: "밀 씨앗을 심어 완전히 자란 밀로부터 수확한 작물.",
  melon: "수박씨를 심어 완전히 자란 수박으로부터 수확한 과일 작물.",
  melon_slice: "수박을 캐면 나오는 과일 조각.",
  pumpkin: "호박씨를 심어 완전히 자란 호박으로부터 수확한 작물.",
  sugar_cane: "사탕수수로부터 수확한 작물. 설탕·종이 재료.",
  potato: "감자 작물로부터 수확한 작물.",
  poisonous_potato: "감자 수확 시 소량 드롭. 먹으면 중독 효과.",
  carrot: "당근 작물로부터 수확한 작물.",
  cocoa_beans: "정글의 코코아 식물로부터 수확한 작물.",
  beetroot: "사탕무(비트) 작물로부터 수확한 작물.",
  farmland: "작물을 심을 수 있는 블록. 흙·잔디 블록에 괭이 사용.",
  nether_wart: "영혼 모래에만 심을 수 있는 작물. 주로 양조에 사용.",
  carrots: "자라고 있는 당근 작물 블록.",
  potatoes: "자라고 있는 감자 작물 블록.",
  beetroots: "자라고 있는 비트 작물 블록.",
  melon_seeds: "수박을 재배할 때 심는 씨앗.",
  pumpkin_seeds: "호박을 재배할 때 심는 씨앗.",
  beetroot_seeds: "비트를 재배할 때 심는 씨앗.",
};

const CROP_LABEL: Record<string, string> = {
  wheat_seeds: "밀 씨앗",
  wheat: "밀",
  melon: "수박",
  melon_slice: "수박 조각",
  pumpkin: "호박",
  sugar_cane: "사탕수수",
  potato: "감자",
  poisonous_potato: "독이 있는 감자",
  carrot: "당근",
  cocoa_beans: "코코아 콩",
  beetroot: "비트",
  farmland: "경작지",
  nether_wart: "네더 사마귀",
  carrots: "당근 작물",
  potatoes: "감자 작물",
  beetroots: "비트 작물",
  melon_seeds: "수박씨",
  pumpkin_seeds: "호박씨",
  beetroot_seeds: "비트 씨앗",
};

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

      <div className="ore-grid">
        {WIKI_CROP_ENTRIES.map(({ id, type }) => {
          const label = CROP_LABEL[id] ?? id.replace(/_/g, " ");
          const desc = CROP_DESC[id] ?? "";
          return (
            <Link
              key={`${type}-${id}`}
              href={`/search/${id}?type=${type}`}
              className="ore-card no-underline hover:border-brand-400/60 transition-colors"
            >
              <div className="ore-card-icon">
                <SmartIcon textureId={id} emoji="🌾" size="lg" alt={label} framed />
              </div>
              <div className="ore-card-body">
                <p className="ore-card-title">{label}</p>
                {desc && (
                  <p className="text-[13px] text-wiki-muted dark:text-zinc-400 leading-relaxed">{desc}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-[13px] text-wiki-muted dark:text-zinc-500 mt-6">
        <Link href="/category/blocks" className="text-link dark:text-link-dark hover:underline">블록 분류 → 식물</Link>
        {" · "}
        <Link href="/wiki/auto-farm" className="text-link dark:text-link-dark hover:underline">자동 농장 가이드</Link>
      </p>
    </div>
  );
}
