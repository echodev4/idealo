import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

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

    const scrollBy = (dx: number) => {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: dx, behavior: "smooth" });
    };

    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
    };

    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el) return;
        isDown = true;
        startX = e.clientX;
        startLeft = el.scrollLeft;
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = ref.current;
        if (!el || !isDown) return;
        const dx = e.clientX - startX;
        el.scrollLeft = startLeft - dx;
    };

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
        isDown = false;
    };

    return { ref, scrollBy, onWheel, onPointerDown, onPointerMove, onPointerUp };
}

const bannerUrl =
    "https://cdn.idealo.com/storage/teaser/de_DE/images/XL_NEWandXXL_NEW_544_2e6a52d3-b740-414c-bbd9-2c2799396ff6_pokemon-XL-XXL_1088x1064_max150kb.jpg";

export default function HeroTeaser({
    products,
    loading,
}: {
    products: Product[];
    loading: boolean;
}) {
    const { t } = useLanguage();

    const items = useMemo(() => (Array.isArray(products) ? products.slice(0, 3) : []), [products]);

    const { ref, scrollBy, onWheel, onPointerDown, onPointerMove, onPointerUp } =
        useHorizontalScrollHelpers();

    return (
        <section className="bg-[var(--background)] home-band px-3 lg:px-0">
            <div className="container max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Left: 3 products */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-[20px] font-bold text-[#212121] leading-[1.25] m-0">
                                {t("landing.hero.title", "Popular products")}
                            </h2>
                        </div>

                        <div className="relative group">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="card-idealo p-3 h-[290px] animate-pulse">
                                            <div className="h-4 w-24 bg-[#E9ECEF] rounded mb-2" />
                                            <div className="h-[160px] bg-[#F1F3F5] rounded mb-3" />
                                            <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                                            <div className="h-4 w-3/4 bg-[#E9ECEF] rounded mb-4" />
                                            <div className="h-5 w-24 bg-[#E9ECEF] rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    ref={ref}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 overflow-hidden"
                                    onWheel={onWheel}
                                    onPointerDown={onPointerDown}
                                    onPointerMove={onPointerMove}
                                    onPointerUp={onPointerUp}
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
                                                className="card-idealo p-3 flex flex-col h-full transition-shadow hover:shadow-md relative hover:no-underline"
                                            >
                                                <button
                                                    aria-label={t("landing.common.wishlist", "Wishlist")}
                                                    className="absolute top-2 right-2 text-[#666666] hover:text-red-500 transition-colors z-10"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Heart size={20} strokeWidth={1.5} />
                                                </button>

                                                <div className="relative h-[160px] w-full mb-3 flex items-center justify-center">
                                                    <Image
                                                        src={p.image_url}
                                                        alt={name}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, 33vw"
                                                        className="object-contain p-2"
                                                    />
                                                </div>

                                                <div className="flex-grow flex flex-col">
                                                    <div className="flex flex-wrap gap-1 mb-1">
                                                        <span className="bg-[#EBF5FB] text-[var(--color-link)] text-[10px] font-bold uppercase py-0.5 px-1 rounded-[3px]">
                                                            {t("landing.hero.badge", "Featured")}
                                                        </span>
                                                        <span className="text-[#666666] text-[12px] leading-tight truncate">
                                                            {p.source}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-[14px] leading-[1.4] font-normal text-[#212121] line-clamp-2 hover:text-[var(--color-link)] cursor-pointer mb-2">
                                                        {name}
                                                    </h3>

                                                    {/* UI-only rating block */}
                                                    <div className="mt-auto">
                                                        <div
                                                            className="flex items-center gap-1 mb-2 cursor-not-allowed"
                                                            title={t("landing.common.comingSoon", "Coming soon")}
                                                        >
                                                            <span className="bg-[#EBF5FB] text-[#212121] text-[11px] px-1 py-0.5">
                                                                {t("landing.common.rating", "Rating")}
                                                            </span>
                                                            <div className="flex items-center">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={12}
                                                                        fill={i < 4 ? "#354757" : "none"}
                                                                        color="#354757"
                                                                        strokeWidth={2}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-[#666666] text-[12px]">
                                                                {t("landing.common.reviews", "Reviews")}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-[12px] text-[#212121]">
                                                                {t("landing.common.from", "from")}
                                                            </span>
                                                            <span className="text-[16px] font-bold text-[#212121]">
                                                                {price !== null ? `AED ${price}` : `AED ${p.price}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Arrows (visual + working) */}
                            <button
                                type="button"
                                aria-label={t("landing.common.prev", "Previous")}
                                onClick={() => scrollBy(-340)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#DEE2E6] rounded-full hidden lg:flex items-center justify-center shadow-md z-20 text-[#212121] hover:bg-[#F1F3F5] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                aria-label={t("landing.common.next", "Next")}
                                onClick={() => scrollBy(340)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#DEE2E6] rounded-full hidden lg:flex items-center justify-center shadow-md z-20 text-[#212121] hover:bg-[#F1F3F5] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Banner */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <a
                            href="#"
                            className="relative block w-full aspect-[1088/1064] lg:aspect-square overflow-hidden rounded-[4px] shadow-sm transform transition-transform hover:scale-[1.005]"
                        >
                            <Image
                                src={bannerUrl}
                                alt={t("landing.hero.bannerAlt", "Campaign banner")}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 lg:p-10">
                                <h3 className="text-white text-[28px] lg:text-[40px] font-bold leading-tight mb-2">
                                    {t("landing.hero.bannerTitle", "Special picks")}
                                </h3>
                                <div className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold text-[14px] rounded-sm hover:bg-white hover:text-black transition-colors w-fit cursor-not-allowed">
                                    {t("landing.hero.bannerCta", "Coming soon")}
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}