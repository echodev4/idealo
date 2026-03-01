"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, FileText, LineChart, Bell } from "lucide-react";
import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";

function parseRating(v: any): number {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-[2px] leading-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn("text-[14px] leading-none", i < rounded ? "text-black" : "text-[#cbd5e1]")}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

const ProductHeaderInfoSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="h-8 w-3/4 bg-muted rounded" />
      <div className="mt-3 h-4 w-2/3 bg-muted rounded" />
      <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
      <div className="mt-4 h-4 w-full bg-muted rounded" />
      <div className="mt-2 h-4 w-[92%] bg-muted rounded" />
    </div>
  );
};

export default function ProductHeaderInfo() {
  const { product, loading, relatedProducts, relatedLoading } = useProduct();

  if (loading || relatedLoading) return <ProductHeaderInfoSkeleton />;

  const ratingValue = parseRating(relatedProducts?.[0]?.average_rating);
  const reviewsCount = relatedProducts?.[0]?.reviews ? String(relatedProducts[0].reviews) : null;

  const specs = Object.entries((product?.specifications || {}) as Record<string, string>).slice(0, 7);

  return (
    <div className="w-full">

      <h1 className="lg:hidden mt-3 text-[#111827] text-[28px] font-semibold leading-[1.1]">
        {product?.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#111827] lg:justify-start">
        <span className="text-[#374151]">10 product reviews:</span>
        <div className="flex items-center gap-2">
          <Stars value={ratingValue} />
          <span className="text-[#111827]">{reviewsCount ? `(${reviewsCount})` : "(—)"}</span>
        </div>
        <span className="text-[#6b7280]">2 test reports:</span>
      </div>

      <div className="mt-1 text-[13px] font-semibold text-[#111827]">Average grade 2.0</div>

      <div className="lg:hidden mt-4 border-t border-[#e5e7eb]">
        <div className="grid grid-cols-3">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-2 py-4 text-[12px] text-[#111827] cursor-not-allowed"
          >
            <FileText className="w-5 h-5 text-[#111827]" />
            Product details
          </button>

          <div className="w-px bg-[#e5e7eb]" />

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-2 py-4 text-[12px] text-[#111827] cursor-not-allowed"
          >
            <LineChart className="w-5 h-5 text-[#111827]" />
            Price history
          </button>

          <div className="w-px bg-[#e5e7eb]" />

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-2 py-4 text-[12px] text-[#111827] cursor-not-allowed"
          >
            <Bell className="w-5 h-5 text-[#111827]" />
            Price alert
          </button>
        </div>
      </div>

      <div className="mt-4 text-[13px] leading-[1.55] text-[#111827]">
        <div className="flex items-start gap-3">
          {specs.length ? (
            <div className="pt-[2px] flex-shrink-0">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8d3a1cc2-409a-47cb-abb2-a933b24d9e94-idealo-de/assets/svgs/A-Right-WithAGScale-2.svg?"
                alt="Energy efficiency class"
                width={39}
                height={28}
                unoptimized
              />
            </div>
          ) : null}

          <div className="min-w-0">
            <span className="font-semibold">Product overview:</span>{" "}
            {specs.length ? (
              <span className="text-[#374151]">
                {specs.map(([k, v], idx) => (
                  <span key={k}>
                    {k}: {v}
                    {idx < specs.length - 1 ? <span className="text-[#9ca3af]"> · </span> : null}
                  </span>
                ))}{" "}
                <a href="#specifications" className="text-[#1a73e8] hover:underline whitespace-nowrap">
                  product details
                </a>
              </span>
            ) : (
              <span className="text-[#374151]">
                <a href="#specifications" className="text-[#1a73e8] hover:underline whitespace-nowrap">
                  product details
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-[13px] leading-[1.55] text-[#111827]">
        <span className="font-semibold">Similar products:</span>{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-[#1a73e8] hover:underline cursor-not-allowed"
        >
          {relatedProducts?.length ? `${relatedProducts.length} products` : "products"}
        </a>
      </div>
    </div>
  );
}