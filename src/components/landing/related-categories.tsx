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
  numericPrice?: number;
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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useHorizontalScroll(ref: React.RefObject<HTMLDivElement>) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    const eps = 2;
    setCanLeft(left > eps);
    setCanRight(left < max - eps);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;

    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [ref]);

  const scrollByViewport = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85);
    const max = el.scrollWidth - el.clientWidth;
    const next = dir === "left" ? el.scrollLeft - amount : el.scrollLeft + amount;
    el.scrollTo({ left: clamp(next, 0, max), behavior: "smooth" });
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    el.scrollLeft += e.deltaY;
  };

  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el) return;
    dragging.current = true;
    startX.current = e.clientX;
    startLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const el = ref.current;
    if (!el || !dragging.current) return;
    const dx = e.clientX - startX.current;
    el.scrollLeft = startLeft.current - dx;
  };

  const endDrag = () => {
    dragging.current = false;
  };

  return { canLeft, canRight, scrollByViewport, onWheel, onPointerDown, onPointerMove, endDrag };
}

const SCROLLER_HIDE_NATIVE =
  "overflow-x-auto scroll-smooth touch-pan-x overscroll-x-contain select-none " +
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function ProductCard({
  p,
  badge = "bestseller",
  wishlistColor = "text-[#0474BA]",
}: {
  p: Product;
  badge?: string;
  wishlistColor?: string;
}) {
  const encodedUrl = encodeURIComponent(p.product_url);

  return (
    <Link
      href={`/product/${encodedUrl}?product_name=${encodeURIComponent(p.product_name)}&source=${encodeURIComponent(
        p.source
      )}`}
      className="flex-none w-[220px] sm:w-[230px] bg-white border border-[#E0E0E0] rounded-[4px] overflow-hidden relative no-underline hover:no-underline"
    >
      <button
        type="button"
        aria-label="Wishlist"
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center ${wishlistColor}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Heart size={20} strokeWidth={2} />
      </button>

      <div className="bg-[#F1F3F5] px-3 pt-3">
        <div className="relative w-full h-[165px]">
          <Image src={p.image_url} alt={p.product_name} fill sizes="230px" className="object-contain" />
        </div>
      </div>

      <div className="bg-white px-3 pb-3 pt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#0066C0] text-white text-[12px] font-bold px-2 py-0.5 rounded-[2px] lowercase">
            {badge}
          </span>
          <span className="text-[#666666] text-[13px] truncate">in {p.source}</span>
        </div>

        <div className="text-[#212121] text-[15px] font-bold leading-[1.2] line-clamp-2 min-h-[36px]">
          {p.product_name}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[13px] text-[#666666]">from</span>
          <span className="text-[18px] font-bold text-[#FF6600]">AED {p.numericPrice}</span>
        </div>
      </div>
    </Link>
  );
}

function CategoryTile({ title, slug, image }: { title: string; slug: string; image: string }) {
  return (
    <Link
      href={`/category/${encodeURIComponent(slug)}`}
      className="flex-none w-[220px] sm:w-[240px] h-[74px] border border-[#DCDCDC] rounded-[4px] bg-[#F3F4F6] relative overflow-hidden no-underline hover:no-underline"
    >
      <div className="h-full w-full flex items-center">
        <div className="px-4 pr-[92px] w-full">
          <div className="text-[14px] font-bold text-[#212121] leading-[1.15] truncate">{title}</div>
        </div>
      </div>
      <div className="absolute right-2 bottom-2 w-[56px] h-[56px]">
        <Image src={image} alt={title} fill sizes="56px" className="object-contain" />
      </div>
    </Link>
  );
}

function HoverArrows({
  canLeft,
  canRight,
  onLeft,
  onRight,
}: {
  canLeft: boolean;
  canRight: boolean;
  onLeft: () => void;
  onRight: () => void;
}) {
  return (
    <>
      {canLeft && (
        <button
          type="button"
          aria-label="Previous"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-[#C7CFD7] items-center justify-center z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
          onClick={onLeft}
        >
          <ChevronLeft size={26} className="text-white" />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label="Next"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 bg-[#C7CFD7] items-center justify-center z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
          onClick={onRight}
        >
          <ChevronRight size={26} className="text-white" />
        </button>
      )}
    </>
  );
}

export default function RelatedCategories({ products, loading }: { products: Product[]; loading: boolean }) {
  const bestsellers = useMemo(() => (Array.isArray(products) ? products : []), [products]);
  const matching = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    return arr.slice(Math.max(0, arr.length - 3));
  }, [products]);

  const bestRef = useRef<HTMLDivElement | any>(null);
  const {
    canLeft: bestCanLeft,
    canRight: bestCanRight,
    scrollByViewport: bestScrollByViewport,
    onWheel: bestOnWheel,
    onPointerDown: bestOnPointerDown,
    onPointerMove: bestOnPointerMove,
    endDrag: bestEndDrag,
  } = useHorizontalScroll(bestRef);

  const relRef = useRef<HTMLDivElement | any>(null);
  const {
    canLeft: relCanLeft,
    canRight: relCanRight,
    scrollByViewport: relScrollByViewport,
    onWheel: relOnWheel,
    onPointerDown: relOnPointerDown,
    onPointerMove: relOnPointerMove,
    endDrag: relEndDrag,
  } = useHorizontalScroll(relRef);

  const matchRef = useRef<HTMLDivElement | any>(null);
  const {
    canLeft: matchCanLeft,
    canRight: matchCanRight,
    scrollByViewport: matchScrollByViewport,
    onWheel: matchOnWheel,
    onPointerDown: matchOnPointerDown,
    onPointerMove: matchOnPointerMove,
    endDrag: matchEndDrag,
  } = useHorizontalScroll(matchRef);

  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-3 lg:px-0 pt-7 md:pt-8">
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#212121] mb-4">Discover the bestsellers</h2>

        <div className="relative group hidden md:block">
          {bestCanLeft && (
            <button
              type="button"
              aria-label="Previous"
              className="hidden md:flex absolute left-[-6px] top-1/2 -translate-y-1/2 h-12 w-12 bg-[#C7CFD7] items-center justify-center z-20
        opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
              onClick={() => bestScrollByViewport("left")}
            >
              <ChevronLeft size={26} className="text-white" />
            </button>
          )}

          {bestCanRight && (
            <button
              type="button"
              aria-label="Next"
              className="hidden md:flex absolute right-[-6px] top-1/2 -translate-y-1/2 h-12 w-12 bg-[#C7CFD7] items-center justify-center z-20
        opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
              onClick={() => bestScrollByViewport("right")}
            >
              <ChevronRight size={26} className="text-white" />
            </button>
          )}

          {loading ? (
            <div className={`flex gap-4 pb-4 pr-12 ${SCROLLER_HIDE_NATIVE}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[220px] sm:w-[240px] bg-white border border-[#E0E0E0] rounded-[4px] overflow-hidden animate-pulse"
                >
                  <div className="bg-[#F1F3F5] px-3 pt-3">
                    <div className="h-[165px] bg-[#E9ECEF] rounded" />
                  </div>
                  <div className="px-3 py-3">
                    <div className="h-4 w-24 bg-[#E9ECEF] rounded mb-2" />
                    <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                    <div className="h-5 w-24 bg-[#E9ECEF] rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={bestRef}
              className={`flex gap-4 pb-4 pr-12 ${SCROLLER_HIDE_NATIVE}`}
              onWheel={bestOnWheel}
              onPointerDown={bestOnPointerDown}
              onPointerMove={bestOnPointerMove}
              onPointerUp={bestEndDrag}
              onPointerCancel={bestEndDrag}
              onPointerLeave={bestEndDrag}
            >
              {bestsellers.map((p) => (
                <ProductCard key={p._id ?? p.product_url} p={p} badge="bestseller" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-3 lg:px-0 pb-10 pt-2 md:pt-3">
        <div className="grid grid-cols-1 xl:grid-cols-12 xl:gap-14 gap-8">
          <div className="xl:col-span-7">
            <h2 className="hidden sm:block text-[20px] md:text-[22px] font-bold text-[#212121] mb-4 mt-3 md:mt-4">
              Related categories
            </h2>

            <div className="relative group">
              <HoverArrows
                canLeft={relCanLeft}
                canRight={relCanRight}
                onLeft={() => relScrollByViewport("left")}
                onRight={() => relScrollByViewport("right")}
              />

              <div
                ref={relRef}
                className={`flex gap-4 pb-6 ${SCROLLER_HIDE_NATIVE}`}
                onWheel={relOnWheel}
                onPointerDown={relOnPointerDown}
                onPointerMove={relOnPointerMove}
                onPointerUp={relEndDrag}
                onPointerCancel={relEndDrag}
                onPointerLeave={relEndDrag}
              >
                {categories.map((cat) => (
                  <CategoryTile key={cat.slug} title={cat.title} slug={cat.slug} image={cat.image} />
                ))}
              </div>
            </div>

            <h2 className="text-[20px] md:text-[22px] font-bold text-[#212121] mb-4">Matching products</h2>

            <div className="relative group">
              <HoverArrows
                canLeft={matchCanLeft}
                canRight={matchCanRight}
                onLeft={() => matchScrollByViewport("left")}
                onRight={() => matchScrollByViewport("right")}
              />

              {loading ? (
                <div className={`flex gap-4 pb-2 ${SCROLLER_HIDE_NATIVE}`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-none w-[220px] sm:w-[230px] bg-white border border-[#E0E0E0] rounded-[4px] overflow-hidden animate-pulse"
                    >
                      <div className="bg-[#F1F3F5] px-3 pt-3">
                        <div className="h-[165px] bg-[#E9ECEF] rounded" />
                      </div>
                      <div className="px-3 py-3">
                        <div className="h-3 w-20 bg-[#E9ECEF] rounded mb-2" />
                        <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                        <div className="h-5 w-24 bg-[#E9ECEF] rounded mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  ref={matchRef}
                  className={`flex gap-4 pb-2 ${SCROLLER_HIDE_NATIVE}`}
                  onWheel={matchOnWheel}
                  onPointerDown={matchOnPointerDown}
                  onPointerMove={matchOnPointerMove}
                  onPointerUp={matchEndDrag}
                  onPointerCancel={matchEndDrag}
                  onPointerLeave={matchEndDrag}
                >
                  {matching.map((p) => (
                    <ProductCard key={p._id ?? p.product_url} p={p} badge="noon" wishlistColor="text-[#666666]" />
                  ))}
                </div>
              )}
            </div>

            <div className="block xl:hidden mt-6">
              <div className="rounded-[8px] overflow-hidden">
                <div className="relative w-full aspect-[16/9]">
                  <Image src={promoImage} alt="Promo" fill sizes="100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute left-6 bottom-6">
                    <button
                      type="button"
                      className="px-7 py-3 border-2 border-white text-white font-bold text-[14px] rounded-[3px] cursor-not-allowed"
                      onClick={(e) => e.preventDefault()}
                    >
                      Discover now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-5">
            <div className="rounded-[10px] overflow-hidden relative w-full min-h-[520px]">
              <Image src={promoImage} alt="Promo" fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute left-10 bottom-10">
                <button
                  type="button"
                  className="px-8 py-3 border-2 border-white text-white font-bold text-[14px] rounded-[3px] cursor-not-allowed"
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