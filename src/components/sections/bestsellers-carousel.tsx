// components/sections/bestsellers-carousel.tsx
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/language-context";

type Product = {
    _id: string;
    product_url: string;
    source: string;
    product_name: string;
    image_url: string;
    price: string;
};

function parsePriceToNumber(price?: string) {
    if (!price) return null;
    const cleaned = price.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
}

function useHorizontalScrollHelpers() {
    const ref = useRef<HTMLDivElement | null>(null);

    const dragging = useRef(false);
    const startX = useRef(0);
    const startLeft = useRef(0);

    const scrollBy = (dx: number) => {
        ref.current?.scrollBy({ left: dx, behavior: "smooth" });
    };

    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;

        // If user is already scrolling horizontally (trackpad), don't interfere.
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

        el.scrollLeft += e.deltaY;
    };

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

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => endDrag();
    const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = () => endDrag();
    const onPointerLeave: React.PointerEventHandler<HTMLDivElement> = () => endDrag();

    return {
        ref,
        scrollBy,
        onWheel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onPointerLeave,
    };
}

export default function BestsellersCarousel({
    products,
    loading,
    titleKey = "landing.carousel.title",
    fallbackTitle = "Featured products",
}: {
    products: Product[];
    loading: boolean;
    titleKey?: string;
    fallbackTitle?: string;
}) {
    const { t } = useLanguage();
    const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);

    const {
        ref,
        scrollBy,
        onWheel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onPointerLeave,
    } = useHorizontalScrollHelpers();

    return (
        <section className="bg-[var(--background)] home-band">
            <div className="container">
                <h2 className="text-[20px] font-bold text-[#000000] mb-4 leading-[1.25]">
                    {t(titleKey, fallbackTitle)}
                </h2>

                <div className="relative group">
                    {loading ? (
                        <div className="flex overflow-x-auto gap-2 pb-4 hide-scrollbar">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-none w-[170px] sm:w-[210px] card-idealo relative flex flex-col p-3 animate-pulse"
                                >
                                    <div className="h-4 w-24 bg-[#E9ECEF] rounded mb-2" />
                                    <div className="w-full aspect-square bg-[#F1F3F5] rounded mb-3" />
                                    <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                                    <div className="h-4 w-3/4 bg-[#E9ECEF] rounded mb-4" />
                                    <div className="h-5 w-24 bg-[#E9ECEF] rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            ref={ref}
                            className="flex overflow-x-auto gap-2 pb-4 hide-scrollbar snap-x snap-mandatory select-none scroll-smooth touch-pan-x overscroll-x-contain"
                            onWheel={onWheel}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerCancel}
                            onPointerLeave={onPointerLeave}
                        >
                            {items.map((p) => {
                                const name = p.product_name;
                                const price = parsePriceToNumber(p.price);
                                const encodedUrl = encodeURIComponent(p.product_url);

                                return (
                                    <Link
                                        key={p._id ?? p.product_url}
                                        href={`/product/${encodedUrl}?product_name=${encodeURIComponent(
                                            name
                                        )}&source=${encodeURIComponent(p.source)}`}
                                        className="flex-none w-[170px] sm:w-[210px] card-idealo relative flex flex-col p-3 snap-start hover:no-underline"
                                    >
                                        <button
                                            aria-label={t("landing.common.wishlist", "Wishlist")}
                                            className="absolute top-2 right-2 z-10 p-1 text-[var(--color-link)] hover:text-[var(--color-link)]/80 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Heart className="w-5 h-5" />
                                        </button>

                                        <div className="relative w-full aspect-square mb-3 flex items-center justify-center">
                                            <Image
                                                src={p.image_url}
                                                alt={name}
                                                width={160}
                                                height={160}
                                                className="object-contain max-h-full max-w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-grow">
                                            <div className="flex items-baseline gap-1 mb-1">
                                                <span className="bg-[var(--color-link)] text-white text-[10px] font-bold uppercase px-1 leading-tight rounded-[2px]">
                                                    {t("landing.carousel.badge", "Featured")}
                                                </span>
                                                <span className="text-[#666666] text-[10px] truncate max-w-[90px]">
                                                    {p.source}
                                                </span>
                                            </div>

                                            <h3 className="text-[14px] text-[#212121] leading-[1.4] mb-2 font-normal line-clamp-2 min-h-[40px]">
                                                <span className="text-inherit hover:underline border-none">{name}</span>
                                            </h3>

                                            <div
                                                className="mt-auto flex flex-wrap items-center gap-2 mb-2 cursor-not-allowed"
                                                title={t("landing.common.comingSoon", "Coming soon")}
                                            >
                                                <span className="bg-[#EBF5FB] text-[var(--color-link)] text-[10px] font-medium px-1.5 py-0.5 rounded-[3px] whitespace-nowrap">
                                                    {t("landing.common.rating", "Rating")}
                                                </span>

                                                <div className="flex items-center">
                                                    <div className="flex mr-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-2.5 h-2.5 ${i < 4
                                                                    ? "fill-[#666666] text-[#666666]"
                                                                    : "text-[#E0E0E0] fill-[#E0E0E0]"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[#666666] text-[10px]">
                                                        {t("landing.common.reviews", "Reviews")}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[#666666] text-[12px]">
                                                    {t("landing.common.from", "from")}
                                                </span>
                                                <span className="text-[16px] font-bold text-[#212121]">
                                                    {price !== null ? `AED ${price}` : `AED ${p.price}`}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <button
                        type="button"
                        aria-label={t("landing.common.prev", "Previous")}
                        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#DEE2E6] rounded-full shadow-md items-center justify-center z-20 hover:bg-[#F1F3F5]"
                        onClick={() => scrollBy(-360)}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        type="button"
                        aria-label={t("landing.common.next", "Next")}
                        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#DEE2E6] rounded-full shadow-md items-center justify-center z-20 hover:bg-[#F1F3F5]"
                        onClick={() => scrollBy(360)}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}