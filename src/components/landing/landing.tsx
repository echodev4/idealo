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
};

type LandingData = {
    iphoneDeals: LandingProduct[];
    dairyProducts: LandingProduct[];
    fashionProducts: LandingProduct[];
};

function normalizeProducts(items: LandingProduct[]) {
    return (items || []).map((p) => {
        const numericPrice = Number(String(p.price).replace(/[^\d.]/g, "")) || undefined;
        const numericOldPrice = p.old_price
            ? Number(String(p.old_price).replace(/[^\d.]/g, "")) || undefined
            : undefined;

        return { ...p, numericPrice, numericOldPrice };
    });
}

export default function Landing() {
    const [loading, setLoading] = useState(true);
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
            } catch (e) {
                if (!alive) return;
                setData({ iphoneDeals: [], dairyProducts: [], fashionProducts: [] });
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



