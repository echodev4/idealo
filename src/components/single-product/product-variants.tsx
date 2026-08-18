"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useProduct } from "@/context/ProductContext";
import { resolvePreferredProductImage } from "@/lib/products/imageFallback";
import { cn } from "@/lib/utils";
import FallbackImage from "@/components/common/fallback-image";

type VariantProduct = {
  _id?: string;
  product_url: string;
  source?: string;
  title: string;
  suggestedName?: string;
  modelName?: string;
  storage?: string;
  colour?: string;
  color?: string;
  currentPrice?: string;
  price?: string;
  images?: { src: string; alt?: string }[];
  image_url?: string;
  offerCount?: number;
  variantColor?: string;
  variantMemory?: string;
};

type VariantsResponse = {
  success?: boolean;
  isMobileProduct?: boolean;
  variants?: VariantProduct[];
  filters?: {
    colors?: string[];
    memories?: string[];
  };
};

function parsePrice(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function formatAED(value: number) {
  const hasDecimals = value % 1 !== 0;
  return `AED ${value.toLocaleString("en-US", {
    maximumFractionDigits: hasDecimals ? 2 : 0,
    minimumFractionDigits: hasDecimals ? 2 : 0,
  })}`;
}

function getVariantName(product: VariantProduct) {
  return product.suggestedName || product.title || "";
}

function getVariantImage(product: VariantProduct) {
  return resolvePreferredProductImage(product);
}

function getVariantHref(product: VariantProduct) {
  return `/product/${encodeURIComponent(product.product_url)}?product_name=${encodeURIComponent(
    getVariantName(product)
  )}&source=${encodeURIComponent(String(product.source || "").toLowerCase())}`;
}

function getVariantLabel(product: VariantProduct) {
  const memory = product.variantMemory || "";
  const color = product.variantColor || "";
  const label = [memory.replace(/\s+/g, ""), color].filter(Boolean).join(" ");
  return label || getVariantName(product);
}

const COLOR_SPEC_KEYS = [
  "colour name",
  "color name",
  "colour",
  "color",
  "colourname",
  "colorname",
];

const STORAGE_SPEC_KEYS = [
  "internal memory",
  "internal storage",
  "storage capacity",
  "storage size",
  "built-in storage",
  "builtin storage",
  "rom",
  "storage",
];

function normalizeSpecKey(value: unknown) {
  return String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function readSpecValue(specifications: unknown, candidates: string[]) {
  if (!specifications || typeof specifications !== "object" || Array.isArray(specifications)) return "";

  const entries = Object.entries(specifications as Record<string, unknown>)
    .map(([key, value]) => ({
      key: normalizeSpecKey(key),
      value: String(value ?? "").trim(),
    }))
    .filter((entry) => entry.key && entry.value);

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeSpecKey(candidate);
    const match = entries.find((entry) => entry.key.includes(normalizedCandidate));
    if (match) return match.value;
  }

  return "";
}

function isLikelyMobileProduct(product: any) {
  const directColor = String(product?.colour || product?.color || "").trim();
  const directStorage = String(product?.storage || "").trim();
  const productText = String(
    [
      product?.suggestedName,
      product?.title,
      product?.product_name,
      product?.modelName,
      product?.category,
      product?.main_category,
      product?.category_path_text,
    ]
      .filter(Boolean)
      .join(" ")
  ).toLowerCase();

  if (/\b(iphone|galaxy|samsung|mobile|smartphone|phone)\b/.test(productText)) {
    return true;
  }

  return Boolean(
    (directColor || readSpecValue(product?.specifications, COLOR_SPEC_KEYS)) &&
      (directStorage || readSpecValue(product?.specifications, STORAGE_SPEC_KEYS))
  );
}

type RtlScrollType = "negative" | "reverse" | "default";

let cachedRtlScrollType: RtlScrollType | null = null;

function getRtlScrollType(): RtlScrollType {
  if (cachedRtlScrollType) return cachedRtlScrollType;
  if (typeof document === "undefined") return "negative";

  const outer = document.createElement("div");
  const inner = document.createElement("div");

  outer.dir = "rtl";
  outer.style.width = "4px";
  outer.style.height = "1px";
  outer.style.overflow = "scroll";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";

  inner.style.width = "8px";
  inner.style.height = "1px";
  outer.appendChild(inner);
  document.body.appendChild(outer);

  outer.scrollLeft = 1;

  if (outer.scrollLeft === 0) {
    cachedRtlScrollType = "negative";
  } else {
    const initial = outer.scrollLeft;
    outer.scrollLeft = 0;
    cachedRtlScrollType = outer.scrollLeft === 0 ? "default" : initial > 0 ? "reverse" : "negative";
  }

  document.body.removeChild(outer);
  return cachedRtlScrollType;
}

function getNormalizedScrollLeft(el: HTMLDivElement) {
  const isRtl = getComputedStyle(el).direction === "rtl";
  if (!isRtl) return el.scrollLeft;

  const max = el.scrollWidth - el.clientWidth;
  const left = el.scrollLeft;
  const type = getRtlScrollType();

  if (type === "negative") return max + left;
  if (type === "reverse") return max - left;
  return left;
}

function getNativeScrollLeft(normalizedLeft: number, el: HTMLDivElement) {
  const isRtl = getComputedStyle(el).direction === "rtl";
  if (!isRtl) return normalizedLeft;

  const max = el.scrollWidth - el.clientWidth;
  const type = getRtlScrollType();

  if (type === "negative") return normalizedLeft - max;
  if (type === "reverse") return max - normalizedLeft;
  return normalizedLeft;
}

function useScrollState(ref: React.RefObject<HTMLDivElement | null>) {
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    const left = getNormalizedScrollLeft(el);

    setCanLeft(left > 2);
    setCanRight(left < max - 2);
  }, [ref]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    update();
    const resizeObserver = new ResizeObserver(update);
    el.addEventListener("scroll", update, { passive: true });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [ref, update]);

  const scrollBy = React.useCallback(
    (direction: "left" | "right") => {
      const el = ref.current;
      if (!el) return;

      const max = el.scrollWidth - el.clientWidth;
      const current = getNormalizedScrollLeft(el);
      const next = Math.max(0, Math.min(max, current + (direction === "left" ? -520 : 520)));

      el.scrollTo({
        left: getNativeScrollLeft(next, el),
        behavior: "smooth",
      });

      window.requestAnimationFrame(update);
    },
    [ref, update]
  );

  return { canLeft, canRight, scrollBy, update };
}

function FilterButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[4px] border px-3 py-1.5 text-[13px] leading-none transition-colors",
        selected
          ? "border-[#0b63c8] bg-[#e8f1ff] text-[#0b63c8]"
          : "border-[#c9cdd3] bg-white text-[#111827] hover:border-[#0b63c8]"
      )}
    >
      {label}
    </button>
  );
}

function ProductVariantsSkeleton() {
  return (
    <section className="mt-7 w-full lg:mt-8" aria-label="Loading product variants">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="h-4 w-40 animate-pulse rounded bg-[#e5e7eb]" />
        <div className="h-9 w-[150px] animate-pulse rounded-[4px] bg-[#e5e7eb]" />
      </div>
    </section>
  );
}

export default function ProductVariants() {
  const { product, loading } = useProduct();
  const [variants, setVariants] = React.useState<VariantProduct[]>([]);
  const [colors, setColors] = React.useState<string[]>([]);
  const [memories, setMemories] = React.useState<string[]>([]);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedMemories, setSelectedMemories] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [isApplicable, setIsApplicable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const { canLeft, canRight, scrollBy, update } = useScrollState(scrollerRef);

  React.useEffect(() => {
    if (loading || !product?.product_url) {
      setVariants([]);
      setIsApplicable(false);
      return;
    }

    const controller = new AbortController();

    async function fetchVariants() {
      try {
        setIsLoading(true);
        setVariants([]);
        setColors([]);
        setMemories([]);
        setIsApplicable(false);
        setSelectedColors([]);
        setSelectedMemories([]);
        setShowFilters(false);

        const res = await fetch("/api/product-variants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
          body: JSON.stringify({
            product_url: product.product_url,
            source: product.source || "",
            product_name: product.title || product.product_name || "",
          }),
        });

        const json: VariantsResponse = await res.json();
        if (!res.ok || json?.success === false || !json?.isMobileProduct) {
          setVariants([]);
          setColors([]);
          setMemories([]);
          setIsApplicable(false);
          return;
        }

        setVariants(Array.isArray(json.variants) ? json.variants : []);
        setColors(Array.isArray(json.filters?.colors) ? json.filters.colors : []);
        setMemories(Array.isArray(json.filters?.memories) ? json.filters.memories : []);
        setIsApplicable(true);
      } catch (error: any) {
        if (error?.name === "AbortError") return;
        console.error("Product variants fetch error:", error);
        setVariants([]);
        setColors([]);
        setMemories([]);
        setIsApplicable(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVariants();

    return () => controller.abort();
  }, [loading, product?.product_url, product?.source, product?.title, product?.product_name]);

  const filteredVariants = React.useMemo(() => {
    return variants.filter((variant) => {
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(String(variant.variantColor || ""));
      const matchesMemory =
        selectedMemories.length === 0 || selectedMemories.includes(String(variant.variantMemory || ""));

      return matchesColor && matchesMemory;
    });
  }, [variants, selectedColors, selectedMemories]);

  React.useEffect(() => {
    update();
  }, [filteredVariants.length, update]);

  if (!isApplicable) {
    return isLoading && isLikelyMobileProduct(product) ? <ProductVariantsSkeleton /> : null;
  }

  const cheapest = variants
    .map((variant) => parsePrice(variant.currentPrice ?? variant.price))
    .filter((value: number | null): value is number => value !== null)
    .sort((a, b) => a - b)[0];

  const toggleFilter = (
    value: string,
    selectedValues: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value]
    );
  };

  const toggleFiltersPanel = () => {
    setShowFilters((current) => {
      if (current) {
        setSelectedColors([]);
        setSelectedMemories([]);
      }
      return !current;
    });
  };

  return (
    <section className="mt-7 w-full lg:mt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="text-[14px] font-semibold text-[#111827]">
          {isLoading ? (
            <span className="inline-block h-4 w-36 animate-pulse rounded bg-[#e5e7eb]" />
          ) : (
            <>
              {variants.length} variants
              {cheapest ? (
                <>
                  {" "}
                  from <span className="text-[#ff6600]">{formatAED(cheapest)}</span>
                </>
              ) : null}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleFiltersPanel}
          className="inline-flex min-w-[150px] items-center justify-center gap-1 whitespace-nowrap rounded-[4px] border border-[#0b63c8] bg-white px-4 py-2 text-[13px] font-medium text-[#0b63c8] hover:bg-[#f4f8ff]"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters ? "rotate-180" : "")} />
          Show all variants
        </button>
      </div>

      {showFilters ? (
        <div className="mb-4 space-y-3">
          {colors.length ? (
            <div>
              <div className="mb-2 text-[13px] font-semibold text-[#111827]">Color:</div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <FilterButton
                    key={color}
                    label={color}
                    selected={selectedColors.includes(color)}
                    onClick={() => toggleFilter(color, selectedColors, setSelectedColors)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {memories.length ? (
            <div>
              <div className="mb-2 text-[13px] font-semibold text-[#111827]">Internal Memory:</div>
              <div className="flex flex-wrap gap-2">
                {memories.map((memory) => (
                  <FilterButton
                    key={memory}
                    label={memory}
                    selected={selectedMemories.includes(memory)}
                    onClick={() => toggleFilter(memory, selectedMemories, setSelectedMemories)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showFilters ? (
      <div className="group relative">
        {canLeft ? (
          <button
            type="button"
            aria-label="Scroll variants left"
            onClick={() => scrollBy("left")}
            className="absolute left-0 top-1/2 z-20 hidden h-12 w-10 -translate-y-1/2 items-center justify-center bg-[#8d949d]/85 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : null}

        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto pb-3 scroll-smooth overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[168px] w-[118px] shrink-0 animate-pulse rounded-[4px] border border-[#d5d9de] bg-white"
                >
                  <div className="h-[88px] rounded-t-[4px] bg-[#f0f1f3]" />
                  <div className="m-2 h-3 rounded bg-[#e5e7eb]" />
                  <div className="mx-2 h-3 w-16 rounded bg-[#e5e7eb]" />
                </div>
              ))
            : filteredVariants.map((variant) => {
                const isCurrent =
                  String(variant.product_url || "") === String(product?.product_url || "") &&
                  String(variant.source || "").toLowerCase() === String(product?.source || "").toLowerCase();
                const image = getVariantImage(variant);
                const name = getVariantName(variant);
                const price = parsePrice(variant.currentPrice ?? variant.price);

                return (
                  <Link
                    key={`${variant.product_url}-${variant.source || ""}`}
                    href={getVariantHref(variant)}
                    className={cn(
                      "relative flex h-[168px] w-[118px] shrink-0 flex-col overflow-hidden rounded-[4px] border bg-white text-left transition-colors hover:border-[#0b63c8]",
                      isCurrent ? "border-[#0b63c8]" : "border-[#d5d9de]"
                    )}
                  >
                    {isCurrent ? (
                      <span className="absolute left-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-br-[4px] bg-[#0b63c8] text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : null}

                    <div className="relative h-[88px] w-full bg-[#f3f4f6]">
                      <FallbackImage src={image} alt={name} fill sizes="118px" className="object-contain p-3" />
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col px-2 py-2">
                      <div className="line-clamp-2 text-[12px] font-semibold leading-[15px] text-[#111827]">
                        {getVariantLabel(variant)}
                      </div>
                      <div className="mt-auto text-[12px] leading-tight text-[#6b7280]">from</div>
                      {price ? (
                        <div className="text-[15px] font-semibold leading-tight text-[#ff6600]">
                          {formatAED(price)}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
        </div>

        {canRight ? (
          <button
            type="button"
            aria-label="Scroll variants right"
            onClick={() => scrollBy("right")}
            className="absolute right-0 top-1/2 z-20 hidden h-12 w-10 -translate-y-1/2 items-center justify-center bg-[#8d949d]/85 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : null}
      </div>
      ) : null}
    </section>
  );
}
