"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProduct } from "@/context/ProductContext";
import { useLanguage } from "@/contexts/language-context";
import { resolvePreferredProductImage } from "@/lib/products/imageFallback";
import { cn } from "@/lib/utils";
import noonLogo from "../../../public/uploads/sources/noon.jpg";
import carrefourLogo from "../../../public/uploads/sources/carrefouruae.png";
import sharafDgLogo from "../../../public/uploads/sources/sharaf.jpg";

function formatAED(n: number) {
    return `AED ${n.toLocaleString()}`;
}

function PriceText({
    price,
    loading,
    className = "",
}: {
    price: number;
    loading?: boolean;
    className?: string;
}) {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <span>{formatAED(price)}</span>
            {loading ? (
                <span
                    aria-label="Refreshing price"
                    className="inline-block h-3 w-8 animate-pulse rounded bg-[#e5e7eb] align-middle"
                />
            ) : null}
        </span>
    );
}

function parseAED(price: string | number | null | undefined): number | null {
    if (price === null || price === undefined || price === "") return null;
    const num = Number(String(price).replace(/[^\d.]/g, ""));
    return Number.isFinite(num) && num > 0 ? num : null;
}

function truncate(s: string, n: number) {
    if (!s) return "";
    return s.length <= n ? s : s.slice(0, n).trimEnd() + "...";
}

function normalizeSourceName(source?: string | null) {
    const value = String(source || "").trim().toLowerCase();
    if (value === "carrefouruae") return "carrefour";
    return value;
}

function getProductKey(item: { product_url?: string | null; source?: string | null }) {
    return `${String(item?.product_url || "").trim()}::${normalizeSourceName(item?.source || "")}`;
}

function getSourceLogo(source: string) {
    const normalized = normalizeSourceName(source);

    if (normalized === "noon") {
        return { src: noonLogo, alt: "noon", label: "noon" };
    }

    if (normalized === "carrefour") {
        return { src: carrefourLogo, alt: "Carrefour", label: "carrefour" };
    }

    if (normalized === "sharafdg") {
        return { src: sharafDgLogo, alt: "Sharaf", label: "sharaf" };
    }

    if (normalized === "jumbo") {
        return { src: "/uploads/sources/jumbo.svg", alt: "Jumbo", label: "jumbo" };
    }

    if (normalized === "jackys" || normalized === "jacky's") {
        return { src: "/uploads/sources/jackys.svg", alt: "Jacky's", label: "jackys" };
    }

    if (normalized === "istyle") {
        return { src: "/uploads/sources/istyle.svg", alt: "iSTYLE", label: "istyle" };
    }

    if (normalized === "eros") {
        return { src: "/uploads/sources/eros.svg", alt: "Eros Group", label: "eros" };
    }

    if (normalized === "samsung") {
        return { src: "/uploads/sources/samsung.svg", alt: "Samsung", label: "samsung" };
    }

    return null;
}

