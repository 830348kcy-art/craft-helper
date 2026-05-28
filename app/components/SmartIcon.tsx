"use client";
import { useState } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

const SIZE_PX: Record<Size, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
  hero: 128,
};
const SIZE_TEXT: Record<Size, string> = {
  xs: "text-base",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
  hero: "text-7xl",
};

/**
 * 마인크래프트 텍스처를 픽셀아트로 렌더. 404면 이모지로 폴백.
 */
export function SmartIcon({
  image,
  emoji,
  alt,
  size = "md",
  framed = false,
  className = "",
}: {
  image?: string;
  emoji: string;
  alt?: string;
  size?: Size;
  /** 회색 인벤토리 슬롯 스타일 배경을 둠 */
  framed?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const px = SIZE_PX[size];
  const showImage = image && !failed;

  const inner = showImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt={alt ?? emoji}
      width={px}
      height={px}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ imageRendering: "pixelated" }}
      className="object-contain w-full h-full"
      draggable={false}
    />
  ) : (
    <span className={`${SIZE_TEXT[size]} leading-none select-none`} aria-label={alt}>
      {emoji}
    </span>
  );

  if (framed) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 rounded-md border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-1.5 ${className}`}
        style={{ width: px + 12, height: px + 12 }}
      >
        <span className="inline-flex items-center justify-center" style={{ width: px, height: px }}>
          {inner}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      {inner}
    </span>
  );
}
