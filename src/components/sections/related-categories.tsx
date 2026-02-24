"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Product = {
  _id: string;
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
};

const categories = [
  {
    title: "Ski jackets",
    slug: "ski-jackets",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/the-north-face-boys-reversible-perrito-hooded-jack-19.jpg",
  },
  {
    title: "Functional underwear",
    slug: "functional-underwear",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/XL_NEWandXXL_NEW_544_767be007-308d-4fdc-a491-014d8-28.jpg",
  },
  {
    title: "Alpine skiing",
    slug: "alpine-skiing",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/mittelgross-4.jpg",
  },
];

const promoImage =
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/XL_NEWandXXL_NEW_544_767be007-308d-4fdc-a491-014d8-28.jpg";

function useHorizontalScroll(ref: React.RefObject<HTMLDivElement>) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < max - 2);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;

    const onScroll = () => update();
    const onResize = () => update();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ref]);

  const scrollBy = (dx: number) => {
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  return { canLeft, canRight, scrollBy };
}

export default function RelatedCategories({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  const bestsellers = useMemo(() => (products || []).slice(0, 15), [products]);
  const matching = useMemo(() => {
    const arr = products || [];
    return arr.slice(Math.max(0, arr.length - 3));
  }, [products]);

  const scrollerRef = useRef<HTMLDivElement | any>(null);
  const { canLeft, canRight, scrollBy } = useHorizontalScroll(scrollerRef);

  return (
    <section className="bg-white py-8">
      <div className="container max-w-[1280px] mx-auto px-3 lg:px-0">
        <h2 className="text-[20px] font-bold text-[#212121] mb-4">
          Discover the bestsellers
        </h2>

        <div className="relative">
          {canLeft && (
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-420)}
              className="hidden md:flex absolute left-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#DEE2E6] rounded-full shadow-md items-center justify-center z-20 hover:bg-[#F1F3F5]"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {canRight && (
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(420)}
              className="hidden md:flex absolute right-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#DEE2E6] rounded-full shadow-md items-center justify-center z-20 hover:bg-[#F1F3F5]"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[220px] bg-white border border-[#E0E0E0] rounded-[4px] p-3 animate-pulse"
                >
                  <div className="w-full h-[170px] bg-[#F1F3F5] rounded mb-3" />
                  <div className="h-4 w-24 bg-[#E9ECEF] rounded mb-2" />
                  <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                  <div className="h-4 w-3/4 bg-[#E9ECEF] rounded mb-4" />
                  <div className="h-5 w-24 bg-[#E9ECEF] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={scrollerRef}
              className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar scroll-smooth touch-pan-x overscroll-x-contain"
            >
              {bestsellers.map((p) => {
                const encodedUrl = encodeURIComponent(p.product_url);

                return (
                  <Link
                    key={p._id ?? p.product_url}
                    href={`/product/${encodedUrl}?product_name=${encodeURIComponent(
                      p.product_name
                    )}&source=${encodeURIComponent(p.source)}`}
                    className="flex-none w-[220px] bg-white border border-[#E0E0E0] rounded-[4px] p-3 relative no-underline hover:no-underline"
                  >
                    <button
                      type="button"
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center text-[#0474BA]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Heart size={20} strokeWidth={2} />
                    </button>

                    <div className="relative w-full h-[170px] mb-2">
                      <Image
                        src={p.image_url}
                        alt={p.product_name}
                        fill
                        sizes="220px"
                        className="object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#0066C0] text-white text-[12px] font-bold px-2 py-0.5 rounded-[2px] lowercase">
                        bestseller
                      </span>
                      <span className="text-[#666666] text-[13px] truncate">
                        in {p.source}
                      </span>
                    </div>

                    <div className="text-[#212121] text-[15px] font-bold leading-[1.2] line-clamp-2 mb-3">
                      {p.product_name}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px] text-[#666666]">from</span>
                        <span className="text-[18px] font-bold text-[#FF6600]">
                          {p.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="block xl:hidden mt-6">
          <div className="bg-white border border-[#E0E0E0] rounded-[4px] overflow-hidden">
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={promoImage}
                alt="Promo"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute left-6 bottom-6">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-white text-white font-bold text-[14px] rounded-sm cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  Discover now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
          <div className="xl:col-span-8">
            <h2 className="text-[20px] font-bold text-[#212121] mb-4">
              Related categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${encodeURIComponent(cat.slug)}`}
                  className="bg-white border border-[#E0E0E0] rounded-[4px] p-3 flex items-center justify-between no-underline hover:no-underline"
                >
                  <span className="text-[14px] font-semibold text-[#212121] truncate pr-2">
                    {cat.title}
                  </span>
                  <div className="w-[60px] h-[60px] relative flex-shrink-0">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="60px"
                      className="object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="text-[20px] font-bold text-[#212121] mb-4">
              Matching products
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#E0E0E0] rounded-[4px] p-3 animate-pulse"
                  >
                    <div className="w-full h-[220px] bg-[#F1F3F5] rounded mb-3" />
                    <div className="h-3 w-24 bg-[#E9ECEF] rounded mb-2" />
                    <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                    <div className="h-5 w-24 bg-[#E9ECEF] rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {matching.map((p) => {
                  const encodedUrl = encodeURIComponent(p.product_url);

                  return (
                    <div
                      key={p._id ?? p.product_url}
                      className="bg-white border border-[#E0E0E0] rounded-[4px] p-3 relative"
                    >
                      <button
                        type="button"
                        aria-label="Wishlist"
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center text-[#666666]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Heart size={18} />
                      </button>

                      <Link
                        href={`/product/${encodedUrl}?product_name=${encodeURIComponent(
                          p.product_name
                        )}&source=${encodeURIComponent(p.source)}`}
                        className="no-underline hover:no-underline block"
                      >
                        <div className="relative w-full h-[220px] mb-3">
                          <Image
                            src={p.image_url}
                            alt={p.product_name}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-contain"
                          />
                        </div>

                        <div className="text-[12px] text-[#666666] mb-1">
                          {p.source}
                        </div>

                        <div className="text-[14px] font-semibold text-[#212121] leading-[1.4] line-clamp-2 mb-3">
                          {p.product_name}
                        </div>

                        <div className="text-[14px] text-[#666666]">
                          from <span className="text-[#212121] font-bold">{p.price}</span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden xl:block xl:col-span-4">
            <div className="bg-white border border-[#E0E0E0] rounded-[4px] overflow-hidden h-full min-h-[520px] relative">
              <Image
                src={promoImage}
                alt="Promo"
                fill
                sizes="33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute left-8 bottom-8">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-white text-white font-bold text-[14px] rounded-sm cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  Discover now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}