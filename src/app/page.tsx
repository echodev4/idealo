"use client";

import React, { useEffect, useState } from "react";

import HeroCircles from "@/components/sections/hero-circles";
import CurrentDeals_ from "@/components/sections/current-deals";
import BestsellersGrid from "@/components/sections/bestsellers-grid";
import MatchingCategories from "@/components/sections/matching-categories";
import MatchingProducts from "@/components/sections/matching-products";
import TrendingNow from "@/components/sections/trending-now";
import TopCategories from "@/components/sections/top-categories";

function cleanPrice(p?: string): number {
  return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

export interface Product {
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
  created_at?: string;
  updated_at?: string;

  // derived (frontend-only)
  numericPrice?: number;
  numericOldPrice?: number;
}

/* ======================
   PAGE
====================== */

export default function HomePage() {
  const [landingData, setLandingData] = useState<{
    iphoneDeals: Product[];
    dairyProducts: Product[];
    fashionProducts: Product[];
  }>({
    iphoneDeals: [],
    dairyProducts: [],
    fashionProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLandingProducts() {
      try {
        const res = await fetch("/api/landing", {
          cache: "no-store",
        });

        const data: {
          iphoneDeals?: Product[];
          dairyProducts?: Product[];
          fashionProducts?: Product[];
        } = await res.json();

        if (!isMounted) return;


        function mapProducts(apiProducts: Product[]): Product[] {
          return apiProducts
            .filter(
              (p) =>
                p.product_name &&
                p.image_url &&
                p.product_url
            )
            .map((p) => {
              const numericPrice = cleanPrice(p.price);
              const numericOldPrice = cleanPrice(p.old_price);

              return {
                ...p,
                numericPrice,
                numericOldPrice,
              };
            });
        }

        setLandingData({
          iphoneDeals: mapProducts(data.iphoneDeals || []),
          dairyProducts: mapProducts(data.dairyProducts || []),
          fashionProducts: mapProducts(data.fashionProducts || []),
        });

      } catch (err) {
        console.error("Failed to load landing products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLandingProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">

      <main id="main" className="flex-1">
        <section className="bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <HeroCircles />
              </div>
            </div>
          </div>
        </section>

        <CurrentDeals_
          products={landingData.iphoneDeals}
          loading={loading}
        />

        <BestsellersGrid
          products={landingData.dairyProducts}
          loading={loading}
        />

        <MatchingCategories />

        <MatchingProducts
          products={landingData.fashionProducts}
          loading={loading}
        />

        <TrendingNow />
        <TopCategories />
      </main>
    </div>
  );
}
