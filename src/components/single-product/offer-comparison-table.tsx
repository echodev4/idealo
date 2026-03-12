"use client";

import * as React from "react";
import Image from "next/image";
import { useProduct } from "@/context/ProductContext";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
    available: boolean;
    source: string;
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

export default function OfferComparisonTable() {
    const router = useRouter();
    const { relatedProducts, relatedLoading } = useProduct();
    const { t } = useLanguage();

    const [availableImmediately, setAvailableImmediately] = React.useState(false);
    const [noReturnShippingCosts, setNoReturnShippingCosts] = React.useState(false);
    const [sortKey, setSortKey] = React.useState<"price" | "total">("price");
    const [visible, setVisible] = React.useState(10);
    const [expandedOffers, setExpandedOffers] = React.useState<Record<string, boolean>>({});

    if (relatedLoading) return <OfferComparisonTableSkeleton />;

    const offers: Offer[] = (relatedProducts || [])
        .map((p: any, idx: number) => {
            const price = parseAED(p?.price);
            if (!price) return null;

            const oldP = parseAED(p?.old_price);
            const available = idx % 3 !== 0;

            return {
                id: String(p?._id || p?.product_url || idx),
                title: String(p?.product_name || t("singleProduct.offerComparisonTable.offerFallback", "Offer")),
                price,
                oldPrice: oldP,
                url: String(p?.product_url || "#"),
                imageUrl: String(p?.image_url || ""),
                available,
                source: String(p?.source || "unknown"),
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

    const ordered = [...filtered].sort((a, b) => {
        const aCheapest = a.price === cheapest ? 0 : 1;
        const bCheapest = b.price === cheapest ? 0 : 1;
        if (aCheapest !== bCheapest) return aCheapest - bCheapest;
        return a.price - b.price;
    });

    const top10 = sorted.slice(0, 10);
    const totalOffersCount = relatedProducts?.length || offers.length;

    return (
        <section>
            <div className="py-6">
                <div className="hidden lg:block text-[28px] font-semibold text-[#111827] mb-4">
                    {t("singleProduct.offerComparisonTable.title", "Price comparison")}
                </div>

                <div className="lg:hidden mb-3">
                    <div className="text-[22px] leading-none font-semibold text-[#111827] mt-1">
                        {totalOffersCount} {""}    {t("singleProduct.offerComparisonTable.offersAvailable", "Offers")}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                    <aside className="hidden lg:block">
                        <div className="bg-[#dbeafe] rounded-md p-3">
                            <div className="text-[16px] mb-2 font-semibold text-[#111827] leading-tight">
                                {t("singleProduct.offerComparisonTable.topProducts", "Top 10 products")}
                            </div>
                            <div className="space-y-2">
                                {top10.map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="bg-white border border-[#cbd5e1] rounded-md p-2 flex items-center gap-2 cursor-pointer"
                                        onClick={() => {
                                            router.push(`/product/${encodeURIComponent(p.url)}?product_name=${encodeURIComponent(p.title)}&source=${encodeURIComponent(p.source)}`);
                                        }}
                                    >
                                        <div className="w-6 text-center text-[13px] font-semibold text-[#111827]">{idx + 1}</div>

                                        <div className="w-[34px] h-[34px] rounded border border-[#e5e7eb] bg-white relative overflow-hidden">
                                            {!!p.imageUrl && (
                                                <Image src={p.imageUrl} alt={p.title} fill sizes="34px" className="object-contain p-1" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[13px] text-[#111827] leading-tight font-medium">{truncate(p.title, 28)}</div>
                                            <div className="text-[13px] text-[#111827]">
                                                <span className="text-[#6b7280]">{t("singleProduct.offerComparisonTable.from", "from")} </span>
                                                <span className="font-semibold">{formatAED(p.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div>
                        <div className="bg-white border border-[#d1d5db] rounded-md">
                            <div className="hidden lg:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-3 border-b border-[#e5e7eb]">
                                <div className="flex flex-wrap items-center gap-6">
                                    <label className="flex items-center gap-2 text-[12px] text-[#111827] select-none">
                                        <input
                                            type="checkbox"
                                            checked={availableImmediately}
                                            onChange={(e) => setAvailableImmediately(e.target.checked)}
                                            className="w-4 h-4 accent-[#111827]"
                                        />
                                        <span>{t("singleProduct.offerComparisonTable.filters.availableImmediately", "Available immediately")}</span>
                                    </label>

                                    <label className="flex items-center gap-2 text-[12px] text-[#111827] select-none">
                                        <input
                                            type="checkbox"
                                            checked={noReturnShippingCosts}
                                            onChange={(e) => setNoReturnShippingCosts(e.target.checked)}
                                            className="w-4 h-4 accent-[#111827]"
                                        />
                                        <span>{t("singleProduct.offerComparisonTable.filters.noReturnShippingCosts", "No return shipping costs")}</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-[#111827]">{t("singleProduct.offerComparisonTable.sortBy", "Sort by:")}</span>
                                    <ButtonPill active={sortKey === "price"} onClick={() => setSortKey("price")}>
                                        {t("singleProduct.offerComparisonTable.sort.price", "Price")}
                                    </ButtonPill>
                                    <ButtonPill active={sortKey === "total"} onClick={() => setSortKey("total")}>
                                        {t("singleProduct.offerComparisonTable.sort.totalPrice", "Total price")}
                                    </ButtonPill>
                                </div>
                            </div>

                            <div className="hidden lg:grid grid-cols-[minmax(0,2.35fr)_minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.55fr)_minmax(0,0.85fr)] gap-4 px-3 py-2 text-[12px] font-semibold text-[#111827] border-b border-[#e5e7eb]">
                                <div>{t("singleProduct.offerComparisonTable.columns.offerTitle", "Offer title")}</div>
                                <div>{t("singleProduct.offerComparisonTable.columns.priceShipping", "Price & Shipping")}</div>
                                <div>{t("singleProduct.offerComparisonTable.columns.paymentMethods", "Payment methods*")}</div>
                                <div>{t("singleProduct.offerComparisonTable.columns.shopReview", "Shop & Shop Review")}</div>
                                <div className="text-right"></div>
                            </div>

                            <div className="divide-y divide-[#e5e7eb]">
                                {ordered.slice(0, visible).map((o, idx) => {
                                    const isCheapest = o.price === cheapest;
                                    const shop = pickShop(idx);
                                    const ratingValue = idx % 2 === 0 ? 5.0 : 3.7;
                                    const isExpanded = !!expandedOffers[o.id];

                                    return (
                                        <div key={o.id} className="p-3">
                                            <div className="hidden lg:grid grid-cols-[minmax(0,2.35fr)_minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.55fr)_minmax(0,0.85fr)] gap-4 items-start">
                                                <div className="min-w-0">
                                                    <div className="text-[13px] font-semibold text-[#111827]">
                                                        <a href={o.url} target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline">
                                                            {o.title}
                                                        </a>
                                                    </div>

                                                    <div className="mt-2">
                                                        <span className="text-[12px] text-[#1a73e8] cursor-not-allowed">{t("singleProduct.offerComparisonTable.details", "Details")}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-[24px] font-semibold text-[#111827] leading-none">{formatAED(o.price)}</div>

                                                    {isCheapest && (
                                                        <div className="mt-2 inline-block border border-[#fb923c] text-[#ea580c] text-[12px] px-2 py-1 rounded-sm">
                                                            {t("singleProduct.offerComparisonTable.cheapestTotalPrice", "Cheapest total price")}
                                                            <div className="text-[#111827]">{formatAED(o.price)} {t("singleProduct.offerComparisonTable.includingShipping", "incl. shipping")}</div>
                                                        </div>
                                                    )}

                                                    {!isCheapest && (
                                                        <div className="mt-2 text-[12px] text-[#111827]">
                                                            {formatAED(o.price)} {t("singleProduct.offerComparisonTable.includingShipping", "incl. shipping")}
                                                        </div>
                                                    )}

                                                    {o.oldPrice && o.oldPrice > o.price ? (
                                                        <div className="mt-2 inline-flex items-center gap-2">
                                                            <span className="text-[12px] border border-[#d1d5db] px-2 py-0.5 rounded-sm">
                                                                {t("singleProduct.offerComparisonTable.priceIncludes", "Price includes")}
                                                            </span>
                                                            <span className="text-[12px] text-[#1a73e8] cursor-not-allowed">{t("singleProduct.offerComparisonTable.voucher", "voucher")}</span>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="flex items-start gap-2 pt-1">
                                                    {PAYMENT_ICONS.map((p, i) => (
                                                        <div
                                                            key={p.key}
                                                            className={`w-[46px] h-[26px] border border-[#d1d5db] bg-white rounded-sm relative overflow-hidden ${i > 0 ? "hidden sm:block" : ""}`}
                                                        >
                                                            <Image src={p.src} alt={p.alt} fill sizes="46px" className="object-contain p-1" />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-1">
                                                    <div className="flex items-start gap-3">
                                                        <div className="relative w-[110px] h-[36px]">
                                                            <Image src={shop.src} alt={shop.alt} fill sizes="110px" className="object-contain" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-[12px] text-[#111827] font-semibold">
                                                                {shop.label ? t("singleProduct.offerComparisonTable.marketplace", "Marketplace") : ""}
                                                            </div>
                                                            <div className="mt-1">
                                                                <Rating value={ratingValue} />
                                                            </div>
                                                            <div className="mt-2 text-[12px] text-[#111827]">
                                                                <span className="text-[#6b7280]">{t("singleProduct.offerComparisonTable.soldBy", "Sold by:")} </span>
                                                                <span className="cursor-not-allowed">handyshopandmore-bochum</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 text-[12px] text-[#1a73e8] cursor-not-allowed">{t("singleProduct.offerComparisonTable.shopDetails", "Shop details")}</div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(o.url, "_blank")}
                                                        className="h-10 px-5 rounded bg-[#22c55e] hover:bg-[#16a34a] text-white text-[14px] font-semibold"
                                                    >
                                                        {t("singleProduct.offerComparisonTable.visitShop", "Visit the shop")}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="lg:hidden border border-[#d1d5db] rounded-xl p-3">
                                                {isCheapest ? (
                                                    <div className="mb-2 inline-flex items-center rounded-[4px] border border-[#fb923c] bg-[#fff7ed] px-2 py-1 text-[12px] font-semibold text-[#ea580c]">
                                                        {t("singleProduct.offerComparisonTable.cheapestTotalPrice", "Lowest price")}
                                                    </div>
                                                ) : null}

                                                <div className="text-[14px] font-semibold text-[#111827]">
                                                    <a href={o.url} target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline">
                                                        {o.title}
                                                    </a>
                                                </div>

                                                <div className="mt-3">
                                                    <div className="text-[24px] font-semibold text-[#111827] leading-none">{formatAED(o.price)}</div>
                                                    <div className="mt-1 text-[14px] text-[#374151]">
                                                        {formatAED(o.price)} {t("singleProduct.offerComparisonTable.includingShipping", "incl. shipping")}
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <div className="min-w-0 flex items-center gap-2">
                                                        <div className="relative w-[120px] h-[40px]">
                                                            <Image src={shop.src} alt={shop.alt} fill sizes="120px" className="object-contain" />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        aria-label={isExpanded ? "Collapse offer details" : "Expand offer details"}
                                                        onClick={() =>
                                                            setExpandedOffers((prev) => ({
                                                                ...prev,
                                                                [o.id]: !prev[o.id],
                                                            }))
                                                        }
                                                        className="shrink-0 h-11 w-11 rounded-full border border-[#d1d5db] bg-[#f3f4f6] flex items-center justify-center"
                                                    >
                                                        <span
                                                            className={cn(
                                                                "text-[#6b7280] transition-transform",
                                                                isExpanded ? "rotate-180" : "rotate-0"
                                                            )}
                                                        >
                                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                                                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className="mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(o.url, "_blank")}
                                                        className="w-full h-12 rounded-2xl border border-[#d1d5db] bg-[#f3f4f6] text-[#111827] text-[18px] font-semibold flex items-center justify-center gap-2"
                                                    >
                                                        <span className="text-[18px] leading-none">
                                                            {t("singleProduct.offerComparisonTable.toShop", "To Shop")}
                                                        </span>
                                                        <span className="text-[#1a73e8] leading-none" aria-hidden="true"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                                                    </button>
                                                </div>

                                                {isExpanded ? (
                                                    <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <Rating value={ratingValue} />
                                                            <div className="shrink-0 flex items-center gap-2">
                                                                {PAYMENT_ICONS.map((p) => (
                                                                    <div
                                                                        key={p.key}
                                                                        className="w-[44px] h-[26px] border border-[#d1d5db] bg-white rounded-sm relative overflow-hidden"
                                                                    >
                                                                        <Image src={p.src} alt={p.alt} fill sizes="44px" className="object-contain p-1" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between text-[13px]">
                                                            <span className="text-[#1a73e8] cursor-not-allowed">
                                                                {t("singleProduct.offerComparisonTable.details", "Details")}
                                                            </span>
                                                            <span className="text-[#1a73e8] cursor-not-allowed">
                                                                {t("singleProduct.offerComparisonTable.shopDetails", "Shop details")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {visible < ordered.length ? (
                                <div className="p-3">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setVisible((v) => v + 10);
                                        }}
                                        className="h-10 px-4 rounded border border-[#d1d5db] bg-white text-[#111827] text-[13px] font-semibold cursor-not-allowed"
                                    >
                                        {t("singleProduct.offerComparisonTable.showMoreOffers", "Show more offers")}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

