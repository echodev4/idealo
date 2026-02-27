"use client";

import * as React from "react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProduct } from "@/context/ProductContext";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductGallerySkeleton = () => {
  return (
    <div className="flex flex-col gap-4 items-center animate-pulse">
      {/* Main image skeleton */}
      <div className="relative w-full max-w-[420px] aspect-[10/11] bg-muted rounded-md" />

      {/* Thumbnails skeleton */}
      <div className="w-full max-w-[420px] flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[76px] h-[76px] bg-muted rounded-md"
          />
        ))}
      </div>
    </div>
  );
};




/* =========================
   Component
========================= */

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { product, loading } = useProduct();

  if (loading) {
    return (
      <div className="w-full relative">
        <ProductGallerySkeleton />
      </div>
    );
  }

  const images = product.images
  const title = product.title
  const safeImages = images?.length ? images : [];


  if (!safeImages.length) {
    return (
      <div className="w-full max-w-[420px] aspect-[10/11] bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Dialog>
        <div className="flex flex-col gap-4 items-center">
          {/* MAIN IMAGE */}
          <div className="relative w-full max-w-[420px] aspect-[10/11]">
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full h-full cursor-zoom-in group"
              >
                <Image
                  src={safeImages[activeIndex].src}
                  alt={safeImages[activeIndex].alt ?? title}
                  width={420}
                  height={462}
                  className="object-contain w-full h-full rounded-md bg-white p-6 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </button>
            </DialogTrigger>

          </div>

          {/* THUMBNAILS */}
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full max-w-[420px]"
          >
            <CarouselContent className="m-0">
              {safeImages.map((img: { alt: string, src: string }, index: number) => (
                <CarouselItem key={index} className="basis-[76px] p-1">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-full h-full aspect-square p-0.5 rounded-md transition-all border-2",
                      activeIndex === index
                        ? "border-[#0066cc]"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt ?? `${title} thumbnail ${index + 1}`}
                      width={76}
                      height={76}
                      className="w-full h-full object-contain bg-white rounded-sm"
                      loading="lazy"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 disabled:opacity-0 disabled:cursor-auto" />
            <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 disabled:opacity-0 disabled:cursor-auto" />
          </Carousel>
        </div>

        {/* FULLSCREEN VIEW */}
        <DialogContent className="bg-black/90 border-none p-4 max-w-none w-screen h-screen flex items-center justify-center">
          <Carousel
            opts={{ startIndex: activeIndex, loop: true }}
            className="w-full max-w-5xl"
          >
            <CarouselContent>
              {safeImages.map((img: { src: string, alt: string }, index: number) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={img.src}
                    alt={img.alt ?? `${title} fullscreen ${index + 1}`}
                    width={1000}
                    height={1000}
                    className="object-contain max-h-[90svh] w-auto"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-2 md:left-4 text-white bg-white/10 hover:bg-white/20 border-white/50" />
            <CarouselNext className="absolute right-2 md:right-4 text-white bg-white/10 hover:bg-white/20 border-white/50" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}

