"use client";

import * as React from "react";
import Image from "next/image";
import { useProduct } from "@/context/ProductContext";
import { cn } from "@/lib/utils";

/* =========================================================
   Static assets (idealo-like)
========================================================= */

const PAYMENT_ICONS = [
    {
        key: "paypal",
        src: "https://cdn.idealo.com/storage/offerpage/assets/offerpage/img/payment-icons/2x/paypal-c038cb02ad0744a542c4.png",
        alt: "PayPal",
    },
    {
        key: "visa",
        src: "https://cdn.idealo.com/storage/offerpage/assets/offerpage/img/payment-icons/2x/visa-ac94b93bc9a9921b1f11.png",
        alt: "Visa",
    },
    // {
    //     key: "mastercard",
    //     src: "https://cdn.idealo.com/storage/offerpage/assets/offerpage/img/payment-icons/2x/mastercard-2e81fe3d252402ab0358.png",
    //     alt: "Mastercard",
    // },
];

const SHOP_LOGOS = [
    {
        key: "ebay",
        src: "https://cdn.idealo.com/folder/Shop/9/7/9701/s1_shop_160x60.png",
        alt: "eBay",
        label: "Marketplace",
    },
    {
        key: "smartport",
        src: "https://cdn.idealo.com/folder/Shop/334/1/334103/s1_shop_160x60.png",
        alt: "smartport",
        label: "",
    },
];

function pickShop(idx: number) {
    return SHOP_LOGOS[idx % SHOP_LOGOS.length];
}

function formatAED(n: number) {
    return `AED ${n.toLocaleString()}`;
}

function parseAED(price: string): number | null {
    if (!price) return null;
    const num = Number(String(price).replace(/[^\d.]/g, ""));
    return Number.isFinite(num) && num > 0 ? num : null;
}

function truncate(s: string, n: number) {
    if (!s) return "";
    return s.length <= n ? s : s.slice(0, n).trimEnd() + "...";
}

type Offer = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number | null;
    url: string;
    imageUrl: string;
    available: boolean; // we don't truly have; use a stable fallback
};

function OfferComparisonTableSkeleton() {
    return (
        <section className="mt-8 bg-[#f3f4f6]">
            <div className="max-w-[1216px] mx-auto px-3 lg:px-0 py-6 animate-pulse">
                <div className="h-8 w-56 bg-[#e5e7eb] rounded mb-4" />
                <div className="h-10 w-full bg-[#e5e7eb] rounded mb-4" />
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                    <div className="hidden lg:block h-[520px] bg-[#e5e7eb] rounded" />
                    <div className="h-[520px] bg-[#e5e7eb] rounded" />
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   Small UI bits (idealo-like)
========================================================= */

function Star({ filled }: { filled: boolean }) {
    return (
        <span className={cn("text-[14px] leading-none", filled ? "text-[#22c55e]" : "text-[#d1d5db]")}>
            ★
        </span>
    );
}

function Rating({ value }: { value: number }) {
    const full = Math.max(0, Math.min(5, Math.floor(value)));
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-[1px]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < full} />
                ))}
            </div>
            <span className="text-[12px] text-[#111827] font-semibold">{value.toFixed(1)}</span>
        </div>
    );
}

function ButtonPill({
    active,
    children,
    onClick,
}: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                onClick?.();
            }}
            className={cn(
                "h-8 px-3 border text-[12px] font-semibold",
                active
                    ? "border-[#111827] text-[#111827] bg-white"
                    : "border-[#d1d5db] text-[#111827] bg-white",
                "cursor-not-allowed select-none"
            )}
        >
            {children}
        </button>
    );
}

/* =========================================================
   Main
========================================================= */