type Offer = {
    id: string;
    title: string;
    price: number;
    full_name?: string;
    sortPrice: number;
    loading?: boolean;
    url: string;
    imageUrl: string;
    images?: { src: string; alt?: string }[];
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

function RetailerLogo({ source }: { source: string }) {
    const sourceLogo = getSourceLogo(source);

    return (
        <div className="flex min-w-[132px] flex-col items-start gap-2">
            {sourceLogo ? (
                <div className="relative h-[46px] w-[132px] overflow-hidden bg-white">
                    <Image src={sourceLogo.src} alt={sourceLogo.alt} fill sizes="132px" className="object-contain" />
                </div>
            ) : (
                <span className="text-[13px] font-semibold text-[#111827]">{source}</span>
            )}
        </div>
    );
}

export default function OfferComparisonTable() {
    const router = useRouter();
    const { product, loading, offers, offersLoading, offerCount } = useProduct();
    const { t } = useLanguage();

    const [availableImmediately, setAvailableImmediately] = React.useState(false);
    const [noReturnShippingCosts, setNoReturnShippingCosts] = React.useState(false);
    const [sortKey, setSortKey] = React.useState<"price" | "total">("price");
    const [visible, setVisible] = React.useState(10);

    if (offersLoading || (loading && !(offers || []).length)) return <OfferComparisonTableSkeleton />;

    const sourceOffers = (offers || []).length ? offers : product ? [product] : [];
    const selectedProductKey = getProductKey({
        product_url: product?.product_url,
        source: product?.source,
    });
    const selectedProductImage = String(product?.images?.[0]?.src || product?.image_url || "").trim();

    const offerRows: Offer[] = sourceOffers
        .map((p: any, idx: number) => {
            const parsedPrice = parseAED(p?.price ?? p?.currentPrice);
            const livePrice = typeof p?.liveNumericPrice === "number" ? p.liveNumericPrice : null;
            const price = livePrice ?? parsedPrice;
            if (!price) return null;

            const sortPrice =
                typeof p?.initialNumericPrice === "number" && p.initialNumericPrice > 0
                    ? p.initialNumericPrice
                    : typeof p?.numericPrice === "number" && p.numericPrice > 0
                        ? p.numericPrice
                        : price;
            const source = normalizeSourceName(p?.source || product?.source || "");

            return {
                id: String(p?._id || p?.product_url || idx),
                title: String(
                    p?.product_name ||
                    p?.title ||
                    t("singleProduct.offerComparisonTable.offerFallback", "Offer")
                ),
                full_name: p.full_name || "",
                price,
                sortPrice,
                loading: Boolean(p?.livePriceLoading),
                url: String(p?.product_url || "#"),
                imageUrl: String(p?.image_url || p?.images?.[0]?.src || ""),
                images: Array.isArray(p?.images) ? p.images : [],
                available: true,
                source: source || "unknown",
            } as Offer;
        })
        .filter(Boolean) as Offer[];

    function getTopProductImage(row: Offer): string {
        if (
            selectedProductKey &&
            row.source === "sharafdg" &&
            getProductKey({ product_url: row.url, source: row.source }) === selectedProductKey &&
            selectedProductImage
        ) {
            return selectedProductImage;
        }

        return resolvePreferredProductImage({
            source: row.source,
            image_url: row.imageUrl,
            images: row.images,
            title: row.title,
        });
    }

    const totalOffersCount = Math.max(1, offerCount || offerRows.length);

    if (totalOffersCount <= 0) return null;
    if (!offerRows.length) return null;

    const sorted = [...offerRows].sort((a, b) => {
        const aKey = sortKey === "total" ? a.sortPrice : a.sortPrice;
        const bKey = sortKey === "total" ? b.sortPrice : b.sortPrice;
        return aKey - bKey;
    });

    const filtered = availableImmediately ? sorted.filter((o) => o.available) : sorted;
    const cheapest = filtered.length ? Math.min(...filtered.map((o) => o.price)) : 0;
    const ordered = filtered;
    const top10 = sorted.slice(0, 10);

    return (
        <section>
            <div className="py-6">
                <div className="hidden lg:block text-[28px] font-semibold text-[#111827] mb-4">
                    {t("singleProduct.offerComparisonTable.title", "Price comparison")}
                </div>

                <div className="lg:hidden mb-3">
                    <div className="text-[22px] leading-none font-semibold text-[#111827] mt-1">
                        {totalOffersCount} {t("singleProduct.offerComparisonTable.offersAvailable", "Offers")}
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
                                            router.push(
                                                `/product/${encodeURIComponent(p.url)}?product_name=${encodeURIComponent(p.title)}&source=${encodeURIComponent(p.source)}`
                                            );
                                        }}
                                    >
                                        <div className="w-6 text-center text-[13px] font-semibold text-[#111827]">
                                            {idx + 1}
                                        </div>

                                        <div className="w-[34px] h-[34px] rounded border border-[#e5e7eb] bg-white relative overflow-hidden">
                                            {!!getTopProductImage(p) && (
                                                <Image
                                                    src={getTopProductImage(p)}
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
                                                <span className="text-[#6b7280]">
                                                    {t("singleProduct.offerComparisonTable.from", "from")} {" "}
                                                </span>
                                                <PriceText price={p.price} loading={p.loading} className="font-semibold" />
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
                                    <span className="text-[12px] text-[#111827]">
                                        {t("singleProduct.offerComparisonTable.sortBy", "Sort by:")}
                                    </span>
                                    <ButtonPill active={sortKey === "price"} onClick={() => setSortKey("price")}>
                                        {t("singleProduct.offerComparisonTable.sort.price", "Price")}
                                    </ButtonPill>
                                    <ButtonPill active={sortKey === "total"} onClick={() => setSortKey("total")}>
                                        {t("singleProduct.offerComparisonTable.sort.totalPrice", "Total price")}
                                    </ButtonPill>
                                </div>
                            </div>

                            <div className="hidden lg:grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] gap-4 px-3 py-2 text-[12px] font-semibold text-[#111827] border-b border-[#e5e7eb]">
                                <div>{t("singleProduct.offerComparisonTable.columns.offerTitle", "Offer title")}</div>
                                <div>Price</div>
                                <div>{t("singleProduct.offerComparisonTable.columns.shopReview", "Shop & Shop Review")}</div>
                                <div className="text-right"></div>
                            </div>

                            <div className="divide-y divide-[#e5e7eb]">
                                {ordered.slice(0, visible).map((o) => {
                                    const isCheapest = o.price === cheapest;
                                    return (
                                        <div key={o.id} className="p-3">
                                            <div className="hidden lg:grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] gap-4 items-start">
                                                <div className="min-w-0">
                                                    <div className="text-[13px] font-semibold text-[#111827]">
                                                        <a href={o.url} target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline">
                                                            {o.full_name || o.title}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div>
                                                    {isCheapest ? (
                                                        <div className="mb-2 inline-block border border-[#fb923c] text-[#ea580c] text-[12px] font-semibold px-2 py-1 rounded-sm">
                                                            {t("singleProduct.offerComparisonTable.cheapestTotalPrice", "Cheapest total price")}
                                                        </div>
                                                    ) : null}
                                                    <div className="text-[20px] font-semibold text-[#111827] leading-tight">
                                                        <PriceText price={o.price} loading={o.loading} />
                                                    </div>
                                                </div>

                                                <RetailerLogo source={o.source} />

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

                                                <div className="mt-3 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="text-[20px] font-semibold text-[#111827] leading-tight">
                                                            <PriceText price={o.price} loading={o.loading} />
                                                        </div>
                                                    </div>
                                                    <RetailerLogo source={o.source} />
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
                                                        <span className="text-[#1a73e8] leading-none" aria-hidden="true">
                                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                                                                <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>
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


