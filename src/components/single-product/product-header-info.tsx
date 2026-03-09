"use client";

import * as React from "react";
import Image from "next/image";
import { useProduct } from "@/context/ProductContext";
import { useLanguage } from "@/contexts/language-context";
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
  const { t } = useLanguage();

  if (loading || relatedLoading) return <ProductHeaderInfoSkeleton />;

  const ratingValue = parseRating(relatedProducts?.[0]?.average_rating);
  const reviewsCount = relatedProducts?.[0]?.reviews ? String(relatedProducts[0].reviews) : null;

  const specifications = (product?.specifications || {}) as Record<string, string>;
  const normalizedSpecs = Object.entries(specifications)
    .map(([key, value]) => {
      const k = String(key ?? "").trim();
      const v = String(value ?? "").trim();
      return [k, v] as const;
    })
    .filter(([k, v]) => k.length > 0 && v.length > 0);

  const specs = normalizedSpecs.slice(0, 7);
  const mobileSpecs = normalizedSpecs.slice(0, 3);

  return (
    <div className="w-full">
      <h1 className="lg:hidden mt-3 text-[#111827] text-[28px] font-semibold leading-[1.1]">
        {product?.title}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#111827] lg:justify-start">
        <span className="text-[#374151]">{t("singleProduct.headerInfo.reviewsLabel", "10 product reviews:")}</span>
        <div className="flex items-center gap-2">
          <Stars value={ratingValue} />
          <span className="text-[#111827]">{reviewsCount ? `(${reviewsCount})` : t("singleProduct.headerInfo.reviewsEmpty", "(—)")}</span>
        </div>
        <span className="text-[#6b7280]">{t("singleProduct.headerInfo.testReportsLabel", "2 test reports:")}</span>
      </div>

      <div className="mt-1 text-[13px] font-semibold text-[#111827]">{t("singleProduct.headerInfo.averageGrade", "Average grade 2.0")}</div>

      {mobileSpecs.length ? (
        <div className="lg:hidden mt-3 grid grid-cols-3 gap-2">
          {mobileSpecs.map(([label, value], idx) => (
            <div key={`${label}-${idx}`} className="overflow-hidden rounded-[10px] border border-[#2d7fd9]">
              <div className="bg-[#63b3ff] px-2 py-1.5 text-[12px] font-semibold leading-tight text-[#0f172a] truncate" title={value}>
                {value}
              </div>
              <div className="bg-[#1f2937] px-2 py-1 text-[11px] leading-tight text-white/95 truncate" title={label}>
                {label}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 text-[13px] leading-[1.55] text-[#111827]">
        <div className="flex items-start gap-3">
          {specs.length ? (
            <div className="pt-[2px] flex-shrink-0">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8d3a1cc2-409a-47cb-abb2-a933b24d9e94-idealo-de/assets/svgs/A-Right-WithAGScale-2.svg?"
                alt={t("singleProduct.headerInfo.energyClassAlt", "Energy efficiency class")}
                width={39}
                height={28}
                unoptimized
              />
            </div>
          ) : null}

          <div className="min-w-0">
            <span className="font-semibold">{t("singleProduct.headerInfo.productOverview", "Product overview:")}</span>{" "}
            {specs.length ? (
              <span className="text-[#374151]">
                {specs.map(([k, v], idx) => (
                  <span key={k}>
                    {k}: {v}
                    {idx < specs.length - 1 ? <span className="text-[#9ca3af]"> · </span> : null}
                  </span>
                ))}{" "}
                <a href="#specifications" className="text-[#1a73e8] hover:underline whitespace-nowrap">
                  {t("singleProduct.headerInfo.productDetailsLink", "product details")}
                </a>
              </span>
            ) : (
              <span className="text-[#374151]">
                <a href="#specifications" className="text-[#1a73e8] hover:underline whitespace-nowrap">
                  {t("singleProduct.headerInfo.productDetailsLink", "product details")}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-[13px] leading-[1.55] text-[#111827]">
        <span className="font-semibold">{t("singleProduct.headerInfo.similarProducts", "Similar products:")}</span>{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-[#1a73e8] hover:underline cursor-not-allowed"
        >
          {relatedProducts?.length
            ? `${relatedProducts.length} ${t("singleProduct.headerInfo.productsCount", "products")}`
            : t("singleProduct.headerInfo.productsCount", "products")}
        </a>
      </div>
    </div>
  );
}
