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
    faiss_score?: number;
    numericPrice?: number;
    numericOldPrice?: number;
}

export interface RelatedProduct {
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
    faiss_score?: number;
    numericPrice?: number;
    numericOldPrice?: number;
}

function cleanPrice(p?: string | number | null): number {
    return Number(String(p || "").replace(/[^\d.]/g, "")) || 0;
}

function normalizeListProduct(item: any): OfferProduct {
    return {
        _id: String(item?._id || ""),
        product_url: String(item?.product_url || ""),
        source: String(item?.source || ""),
        product_name: String(
            item?.product_name || item?.title || ""
        ),
        image_url: String(
            item?.image_url ||
            item?.images?.[0]?.src ||
            ""
        ),
        price: String(
            item?.price ??
            item?.currentPrice ??
            ""
        ),
        old_price:
            item?.old_price !== undefined && item?.old_price !== null
                ? String(item.old_price)
                : item?.previousPrice !== undefined && item?.previousPrice !== null
                    ? String(item.previousPrice)
                    : "",
        discount:
            item?.discount !== undefined && item?.discount !== null
                ? String(item.discount)
                : "",
        reviews:
            item?.reviews !== undefined && item?.reviews !== null
                ? item.reviews
                : "",
        average_rating:
            typeof item?.average_rating === "number"
                ? item.average_rating
                : typeof item?.rating === "number"
                    ? item.rating
                    : null,
        created_at:
            typeof item?.created_at === "string" ? item.created_at : "",
        updated_at:
            typeof item?.updated_at === "string" ? item.updated_at : "",
        match_score:
            typeof item?.match_score === "number" ? item.match_score : undefined,
        faiss_score:
            typeof item?.faiss_score === "number" ? item.faiss_score : undefined,
        numericPrice: cleanPrice(item?.price ?? item?.currentPrice),
        numericOldPrice: cleanPrice(item?.old_price ?? item?.previousPrice),
    };
}

interface ProductContextType {
    product: any | null;
    loading: boolean;

    offers: OfferProduct[];
    offersLoading: boolean;

    relatedProducts: RelatedProduct[];
    relatedLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({
    product: null,
    loading: true,

    offers: [],
    offersLoading: true,

    relatedProducts: [],
    relatedLoading: true,
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

    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function fetchProduct() {
            if (!productUrl) {
                setProduct(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const url = `/api/product-details?product_url=${encodeURIComponent(
                    productUrl
                )}`;

                const res = await fetch(url, { cache: "no-store" });
                const json = await res.json();

                if (!active) return;

                if (!res.ok || json?.success === false || !json?.data) {
                    setProduct(null);
                    toast.error("Product details could not be loaded.");
                    return;
                }

                setProduct(json.data);
            } catch (err) {
                console.error("Product fetch error:", err);
                if (active) {
                    setProduct(null);
                    toast.error("Product details could not be loaded.");
                }
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
                        limit: 10,
                    }),
                });

                const json = await res.json();

                if (!active) return;

                if (!res.ok || json?.success === false) {
                    setOffers([]);
                    return;
                }

                const apiOffers = Array.isArray(json?.offers) ? json.offers : [];

                const mapped = apiOffers
                    .map(normalizeListProduct)
                    .filter(
                        (p:any) => p.product_name && p.image_url && p.product_url
                    );

                setOffers(mapped);
            } catch (err) {
                console.error("Offers fetch error:", err);
                if (active) setOffers([]);
            } finally {
                if (active) setOffersLoading(false);
            }
        }

        async function fetchRelatedProducts() {
            if (!productUrl) {
                setRelatedProducts([]);
                setRelatedLoading(false);
                return;
            }

            try {
                setRelatedLoading(true);

                const res = await fetch("/api/product-variants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                    body: JSON.stringify({
                        product_url: productUrl,
                        source: sourceName || "",
                        product_name: productName || "",
                        limit: 10,
                    }),
                });

                const json = await res.json();

                if (!active) return;

                if (!res.ok || json?.success === false) {
                    setRelatedProducts([]);
                    return;
                }

                const apiRelated = Array.isArray(json?.products) ? json.products : [];

                const mapped = apiRelated
                    .map(normalizeListProduct)
                    .filter(
                        (p:any) => p.product_name && p.image_url && p.product_url
                    );

                setRelatedProducts(mapped);
            } catch (err) {
                console.error("Related products fetch error:", err);
                if (active) setRelatedProducts([]);
            } finally {
                if (active) setRelatedLoading(false);
            }
        }

        fetchProduct();
        fetchOffers();
        fetchRelatedProducts();

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
                relatedProducts,
                relatedLoading,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    return useContext(ProductContext);
}