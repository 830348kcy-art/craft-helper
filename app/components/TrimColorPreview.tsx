"use client";

import { useEffect, useRef, useState } from "react";
import { trimSampleCandidates, trimBaseArmorUrl } from "@/lib/wiki-images";
import {
  applyTrimCompositePreview,
  applyTrimMaterialColor,
  detectTrimRenderMode,
} from "@/lib/trim-recolor";

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(url));
    img.src = url;
  });
}

async function loadFirst(urls: string[]): Promise<HTMLImageElement> {
  let lastErr: Error | undefined;
  for (const url of urls) {
    try {
      return await loadImage(url);
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastErr ?? new Error("load failed");
}

export function TrimColorPreview({
  trimId,
  materialColor,
  alt,
  className = "",
  maxHeight = 320,
}: {
  trimId: string;
  materialColor: string;
  alt: string;
  className?: string;
  maxHeight?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError(false);

    (async () => {
      try {
        const [trimImg, baseImg] = await Promise.all([
          loadFirst(trimSampleCandidates(trimId)),
          loadImage(trimBaseArmorUrl()),
        ]);
        if (cancelled) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = trimImg.naturalWidth;
        const h = trimImg.naturalHeight;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(trimImg, 0, 0);
        const trimData = ctx.getImageData(0, 0, w, h);

        const baseCanvas = document.createElement("canvas");
        baseCanvas.width = baseImg.naturalWidth;
        baseCanvas.height = baseImg.naturalHeight;
        const baseCtx = baseCanvas.getContext("2d");
        if (!baseCtx) return;
        baseCtx.drawImage(baseImg, 0, 0);
        const baseData = baseCtx.getImageData(
          0,
          0,
          baseImg.naturalWidth,
          baseImg.naturalHeight
        );

        const mode = detectTrimRenderMode(
          trimData.data,
          w,
          h,
          baseData.data,
          baseImg.naturalWidth,
          baseImg.naturalHeight
        );

        if (mode === "composite") {
          const out = new ImageData(w, h);
          applyTrimCompositePreview(
            out.data,
            trimData.data,
            w,
            h,
            baseData.data,
            baseImg.naturalWidth,
            baseImg.naturalHeight,
            materialColor
          );
          ctx.putImageData(out, 0, 0);
        } else {
          applyTrimMaterialColor(trimData.data, materialColor);
          ctx.putImageData(trimData, 0, 0);
        }

        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trimId, materialColor]);

  if (error) {
    return (
      <p className="text-[13px] text-wiki-muted text-center py-8">
        미리보기를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center text-[12px] text-wiki-muted"
          aria-hidden
        >
          색상 적용 중…
        </div>
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className={`max-w-full object-contain transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        style={{ maxHeight, imageRendering: "auto" }}
      />
    </div>
  );
}
