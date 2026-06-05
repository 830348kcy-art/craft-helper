"use client";
import { useState, useMemo } from "react";
import { getTextureCandidates } from "@/lib/textures";

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
 * 마인크래ft 텍스처를 픽셀아트로 렌더.
 * textureId 또는 image URL이 실패하면 CDN 후보를 순차 시도, 모두 실패 시 이모지.
 */
export function SmartIcon({
  image,
  images,
  textureId,
  emoji,
  alt,
  size = "md",
  framed = false,
  className = "",
}: {
  image?: string;
  /** 여러 URL 순차 폴백 */
  images?: string[];
  /** 카탈로그 ID — 다중 CDN 폴백에 사용 */
  textureId?: string;
  emoji: string;
  alt?: string;
  size?: Size;
  framed?: boolean;
  className?: string;
}) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();
    const add = (url?: string) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      list.push(url);
    };
    if (textureId) {
      for (const u of getTextureCandidates(textureId)) add(u);
    }
    if (images) for (const u of images) add(u);
    add(image);
    return list;
  }, [textureId, image, images]);

  const [idx, setIdx] = useState(0);
  const px = SIZE_PX[size];
  const src = candidates[idx];
  const showImage = src && idx < candidates.length;

  const inner = showImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? emoji}
      width={px}
      height={px}
      loading="lazy"
      onError={() => {
        if (idx + 1 < candidates.length) setIdx((i) => i + 1);
      }}
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
