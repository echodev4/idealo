"use client";

import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";

function parseRating(v: any): number {
  const n = Number(String(v ?? "").replace(/[^\d.]/g, ""));
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function parsePrice(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatAED(value: number) {
  const hasDecimals = value % 1 !== 0;
  return `AED ${value.toLocaleString("en-US", {
    maximumFractionDigits: hasDecimals ? 2 : 0,
    minimumFractionDigits: hasDecimals ? 2 : 0,
  })}`;
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
          &#9733;
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
  const { product, loading, offers, offersLoading, relatedProducts, relatedLoading } = useProduct();

  if (loading || relatedLoading) return <ProductHeaderInfoSkeleton />;

  const ratingValue = parseRating(
    product?.rating ?? product?.average_rating ?? relatedProducts?.[0]?.average_rating
  );

  const reviewsCount =
    product?.ratingCount !== undefined && product?.ratingCount !== null && String(product.ratingCount).trim() !== ""
      ? String(product.ratingCount)
      : product?.reviews !== undefined && product?.reviews !== null && String(product.reviews).trim() !== ""
        ? String(product.reviews)
        : relatedProducts?.[0]?.reviews
          ? String(relatedProducts[0].reviews)
          : null;

  const offerPrices = ((offers || []).length ? offers : product ? [product] : [])
    .map((item: any) => parsePrice(item?.price ?? item?.currentPrice))
    .filter((value: number | null): value is number => value !== null);
  const currentPrice = offerPrices.length
    ? Math.min(...offerPrices)
    : parsePrice(product?.currentPrice ?? product?.price);

  const specifications = (product?.specifications || {}) as Record<string, string>;
  const normalizedSpecs = Object.entries(specifications)
    .map(([key, value]) => {
      const k = String(key ?? "").trim();
      const v = String(value ?? "").trim();
      return [k, v] as const;
    })
    .filter(([k, v]) => k.length > 0 && v.length > 0);

  function findSpecByCandidates(
    entries: readonly (readonly [string, string])[],
    candidates: string[]
  ): readonly [string, string] | null {
    const normalized = entries.map(([k, v]) => [k, v, String(k ?? "").toLowerCase().replace(/\s+/g, " ").trim()] as const);
    for (const cand of candidates) {
      for (const [k, v, low] of normalized) {
        if (low.includes(cand)) return [k, v];
      }
    }
    return null;
  }

  const colorSpec = findSpecByCandidates(normalizedSpecs, [
    "colour name",
    "color name",
    "colour",
    "color",
    "colourname",
    "colorname",
  ]);
  const storageSpec = findSpecByCandidates(normalizedSpecs, [
    "internal memory",
    "internal storage",
    "storage capacity",
    "storage size",
    "built-in storage",
    "builtin storage",
    "rom",
    "storage",
  ]);

  const mobileSpecs: Array<readonly [string, string]> = [];
  if (colorSpec) mobileSpecs.push(["Color", colorSpec[1]]);
  if (storageSpec) mobileSpecs.push(["Internal Memory", storageSpec[1]]);

  return (
    <div className="w-full">
      <h1 className="mt-3 text-[#111827] text-[28px] font-semibold leading-[1.1]">
        {product?.title}
      </h1>

      {(currentPrice || ratingValue > 0) ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[#111827]">
          {currentPrice ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[13px] font-semibold leading-none text-[#4b5563]">from</span>
              <span className="text-[24px] font-bold leading-none text-[#ff6600]">
                {formatAED(currentPrice)}
              </span>
              {product?.livePriceLoading || offersLoading ? (
                <span
                  aria-label="Refreshing product data"
                  className="inline-block h-3 w-10 animate-pulse rounded bg-[#e5e7eb] align-middle"
                />
              ) : null}
            </div>
          ) : null}

          {ratingValue > 0 ? (
            <div className="flex items-center gap-2 text-[13px]">
              <Stars value={ratingValue} />
              <span className="font-semibold">{ratingValue.toFixed(1)}</span>
              {reviewsCount ? (
                <span className="text-[#6b7280]">({reviewsCount} ratings)</span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

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
    </div>
  );
}


