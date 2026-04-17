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
    liveNumericPrice?: number;
    livePriceLoading?: boolean;
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
    liveNumericPrice?: number;
    livePriceLoading?: boolean;
}

type LivePriceResult = {
    currentPrice: string;
    previousPrice?: string;
    discountPercentage?: string;
};

function cleanPrice(p?: string | number | null): number {
    return Number(String(p || "").replace(/[^\d.]/g, "")) || 0;
}

function normalizeSource(source: any): string {
    return String(source || "").trim().toLowerCase();
}

function normalizeLivePriceSource(source?: string) {
    const value = normalizeSource(source);
    if (value === "noon") return "noon";
    if (value === "carrefour" || value === "carrefouruae") return "carrefour";
    return "";
}

function getProductKey(product: { product_url?: string; source?: string }) {
    return `${product.product_url || ""}::${normalizeSource(product.source)}`;
}

function toText(value: any): string {
    if (value === null || value === undefined) return "";
    return String(value);
}

function normalizeListProduct(item: any): OfferProduct {
    return {
        _id: String(item?._id || ""),
        product_url: String(item?.product_url || ""),
        source: String(item?.source || ""),
        product_name: String(item?.product_name || item?.title || ""),
        image_url: String(item?.image_url || item?.images?.[0]?.src || ""),
        price: String(item?.price ?? item?.currentPrice ?? ""),
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
            item?.reviews !== undefined && item?.reviews !== null ? item.reviews : "",
        average_rating:
            typeof item?.average_rating === "number"
                ? item.average_rating
                : typeof item?.rating === "number"
                    ? item.rating
                    : null,
        created_at: typeof item?.created_at === "string" ? item.created_at : "",
        updated_at: typeof item?.updated_at === "string" ? item.updated_at : "",
        match_score:
            typeof item?.match_score === "number" ? item.match_score : undefined,
        faiss_score:
            typeof item?.faiss_score === "number" ? item.faiss_score : undefined,
        numericPrice: cleanPrice(item?.price ?? item?.currentPrice),
        numericOldPrice: cleanPrice(item?.old_price ?? item?.previousPrice),
    };
}

async function fetchLivePrice(
    productUrl: string,
    source: string,
    signal: AbortSignal
): Promise<LivePriceResult | null> {
    const liveSource = normalizeLivePriceSource(source);
    if (!productUrl || !liveSource) return null;

    const res = await fetch("/api/live-price", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
        signal,
        body: JSON.stringify({
            product_url: productUrl,
            source: liveSource,
        }),
    });

    const json = await res.json();

    if (!res.ok || json?.success === false || !json?.currentPrice) {
        throw new Error(json?.error || "Live price could not be fetched");
    }

    return {
        currentPrice: String(json.currentPrice),
        previousPrice: toText(json.previousPrice),
        discountPercentage: toText(json.discountPercentage),
    };
}

function applyLivePriceToListItem<T extends OfferProduct | RelatedProduct>(
    item: T,
    live: LivePriceResult
): T {
    const nextPreviousPrice = live.previousPrice?.trim() ? live.previousPrice : item.old_price;
    const nextDiscount = live.discountPercentage?.trim() ? live.discountPercentage : item.discount;

    return {
        ...item,
        price: live.currentPrice,
        old_price: nextPreviousPrice,
        discount: nextDiscount,
        liveNumericPrice: cleanPrice(live.currentPrice),
        livePriceLoading: false,
    };
}

function setLiveLoadingOnList<T extends OfferProduct | RelatedProduct>(
    items: T[],
    productKey: string,
    loading: boolean
): T[] {
    return items.map((item) =>
        getProductKey(item) === productKey ? { ...item, livePriceLoading: loading } : item
    );
}

interface ProductContextType {
    product: any | null;
    loading: boolean;

    offers: OfferProduct[];
    offersLoading: boolean;
    offerCount: number;

    relatedProducts: RelatedProduct[];
    relatedLoading: boolean;
    variantCount: number;

    isMobileProduct: boolean;
    productCase: string;
}

