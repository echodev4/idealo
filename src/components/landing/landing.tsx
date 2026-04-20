"use client";

import { useEffect, useState } from "react";
import HeroTeaser from "@/components/landing/hero-teaser";
import NewsletterCTA from "@/components/landing/newsletter-cta";
import BestsellersCarousel from "@/components/landing/bestsellers-carousel";
import RelatedCategories from "@/components/landing/related-categories";
import TrendingProducts from "@/components/landing/trending-products";

type LandingProduct = {
    _id: string;
    product_url: string;
    source: string;
    product_name: string;
    image_url: string;
    price: string;
    old_price?: string;
    discount?: string;
    reviews?: string;
    average_rating?: number | null;
    numericPrice?: number;
    numericOldPrice?: number;
    liveNumericPrice?: number;
    livePriceLoading?: boolean;
};

type LandingData = {
    iphoneDeals: LandingProduct[];
    dairyProducts: LandingProduct[];
    fashionProducts: LandingProduct[];
};

function parsePrice(value?: string) {
    return Number(String(value || "").replace(/[^\d.]/g, "")) || undefined;
}

function getProductKey(product: LandingProduct) {
    return `${product.product_url}::${product.source || ""}`;
}

function normalizeLivePriceSource(source?: string) {
    const value = String(source || "").trim().toLowerCase();
    if (value === "noon") return "noon";
    if (value === "carrefour" || value === "carrefouruae") return "carrefour";
    return "";
}

function normalizeProducts(items: LandingProduct[]) {
    return (items || []).map((p) => {
        const numericPrice = parsePrice(p.price);
        const numericOldPrice = parsePrice(p.old_price);

        return { ...p, numericPrice, numericOldPrice };
    });
}

function getUniqueRefreshGroups(data: LandingData) {
    const seen = new Set<string>();

    const unique = (items: LandingProduct[], limit: number) =>
        items.slice(0, limit).filter((product) => {
            if (!product.product_url || !normalizeLivePriceSource(product.source)) return false;

            const key = getProductKey(product);
            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });

    return [
        unique(data.iphoneDeals, 12),
        unique(data.dairyProducts, 12),
        unique(data.fashionProducts, 18),
    ].filter((group) => group.length > 0);
}

function updateLandingProduct(
    data: LandingData,
    productKey: string,
    updater: (product: LandingProduct) => LandingProduct
): LandingData {
    const updateList = (items: LandingProduct[]) =>
        items.map((item) => (getProductKey(item) === productKey ? updater(item) : item));

    return {
        iphoneDeals: updateList(data.iphoneDeals),
        dairyProducts: updateList(data.dairyProducts),
        fashionProducts: updateList(data.fashionProducts),
    };
}

export default function Landing() {
    const [loading, setLoading] = useState(true);
    const [loadedVersion, setLoadedVersion] = useState(0);
    const [data, setData] = useState<LandingData>({
        iphoneDeals: [],
        dairyProducts: [],
        fashionProducts: [],
    });

    useEffect(() => {
        let alive = true;

        async function run() {
            try {
                setLoading(true);
                const res = await fetch("/api/landing", { cache: "no-store" });
                const json = (await res.json()) as LandingData;

                if (!alive) return;

                setData({
                    iphoneDeals: normalizeProducts(json.iphoneDeals),
                    dairyProducts: normalizeProducts(json.dairyProducts),
                    fashionProducts: normalizeProducts(json.fashionProducts),
                });
                setLoadedVersion((version) => version + 1);
            } catch (e) {
                if (!alive) return;
                setData({ iphoneDeals: [], dairyProducts: [], fashionProducts: [] });
                setLoadedVersion((version) => version + 1);
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (!loadedVersion) return;

        const controller = new AbortController();
        let stopped = false;
        const refreshGroups = getUniqueRefreshGroups(data);

        async function refreshLandingPrices() {
            for (const group of refreshGroups) {
                if (stopped || controller.signal.aborted) return;

                const refreshKeys = new Set(group.map(getProductKey));
                setData((current) =>
                    refreshKeys.size
                        ? {
                            iphoneDeals: current.iphoneDeals.map((item) =>
                                refreshKeys.has(getProductKey(item)) ? { ...item, livePriceLoading: true } : item
                            ),
                            dairyProducts: current.dairyProducts.map((item) =>
                                refreshKeys.has(getProductKey(item)) ? { ...item, livePriceLoading: true } : item
                            ),
                            fashionProducts: current.fashionProducts.map((item) =>
                                refreshKeys.has(getProductKey(item)) ? { ...item, livePriceLoading: true } : item
                            ),
                        }
                        : current
                );

                await Promise.allSettled(
                    group.map(async (product) => {
                        const productKey = getProductKey(product);
                        const liveSource = normalizeLivePriceSource(product.source);

                        try {
                            const res = await fetch("/api/live-price", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                cache: "no-store",
                                signal: controller.signal,
                                body: JSON.stringify({
                                    product_url: product.product_url,
                                    source: liveSource,
                                }),
                            });

                            const json = await res.json();

                            if (!res.ok || json?.success === false || !json?.currentPrice) {
                                throw new Error(json?.error || "Live price could not be fetched");
                            }

                            if (stopped || controller.signal.aborted) return;

                            const nextPrice = String(json.currentPrice);
                            const nextOldPrice =
                                typeof json?.previousPrice === "string" && json.previousPrice.trim()
                                    ? json.previousPrice
                                    : product.old_price;
                            const nextDiscount =
                                typeof json?.discountPercentage === "string" && json.discountPercentage.trim()
                                    ? json.discountPercentage
                                    : product.discount;
                            const nextNumericPrice = parsePrice(nextPrice);
                            const nextNumericOldPrice = parsePrice(nextOldPrice);

                            setData((current) =>
                                updateLandingProduct(current, productKey, (item) => ({
                                    ...item,
                                    price: nextPrice,
                                    old_price: nextOldPrice,
                                    discount: nextDiscount,
                                    numericPrice: nextNumericPrice || item.numericPrice,
                                    numericOldPrice: nextNumericOldPrice || item.numericOldPrice,
                                    liveNumericPrice: nextNumericPrice || item.liveNumericPrice,
                                    livePriceLoading: false,
                                }))
                            );
                        } catch (err: any) {
                            if (err?.name === "AbortError" || stopped || controller.signal.aborted) return;

                            console.error("Landing live price refresh error:", product.product_url, err);
                            setData((current) =>
                                updateLandingProduct(current, productKey, (item) => ({
                                    ...item,
                                    livePriceLoading: false,
                                }))
                            );
                        }
                    })
                );
            }
        }

        refreshLandingPrices();

        return () => {
            stopped = true;
            controller.abort();
        };
    }, [loadedVersion]);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <main className="pb-16 md:pb-0">
                <HeroTeaser products={data.iphoneDeals} loading={loading} />
                <BestsellersCarousel
                    fallbackTitle="Dairy deals"
                    products={data.dairyProducts}
                    loading={loading}
                />
                <NewsletterCTA />
                <RelatedCategories products={data.fashionProducts} loading={loading} />
                <TrendingProducts />
            </main>
        </div>
    );
}
