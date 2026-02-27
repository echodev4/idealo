"use client";

import * as React from "react";
import { Heart, Home } from "lucide-react";
import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";

function parseRating(v: any): number {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function parseReviewCount(v: any): string | null {
  if (!v) return null;
  return String(v);
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-[2px] leading-none">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <span
            key={i}
            className={cn("text-[14px] leading-none", filled ? "text-black" : "text-[#cbd5e1]")}
            aria-hidden
          >
            {isHalf ? "★" : "★"}
          </span>
        );
      })}
    </div>
  );
}

const ProductHeaderInfoSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="h-3 w-2/3 bg-muted rounded" />
      <div className="mt-3 h-7 w-4/5 bg-muted rounded" />
      <div className="mt-2 h-4 w-56 bg-muted rounded" />
      <div className="mt-3 h-4 w-full bg-muted rounded" />
      <div className="mt-2 h-4 w-[90%] bg-muted rounded" />
    </div>
  );
};

export default function ProductHeaderInfo() {
  const { product, loading, relatedProducts, relatedLoading } = useProduct();

  if (loading || relatedLoading) {
    return <ProductHeaderInfoSkeleton />;
  }

  const ratingValue = parseRating(relatedProducts?.[0]?.average_rating);
  const reviewsCount = parseReviewCount(relatedProducts?.[0]?.reviews);

  return (
    <div className="w-full">
      
      <div className="mt-2 lg:mt-0 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center h-8 px-4 rounded-full bg-[#fbbf24] text-[#111827] text-[13px] font-semibold cursor-not-allowed select-none">
            No variant selected.
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#d1d5db] bg-white text-[#1a73e8] cursor-not-allowed"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <h1 className="mt-3 text-[#111827] text-[26px] lg:text-[28px] font-semibold leading-[1.15]">
        {product?.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#111827]">
        <span className="text-[#374151]">10 product reviews:</span>
        <div className="flex items-center gap-2">
          <Stars value={ratingValue} />
          <span className="text-[#111827]">{reviewsCount ? `(${reviewsCount})` : "(—)"}</span>
        </div>
        <span className="text-[#6b7280]">2 test reports:</span>
        <span className="font-semibold">Average grade 2.0</span>
      </div>

      <div className="mt-3 text-[13px] leading-[1.55] text-[#111827]">
        <span className="font-semibold">Product overview:</span>
        <span className="ml-1 text-[#374151]">
          men&apos;s synthetic shoes · intended use: competition · neutral · drop: 6 mm · men&apos;s{" "}
          <a href="#specifications" className="text-[#1a73e8] hover:underline">
            product details
          </a>
        </span>
      </div>

      <div className="mt-2 text-[13px] leading-[1.55] text-[#111827]">
        <span className="font-semibold">Similar products:</span>{" "}
        <a href="#" onClick={(e) => e.preventDefault()} className="text-[#1a73e8] hover:underline cursor-not-allowed">
          {relatedProducts?.length ? `${relatedProducts.length.toLocaleString()} products` : "products"}
        </a>
      </div>
    </div>
  );
}