const ProductContext = createContext<ProductContextType>({
    product: null,
    loading: true,

    offers: [],
    offersLoading: true,
    offerCount: 0,

    relatedProducts: [],
    relatedLoading: true,
    variantCount: 0,

    isMobileProduct: false,
    productCase: "unknown",
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
    const [offerCount, setOfferCount] = useState(0);

    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [variantCount, setVariantCount] = useState(0);

    const [isMobileProduct, setIsMobileProduct] = useState(false);
    const [productCase, setProductCase] = useState("unknown");

    useEffect(() => {
        let active = true;
        const liveController = new AbortController();

        async function fetchProduct() {
            if (!productUrl) {
                setProduct(null);
                setLoading(false);
                return null;
            }

            try {
                setLoading(true);

                const url = `/api/product-details?product_url=${encodeURIComponent(
                    productUrl
                )}`;

                const res = await fetch(url, { cache: "no-store" });
                const json = await res.json();

                if (!active) return null;

                if (!res.ok || json?.success === false || !json?.data) {
                    setProduct(null);
                    toast.error("Product details could not be loaded.");
                    return null;
                }

                setProduct(json.data);
                return json.data;
            } catch (err) {
                console.error("Product fetch error:", err);
                if (active) {
                    setProduct(null);
                    toast.error("Product details could not be loaded.");
                }
                return null;
            } finally {
                if (active) setLoading(false);
            }
        }

        async function fetchOffers() {
            if (!productUrl) {
                setOffers([]);
                setOfferCount(0);
                setOffersLoading(false);
                setIsMobileProduct(false);
                setProductCase("unknown");
                return [];
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
                    }),
                });

                const json = await res.json();

                if (!active) return [];

                if (!res.ok || json?.success === false) {
                    setOffers([]);
                    setOfferCount(0);
                    setIsMobileProduct(false);
                    setProductCase("unknown");
                    return [];
                }

                const apiOffers = Array.isArray(json?.offers) ? json.offers : [];

                const mapped = apiOffers
                    .map(normalizeListProduct)
                    .filter((p: any) => p.product_name && p.image_url && p.product_url);

                setOffers(mapped);
                setOfferCount(Number(json?.offer_count || 0));
                setIsMobileProduct(Boolean(json?.is_mobile_product));
                setProductCase(
                    typeof json?.product_case === "string" ? json.product_case : "unknown"
                );
                return mapped;
            } catch (err) {
                console.error("Offers fetch error:", err);
                if (active) {
                    setOffers([]);
                    setOfferCount(0);
                    setIsMobileProduct(false);
                    setProductCase("unknown");
                }
                return [];
            } finally {
                if (active) setOffersLoading(false);
            }
        }

        async function fetchRelatedProducts() {
            if (!productUrl) {
                setRelatedProducts([]);
                setVariantCount(0);
                setRelatedLoading(false);
                return [];
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
                    }),
                });

                const json = await res.json();

                if (!active) return [];

                if (!res.ok || json?.success === false) {
                    setRelatedProducts([]);
                    setVariantCount(0);
                    return [];
                }

                const apiRelated = Array.isArray(json?.products) ? json.products : [];

                const mapped = apiRelated
                    .map(normalizeListProduct)
                    .filter((p: any) => p.product_name && p.image_url && p.product_url);

                setRelatedProducts(mapped);
                setVariantCount(Number(json?.variant_count || 0));

                if (typeof json?.product_case === "string") {
                    setProductCase(json.product_case);
                }

                if (typeof json?.is_mobile_product === "boolean") {
                    setIsMobileProduct(json.is_mobile_product);
                }

                return mapped;
            } catch (err) {
                console.error("Related products fetch error:", err);
                if (active) {
                    setRelatedProducts([]);
                    setVariantCount(0);
                }
                return [];
            } finally {
                if (active) setRelatedLoading(false);
            }
        }

        async function refreshOneProduct(selectedProduct: any | null) {
            if (!selectedProduct || !selectedProduct.product_url) return;

            const source = selectedProduct.source || sourceName || "";
            if (!normalizeLivePriceSource(source)) return;

            setProduct((current: any) => current ? { ...current, livePriceLoading: true } : current);

            try {
                const live = await fetchLivePrice(
                    selectedProduct.product_url,
                    source,
                    liveController.signal
                );

                if (!active || liveController.signal.aborted || !live) return;

                setProduct((current: any) => {
                    if (!current) return current;

                    return {
                        ...current,
                        currentPrice: live.currentPrice,
                        price: live.currentPrice,
                        previousPrice: live.previousPrice?.trim() ? live.previousPrice : current.previousPrice,
                        old_price: live.previousPrice?.trim() ? live.previousPrice : current.old_price,
                        discount: live.discountPercentage?.trim() ? live.discountPercentage : current.discount,
                        discountPercentage: live.discountPercentage?.trim()
                            ? live.discountPercentage
                            : current.discountPercentage,
                        liveNumericPrice: cleanPrice(live.currentPrice),
                        livePriceLoading: false,
                    };
                });
            } catch (err: any) {
                if (err?.name !== "AbortError" && active && !liveController.signal.aborted) {
                    console.error("Selected product live price refresh error:", selectedProduct.product_url, err);
                    setProduct((current: any) => current ? { ...current, livePriceLoading: false } : current);
                }
            }
        }

        async function refreshRelatedProducts(items: RelatedProduct[]) {
            const seen = new Set<string>();

            for (const item of items) {
                if (!active || liveController.signal.aborted) break;
                if (!normalizeLivePriceSource(item.source)) continue;

                const productKey = getProductKey(item);
                if (!productKey || seen.has(productKey)) continue;
                seen.add(productKey);

                setRelatedProducts((current) => setLiveLoadingOnList(current, productKey, true));

                try {
                    const live = await fetchLivePrice(item.product_url, item.source, liveController.signal);
                    if (!active || liveController.signal.aborted || !live) break;

                    setRelatedProducts((current) =>
                        current.map((product) =>
                            getProductKey(product) === productKey
                                ? applyLivePriceToListItem(product, live)
                                : product
                        )
                    );
                } catch (err: any) {
                    if (err?.name === "AbortError" || !active || liveController.signal.aborted) break;

                    console.error("Variant live price refresh error:", item.product_url, err);
                    setRelatedProducts((current) => setLiveLoadingOnList(current, productKey, false));
                }
            }
        }

        async function refreshOffers(items: OfferProduct[]) {
            const seen = new Set<string>();

            for (const item of items) {
                if (!active || liveController.signal.aborted) break;
                if (!normalizeLivePriceSource(item.source)) continue;

                const productKey = getProductKey(item);
                if (!productKey || seen.has(productKey)) continue;
                seen.add(productKey);

                setOffers((current) => setLiveLoadingOnList(current, productKey, true));

                try {
                    const live = await fetchLivePrice(item.product_url, item.source, liveController.signal);
                    if (!active || liveController.signal.aborted || !live) break;

                    setOffers((current) =>
                        current.map((product) =>
                            getProductKey(product) === productKey
                                ? applyLivePriceToListItem(product, live)
                                : product
                        )
                    );
                } catch (err: any) {
                    if (err?.name === "AbortError" || !active || liveController.signal.aborted) break;

                    console.error("Offer live price refresh error:", item.product_url, err);
                    setOffers((current) => setLiveLoadingOnList(current, productKey, false));
                }
            }
        }

        async function run() {
            const [selectedProduct, related, offerItems] = await Promise.all([
                fetchProduct(),
                fetchRelatedProducts(),
                fetchOffers(),
            ]);

            if (!active || liveController.signal.aborted) return;

            await refreshOneProduct(selectedProduct);
            await refreshRelatedProducts(related as RelatedProduct[]);
            await refreshOffers(offerItems as OfferProduct[]);
        }

        run();

        return () => {
            active = false;
            liveController.abort();
        };
    }, [productUrl, productName, sourceName]);

    return (
        <ProductContext.Provider
            value={{
                product,
                loading,
                offers,
                offersLoading,
                offerCount,
                relatedProducts,
                relatedLoading,
                variantCount,
                isMobileProduct,
                productCase,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    return useContext(ProductContext);
}
