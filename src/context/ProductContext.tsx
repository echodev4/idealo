"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import toast from "react-hot-toast";

export interface OfferProduct {
    product_url: string;
    _id: string;
    source: string;
    product_name: string;
    image_url: string;
    price: string;
    old_price?: string;
    discount?: string;
    reviews?: string | number;
    average_rating?: number | null;
    created_at?: string;
    updated_at?: string;
    match_score?: number;
    match_signals?: {
        title_ratio?: number;
        title_token_jaccard?: number;
        combined_token_jaccard?: number;
        spec_overlap?: number;
        price_similarity?: number;
        penalty?: number;
    };

    // derived (frontend-only)
    numericPrice?: number;
    numericOldPrice?: number;
}

function cleanPrice(p?: string | number | null): number {
    return Number(String(p || "").replace(/[^\d.]/g, "")) || 0;
}

interface ProductContextType {
    product: any | null;
    loading: boolean;

    offers: OfferProduct[];
    offersLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({
    product: null,
    loading: true,

    offers: [],
    offersLoading: true,
});

export function ProductProvider({
    productUrl,
    productName,
    sourceName,
    children,
}: {
    productUrl: string;
    productName?: string;
    sourceName?: string;
    children: React.ReactNode;
}) {
    const [product, setProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const [offers, setOffers] = useState<OfferProduct[]>([]);
    const [offersLoading, setOffersLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function fetchProduct() {
            try {
                setLoading(true);

                let url = "";

                if (sourceName === "noon") {
                    url = `/api/product-details?product_url=${encodeURIComponent(
                        productUrl
                    )}`;
                } else {
                    url = `/api/single-product?product_url=${encodeURIComponent(
                        productUrl
                    )}&sourceName=${encodeURIComponent(sourceName || "")}`;
                }

                const res = await fetch(url, { cache: "no-store" });
                const json = await res.json();

                if (!res.ok || json?.success === false) {
                    toast.error("Live scraping failed. Please try again later.");
                    return;
                }

                if (!active) return;

                if (sourceName === "noon" && json?.success && json?.data) {
                    setProduct(json.data);
                    return;
                }

                if (sourceName !== "noon" && json?.success && json?.scraped?.data) {
                    setProduct(json.scraped.data);
                    return;
                }

                setProduct(null);
            } catch (err) {
                console.error("❌ Product fetch error:", err);
                if (active) setProduct(null);
            } finally {
                if (active) setLoading(false);
            }
        }

        async function fetchOffers() {
            if (!productUrl) {
                setOffers([]);
                setOffersLoading(false);
                return;
            }

            try {
                setOffersLoading(true);

                const res = await fetch("/api/product-offers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                    body: JSON.stringify({
                        product_url: productUrl,
                        source: sourceName || "",
                        limit: 20,
                    }),
                });

                const json = await res.json();

                if (!active) return;

                if (!res.ok || json?.success === false) {
                    setOffers([]);
                    return;
                }

                const apiOffers: OfferProduct[] = json.offers || [];

                const mapped: OfferProduct[] = apiOffers
                    .filter(
                        (p) =>
                            p?.product_name &&
                            p?.image_url &&
                            p?.product_url
                    )
                    .map((p) => ({
                        ...p,
                        numericPrice: cleanPrice(p.price),
                        numericOldPrice: cleanPrice(p.old_price),
                    }));

                setOffers(mapped);
            } catch (err) {
                console.error("❌ Offers fetch error:", err);
                if (active) setOffers([]);
            } finally {
                if (active) setOffersLoading(false);
            }
        }

        fetchProduct();
        fetchOffers();

        return () => {
            active = false;
        };
    }, [productUrl, productName, sourceName]);

    return (
        <ProductContext.Provider
            value={{
                product,
                loading,
                offers,
                offersLoading,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    return useContext(ProductContext);
}