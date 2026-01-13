"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/context/ProductContext";

const ProductHeaderInfoSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Title + Heart */}
      <div className="flex items-start justify-between gap-4">
        <div className="h-8 w-3/4 bg-muted rounded" />
        <div className="w-10 h-10 bg-muted rounded-full" />
      </div>

      {/* Offers line */}
      <div className="mt-2 h-4 w-48 bg-muted rounded" />

      {/* Energy label */}
      <div className="my-4 h-7 w-10 bg-muted rounded" />

      {/* Product overview */}
      <div className="mt-2 space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-[90%] bg-muted rounded" />
      </div>

      {/* Similar products */}
      <div className="mt-4">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-20 bg-muted rounded-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
};


/* =========================
   Helpers
========================= */

function parseAEDPrice(price: string): number | null {
  if (!price) return null;
  const numeric = price.replace(/[^\d.]/g, "");
  const value = Number(numeric);
  return isNaN(value) ? null : value;
}

function shortenTitle(title: string, words = 5): string {
  const split = title.split(" ");
  if (split.length <= words) return title;
  return split.slice(0, words).join(" ") + " ...";
}

/* =========================
   Component
========================= */

const ProductHeaderInfo = () => {

  const { relatedProducts, relatedLoading, product, loading } = useProduct();

  if (loading || relatedLoading) {
    return <ProductHeaderInfoSkeleton />;
  }


  /* -------- Offers & Prices -------- */
  const prices = relatedProducts
    .map((p) => parseAEDPrice(p.price))
    .filter((p): p is number => p !== null);

  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  /* -------- Overview specs (first 4, key + value) -------- */
  const specs = Object.entries(product.specifications || {}) as [string, string][];
  const visibleSpecs = specs.slice(0, 4);

  /* -------- Similar relatedProducts -------- */
  const similarProducts = relatedProducts
    .filter(
      (p) =>
        p.product_name &&
        p.product_name.length < product.title.length
    )
    .slice(0, 5)
    .map((p) => ({
      fullName: p.product_name,
      shortName: shortenTitle(p.product_name, 5),
      href: p.product_url,
    }));

  return (
    <div className="w-full">
      {/* TITLE */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-text-primary text-[28px] font-bold leading-[1.2]">
          {product.title}
        </h1>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full flex-shrink-0 w-10 h-10 border-border bg-transparent hover:bg-secondary"
        >
          <Heart className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      {/* OFFERS */}
      {minPrice !== null && maxPrice !== null && (
        <div className="mt-2">
          <span className="text-brand-blue-light text-sm">
            {relatedProducts.length} Offers: AED {minPrice.toLocaleString()} – AED{" "}
            {maxPrice.toLocaleString()}
          </span>
        </div>
      )}

      {/* ENERGY LABEL */}
      {
        visibleSpecs?.length ?
          <a href="#" className="block my-4">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/8d3a1cc2-409a-47cb-abb2-a933b24d9e94-idealo-de/assets/svgs/A-Right-WithAGScale-2.svg?"
              alt="Energy efficiency class"
              width={39}
              height={28}
              unoptimized
            />
          </a> : null
      }

      {/* PRODUCT OVERVIEW */}
      {
        visibleSpecs.length ?
          <div className="text-sm leading-relaxed text-text-primary">
            <span className="font-bold">Product overview:</span>
            <span className="ml-1">
              {visibleSpecs.map(([key, value], index) => (
                <span key={key}>
                  <span className="font-medium">{key}:</span> {value}
                  {index < specs.length - 1 && (
                    <span className="text-muted-foreground mx-1.5"> • </span>
                  )}
                </span>
              ))}
              <a
                href="#specifications"
                className="text-brand-blue-light hover:underline ml-1.5 whitespace-nowrap"
              >
                Product details
              </a>
            </span>
          </div> : null
      }

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-bold text-text-primary">
            Similar products:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {similarProducts.map((product) => (
              <p
                key={product.fullName}
                title={product.fullName}
                className="bg-secondary text-brand-blue-light cursor-pointer text-[13px] rounded-sm px-2 py-1"
                onClick={() => window.open(product.href, "__blank")}
              >
                {product.shortName}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductHeaderInfo;

