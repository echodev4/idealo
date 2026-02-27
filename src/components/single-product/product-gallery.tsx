"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProduct } from "@/context/ProductContext";

const ProductGallerySkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded bg-muted" />
        ))}
      </div>
    </div>
  );
};

export default function ProductGallery() {
  const { product, loading } = useProduct();
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (loading) {
    return <ProductGallerySkeleton />;
  }

  const images = product?.images || [];
  const title = product?.title || "";
  const safeImages = images?.length ? images : [];

  if (!safeImages.length) {
    return (
      <div className="w-full aspect-square rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
        No images available
      </div>
    );
  }

  const gridImages = Array.from({ length: 4 }).map((_, i) => safeImages[i] ?? safeImages[0]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
        {gridImages.map((img: { src: string; alt?: string }, idx: number) => {
          const selected = idx === activeIndex;
          return (
            <button
              key={`${img.src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square rounded border overflow-hidden bg-[#f3f4f6]",
                selected ? "border-[#1a73e8] ring-1 ring-[#1a73e8]" : "border-[#e5e7eb] hover:border-[#cbd5e1]"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt ?? title}
                fill
                sizes="(min-width: 1024px) 170px, 45vw"
                className="object-contain p-4"
                priority={idx === 0}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}