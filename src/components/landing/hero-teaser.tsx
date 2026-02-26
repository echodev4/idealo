"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";

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

const bannerUrl =
    "https://cdn.idealo.com/storage/teaser/de_DE/images/XL_NEWandXXL_NEW_544_2e6a52d3-b740-414c-bbd9-2c2799396ff6_pokemon-XL-XXL_1088x1064_max150kb.jpg";

const tips = [
    {
        title: "Deals of the day ⚡",
        img: "https://db62cod6cnasq.cloudfront.net/user-media/10320/sg231687/4198699356_transcoded.gif",
    },
    {
        title: "30 Years of Pokémon ⚡",
        img: "https://db62cod6cnasq.cloudfront.net/user-media/10320/sg279024/3742896200_transcoded.gif",
    },
    {
        title: "Your home cinema 🍿",
        img: "https://db62cod6cnasq.cloudfront.net/user-media/10320/sg278323/3584561243_transcoded.gif",
    },
    {
        title: "Off to the snow 🏂",
        img: "https://db62cod6cnasq.cloudfront.net/user-media/10320/sg271870/3278376670.webp",
    },
    {
        title: "Our 3 Tips",
        img: "https://db62cod6cnasq.cloudfront.net/user-media/10320/sg231691/3769503969.webp",
    },
];

export default function HeroTeaser({ products, loading }: { products: Product[]; loading: boolean }) {
    const items = useMemo(() => (Array.isArray(products) ? products.slice(0, 3) : []), [products]);
    const tipsRef = useRef<HTMLDivElement | null>(null);

    const scrollTipsRight = () => {
        tipsRef.current?.scrollBy({ left: 340, behavior: "smooth" });
    };

    return (
        <section className="bg-white px-3 lg:px-0 pt-6 lg:pt-8 pb-6">
            <div className="container max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                    <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col">
                        <div className="relative mb-4">
                            <div ref={tipsRef} className="flex gap-6 overflow-x-auto hide-scrollbar pr-14 max-w-full">
                                {tips.map((t) => (
                                    <div
                                        key={t.title}
                                        className="flex-shrink-0 w-[132px] sm:w-[150px] lg:w-[160px] cursor-not-allowed select-none"
                                    >
                                        <div className="mx-auto w-[96px] h-[96px] rounded-full border-[3px] border-[#FF6600] flex items-center justify-center bg-[#0A3761] overflow-hidden">
                                            <div className="relative w-[82px] h-[82px] rounded-full overflow-hidden">
                                                <Image src={t.img} alt={t.title} fill className="object-cover" />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center text-[13px] leading-4 text-[#212121] font-medium px-1">
                                            {t.title}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={scrollTipsRight}
                                className="absolute right-0 top-[30px] w-10 h-10 bg-[#D9D9D9] text-[#212121] flex items-center justify-center cursor-not-allowed"
                                aria-label="Next tips"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="flex items-end justify-between mb-3">
                            <h2 className="text-[22px] font-bold text-[#212121] m-0">Popular products</h2>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="card-idealo p-4 h-[360px] animate-pulse">
                                        <div className="h-[190px] bg-[#F1F3F5] rounded mb-4" />
                                        <div className="h-4 w-20 bg-[#E9ECEF] rounded mb-2" />
                                        <div className="h-5 w-full bg-[#E9ECEF] rounded mb-2" />
                                        <div className="h-4 w-3/4 bg-[#E9ECEF] rounded mb-4" />
                                        <div className="h-4 w-24 bg-[#E9ECEF] rounded mb-3" />
                                        <div className="h-6 w-28 bg-[#E9ECEF] rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {items.map((p, idx) => {
                                    const name = p.product_name;
                                    const encodedUrl = encodeURIComponent(p.product_url);
                                    const price = parsePriceToNumber(p.price);

                                    const grade = idx === 0 ? "1.4" : idx === 1 ? "1.5" : "";
                                    const starsFilled = 4;
                                    const count = "10";

                                    return (
                                        <Link
                                            key={p._id ?? p.product_url}
                                            href={`/product/${encodedUrl}?product_name=${encodeURIComponent(name)}&source=${encodeURIComponent(
                                                p.source
                                            )}`}
                                            className="card-idealo p-4 flex flex-col h-full relative no-underline hover:no-underline"
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

                                            <div className="relative h-[200px] w-full mb-3 flex items-center justify-center">
                                                <Image
                                                    src={p.image_url}
                                                    alt={name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 33vw"
                                                    className="object-contain"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-[#0066C0] text-white text-[12px] font-bold px-2 py-0.5 rounded-[2px] lowercase">
                                                    bestseller
                                                </span>
                                                <span className="text-[#666666] text-[14px] truncate">in {p.source}</span>
                                            </div>

                                            <div className="text-[#212121] text-[16px] font-bold leading-[1.2] line-clamp-2 mb-3">
                                                {name}
                                            </div>

                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2 mb-3 cursor-not-allowed select-none">
                                                    {grade ? (
                                                        <span className="text-[12px] px-2 py-1 rounded-full bg-[#EBF5FB] text-[#0474BA]">
                                                            Average grade {grade}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[12px] px-2 py-1 rounded-full bg-[#F1F3F5] text-[#666666]">
                                                            Rating
                                                        </span>
                                                    )}

                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={13}
                                                                fill={i < starsFilled ? "#212121" : "none"}
                                                                color="#212121"
                                                                strokeWidth={2}
                                                            />
                                                        ))}
                                                    </div>

                                                    <span className="text-[12px] text-[#666666]">{count}</span>
                                                </div>

                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-[14px] text-[#666666]">from</span>
                                                    <span className="text-[20px] font-bold text-[#FF6600]">
                                                        {price !== null ? `€${price.toFixed(2)}` : p.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 flex">
                        <div className="relative w-full overflow-hidden rounded-[6px] cursor-not-allowed flex-1 h-full min-h-[420px] lg:min-h-0">
                            <Image
                                src={bannerUrl}
                                alt="Campaign banner"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute left-6 right-6 bottom-6 lg:left-10 lg:right-10 lg:bottom-10">
                                <div className="text-white text-[28px] lg:text-[36px] font-bold leading-tight mb-4">
                                    30 Years of Pokemon
                                </div>
                                <div className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold text-[14px] rounded-sm w-fit">
                                    Grab them all!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}