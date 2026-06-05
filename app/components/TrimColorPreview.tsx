"use client";

import { useEffect, useRef, useState } from "react";
import { trimSampleCandidates } from "@/lib/wiki-images";
import { applyTrimMaterialColor } from "@/lib/trim-recolor";

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

    const urls = trimSampleCandidates(trimId);
    const img = new Image();
    img.crossOrigin = "anonymous";

    let urlIdx = 0;
    const tryLoad = () => {
      if (urlIdx >= urls.length) {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
        return;
      }
      img.src = urls[urlIdx];
    };

    img.onload = () => {
      if (cancelled) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        applyTrimMaterialColor(imageData.data, materialColor);
        ctx.putImageData(imageData, 0, 0);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };

    img.onerror = () => {
      urlIdx += 1;
      tryLoad();
    };

    tryLoad();

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