export default function OfferComparisonTable() {
    const { relatedProducts, relatedLoading } = useProduct();

    const [availableImmediately, setAvailableImmediately] = React.useState(true);
    const [noReturnShippingCosts, setNoReturnShippingCosts] = React.useState(false);
    const [sortKey, setSortKey] = React.useState<"price" | "total">("price");
    const [visible, setVisible] = React.useState(10);

    if (relatedLoading) return <OfferComparisonTableSkeleton />;

    const offers: Offer[] = (relatedProducts || [])
        .map((p: any, idx: number) => {
            const price = parseAED(p?.price);
            if (!price) return null;

            const oldP = parseAED(p?.old_price);
            // fallback "availability": stable-ish (we don't have real stock)
            const available = idx % 3 !== 0;

            return {
                id: String(p?._id || p?.product_url || idx),
                title: String(p?.product_name || "Offer"),
                price,
                oldPrice: oldP,
                url: String(p?.product_url || "#"),
                imageUrl: String(p?.image_url || ""),
                available,
            } as Offer;
        })
        .filter(Boolean) as Offer[];

    if (!offers.length) return null;

    const sorted = [...offers].sort((a, b) => {
        const aKey = sortKey === "total" ? a.price : a.price;
        const bKey = sortKey === "total" ? b.price : b.price;
        return aKey - bKey;
    });

    const filtered = availableImmediately ? sorted.filter((o) => o.available) : sorted;

    const cheapest = filtered.length ? Math.min(...filtered.map((o) => o.price)) : 0;

    const top10 = sorted.slice(0, 10);

    return (
        <section>
            <div className="max-w-[1216px] mx-auto px-3 lg:px-0 py-6">
                {/* Title */}
                <div className="text-[28px] font-semibold text-[#111827] mb-4">Price comparison</div>

                {/* Layout: left Top 10 + right table */}
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                    {/* LEFT: Top 10 (desktop only) */}
                    <aside className="hidden lg:block">
                        <div className="bg-[#dbeafe] rounded-md p-3">
                            <div className="text-[16px] mb-2 font-semibold text-[#111827] leading-tight">
                                Top 10 products
                            </div>
                            <div className="space-y-2">
                                {top10.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="bg-white border border-[#cbd5e1] rounded-md p-2 flex items-center gap-2"
                                    >
                                        <div className="w-6 text-center text-[13px] font-semibold text-[#111827]">
                                            {idx + 1}
                                        </div>

                                        <div className="w-[34px] h-[34px] rounded border border-[#e5e7eb] bg-white relative overflow-hidden">
                                            {!!p.imageUrl && (
                                                <Image
                                                    src={p.imageUrl}
                                                    alt={p.title}
                                                    fill
                                                    sizes="34px"
                                                    className="object-contain p-1"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[13px] text-[#111827] leading-tight font-medium">
                                                {truncate(p.title, 28)}
                                            </div>
                                            <div className="text-[13px] text-[#111827]">
                                                <span className="text-[#6b7280]">from </span>
                                                <span className="font-semibold">{formatAED(p.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT: filters + table */}
                    <div className="bg-white border border-[#d1d5db] rounded-md">
                        {/* Filters bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-3 border-b border-[#e5e7eb]">
                            <div className="flex flex-wrap items-center gap-6">
                                <label className="flex items-center gap-2 text-[12px] text-[#111827] select-none">
                                    <input
                                        type="checkbox"
                                        checked={availableImmediately}
                                        onChange={(e) => setAvailableImmediately(e.target.checked)}
                                        className="w-4 h-4 accent-[#111827]"
                                    />
                                    <span>Available immediately</span>
                                </label>

                                <label className="flex items-center gap-2 text-[12px] text-[#111827] select-none">
                                    <input
                                        type="checkbox"
                                        checked={noReturnShippingCosts}
                                        onChange={(e) => setNoReturnShippingCosts(e.target.checked)}
                                        className="w-4 h-4 accent-[#111827]"
                                    />
                                    <span>No return shipping costs</span>
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[12px] text-[#111827]">Sort by:</span>
                                <ButtonPill
                                    active={sortKey === "price"}
                                    onClick={() => setSortKey("price")}
                                >
                                    Price
                                </ButtonPill>
                                <ButtonPill
                                    active={sortKey === "total"}
                                    onClick={() => setSortKey("total")}
                                >
                                    Total price
                                </ButtonPill>
                            </div>
                        </div>


                        <div className="hidden lg:grid grid-cols-[minmax(0,2.35fr)_minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.55fr)_minmax(0,0.85fr)] gap-4 px-3 py-2 text-[12px] font-semibold text-[#111827] border-b border-[#e5e7eb]">
                            <div>Offer title</div>
                            <div>Price &amp; Shipping</div>
                            <div>Payment methods*</div>
                            <div>Shop &amp; Shop Review</div>
                            <div className="text-right"></div>
                        </div>

                        <div className="divide-y divide-[#e5e7eb]">
                            {filtered.slice(0, visible).map((o, idx) => {
                                const isCheapest = o.price === cheapest;
                                const shop = pickShop(idx);
                                const ratingValue = idx % 2 === 0 ? 5.0 : 3.7;

                                return (
                                    <div key={o.id} className="p-3">
                                        {/* Desktop row */}
                                        <div className="hidden lg:grid grid-cols-[minmax(0,2.35fr)_minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.55fr)_minmax(0,0.85fr)] gap-4 items-start">
                                            {/* Offer title */}
                                            <div className="min-w-0">
                                                <div className="text-[13px] font-semibold text-[#111827]">
                                                    <a
                                                        href={o.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[#1a73e8] hover:underline"
                                                    >
                                                        {o.title}
                                                    </a>
                                                </div>

                                                <div className="mt-2">
                                                    <span className="text-[12px] text-[#1a73e8] cursor-not-allowed">Details</span>
                                                </div>
                                            </div>

                                            {/* Price & Shipping */}
                                            <div>
                                                <div className="text-[24px] font-semibold text-[#111827] leading-none">
                                                    {formatAED(o.price)}
                                                </div>

                                                {isCheapest && (
                                                    <div className="mt-2 inline-block border border-[#fb923c] text-[#ea580c] text-[12px] px-2 py-1 rounded-sm">
                                                        Cheapest total price
                                                        <div className="text-[#111827]">{formatAED(o.price)} incl. shipping</div>
                                                    </div>
                                                )}

                                                {!isCheapest && (
                                                    <div className="mt-2 text-[12px] text-[#111827]">
                                                        {formatAED(o.price)} incl. shipping
                                                    </div>
                                                )}

                                                {o.oldPrice && o.oldPrice > o.price ? (
                                                    <div className="mt-2 inline-flex items-center gap-2">
                                                        <span className="text-[12px] border border-[#d1d5db] px-2 py-0.5 rounded-sm">
                                                            Price includes
                                                        </span>
                                                        <span className="text-[12px] text-[#1a73e8] cursor-not-allowed">voucher</span>
                                                    </div>
                                                ) : null}
                                            </div>

                                            {/* Payment methods */}
                                            <div className="flex items-start gap-2 pt-1">
                                                {PAYMENT_ICONS.map((p) => (
                                                    <div
                                                        key={p.key}
                                                        className="w-[46px] h-[26px] border border-[#d1d5db] bg-white rounded-sm relative overflow-hidden"
                                                    >
                                                        <Image src={p.src} alt={p.alt} fill sizes="46px" className="object-contain p-1" />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Shop & review */}
                                            <div className="pt-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="relative w-[110px] h-[36px]">
                                                        <Image src={shop.src} alt={shop.alt} fill sizes="110px" className="object-contain" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-[12px] text-[#111827] font-semibold">{shop.label}</div>
                                                        <div className="mt-1">
                                                            <Rating value={ratingValue} />
                                                        </div>
                                                        <div className="mt-2 text-[12px] text-[#111827]">
                                                            <span className="text-[#6b7280]">Sold by: </span>
                                                            <span className="cursor-not-allowed">handyshopandmore-bochum</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-2 text-[12px] text-[#1a73e8] cursor-not-allowed">Shop details</div>
                                            </div>

                                            {/* CTA */}
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(o.url, "_blank")}
                                                    className="h-10 px-5 rounded bg-[#22c55e] hover:bg-[#16a34a] text-white text-[14px] font-semibold"
                                                >
                                                    Visit the shop
                                                </button>
                                            </div>
                                        </div>

                                        <div className="lg:hidden border border-[#d1d5db] rounded-md p-3">
                                            <div className="text-[14px] font-semibold text-[#111827]">
                                                <a href={o.url} target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline">
                                                    {o.title}
                                                </a>
                                            </div>

                                            <div className="mt-3 flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-[24px] font-semibold text-[#111827] leading-none">{formatAED(o.price)}</div>

                                                    {isCheapest ? (
                                                        <div className="mt-2 inline-block border border-[#fb923c] text-[#ea580c] text-[12px] px-2 py-1 rounded-sm">
                                                            Cheapest total price
                                                            <div className="text-[#111827]">{formatAED(o.price)} incl. shipping</div>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 text-[12px] text-[#111827]">{formatAED(o.price)} incl. shipping</div>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => window.open(o.url, "_blank")}
                                                    className="h-10 px-5 rounded bg-[#22c55e] hover:bg-[#16a34a] text-white text-[14px] font-semibold whitespace-nowrap"
                                                >
                                                    Visit  the shop
                                                </button>
                                            </div>

                                            <div className="mt-3 flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="relative w-[120px] h-[40px]">
                                                        <Image src={shop.src} alt={shop.alt} fill sizes="120px" className="object-contain" />
                                                    </div>
                                                    <Rating value={idx % 2 === 0 ? 5.0 : 3.7} />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {PAYMENT_ICONS.slice(0, 2).map((p) => (
                                                        <div
                                                            key={p.key}
                                                            className="w-[44px] h-[26px] border border-[#d1d5db] bg-white rounded-sm relative overflow-hidden"
                                                        >
                                                            <Image src={p.src} alt={p.alt} fill sizes="44px" className="object-contain p-1" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-[12px] text-[#1a73e8] cursor-not-allowed">Details</span>
                                                <span className="text-[12px] text-[#1a73e8] cursor-not-allowed">Shop details</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Load more */}
                        {visible < filtered.length ? (
                            <div className="p-3">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setVisible((v) => v + 10);
                                    }}
                                    className="h-10 px-4 rounded border border-[#d1d5db] bg-white text-[#111827] text-[13px] font-semibold cursor-not-allowed"
                                >
                                    Show more offers
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}