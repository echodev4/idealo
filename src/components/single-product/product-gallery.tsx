"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProduct } from "@/context/ProductContext";
import { useLanguage } from "@/contexts/language-context";

const ProductGallerySkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-2 gap-3 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-[4px] bg-muted" />
        ))}
      </div>
    </div>
  );
};

export default function ProductGallery() {
  const { product, loading } = useProduct();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);

  const images = product?.images || [];
  const title = product?.title || "";
  const safeImages = images?.length ? images : [];

  React.useEffect(() => {
    if (!safeImages.length) return;
    if (activeIndex > safeImages.length - 1) {
      setActiveIndex(0);
    }
  }, [safeImages.length, activeIndex]);

  if (loading) return <ProductGallerySkeleton />;

  if (!safeImages.length) {
    return (
      <div className="w-full aspect-square rounded-[4px] bg-muted flex items-center justify-center text-sm text-muted-foreground">
        {t("singleProduct.gallery.noImages", "No images available")}
      </div>
    );
  }

  const gridImages = Array.from({ length: 4 }).map((_, i) => safeImages[i] ?? safeImages[0]);

  const goToSlide = (idx: number) => {
    const bounded = Math.max(0, Math.min(idx, safeImages.length - 1));
    setActiveIndex(bounded);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX;

    touchStartX.current = null;
    if (startX == null || endX == null) return;

    const delta = endX - startX;
    const threshold = 40;

    if (Math.abs(delta) < threshold) return;

    if (delta < 0) {
      goToSlide(activeIndex + 1);
    } else {
      goToSlide(activeIndex - 1);
    }
  };

  return (
    <div className="w-full">
      <div className="lg:hidden">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          dir="ltr" className="overflow-hidden rounded-[4px] border border-[#e5e7eb] bg-[#f3f4f6]"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {safeImages.map((img: { src: string; alt?: string }, idx: number) => (
              <div key={`${img.src}-${idx}`} className="relative aspect-square w-full shrink-0">
                <Image
                  src={img.src}
                  alt={img.alt ?? title}
                  fill
                  sizes="95vw"
                  className="object-contain p-2.5"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {safeImages.length > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-2">
            {safeImages.map((_: { src: string; alt?: string }, idx: number) => (
              <button
                key={idx}
                type="button"
                aria-label={`${t("singleProduct.gallery.goToImage", "Go to image")} ${idx + 1}`}
                onClick={() => goToSlide(idx)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  idx === activeIndex ? "bg-[#f59e0b]" : "bg-[#d1d5db]"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="hidden lg:grid grid-cols-2 gap-3 lg:gap-6">
        {gridImages.map((img: { src: string; alt?: string }, idx: number) => {
          const selected = idx === activeIndex;
          return (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square rounded-[4px] border overflow-hidden bg-[#f3f4f6]",
                selected ? "border-[#1a73e8]" : "border-[#e5e7eb] hover:border-[#1a73e8]"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt ?? title}
                fill
                sizes="(min-width: 1024px) 120px, 45vw"
                className="object-contain p-2.5 lg:p-3"
                priority={idx === 0}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

