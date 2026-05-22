"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";
import {
    normalizeProductSource,
    PRODUCT_PLACEHOLDER_SRC,
    resolvePrimaryProductImage,
    resolveProductImages,
} from "@/lib/products/imageFallback";
import { formatProductDisplayName } from "@/lib/products/displayName";

type ProductImage = {
    src: string;
    alt?: string;
};

export interface OfferProduct {
    product_url: string;
    _id: string;
    source: string;
    product_name: string;
    full_name?: string;
    image_url: string;
    images?: ProductImage[];
    price: string;
    old_price?: string;
    discount?: string;
    reviews?: string | number;
    average_rating?: number | null;
    rating?: string;
    ratingCount?: string;
    created_at?: string;
    updated_at?: string;
    match_score?: number;
    faiss_score?: number;
    numericPrice?: number;
    numericOldPrice?: number;
    initialNumericPrice?: number;
    liveNumericPrice?: number;
    livePriceLoading?: boolean;
}

export interface RelatedProduct {
    product_url: string;
    _id: string;
    source: string;
    product_name: string;
    image_url: string;
    images?: ProductImage[];
    price: string;
    old_price?: string;
    discount?: string;
    reviews?: string | number;
    average_rating?: number | null;
    rating?: string;
    ratingCount?: string;
    created_at?: string;
    updated_at?: string;
    match_score?: number;
    faiss_score?: number;
    numericPrice?: number;
    numericOldPrice?: number;
    initialNumericPrice?: number;
    liveNumericPrice?: number;
    livePriceLoading?: boolean;
}

type LivePriceResult = {
    currentPrice: string;
    previousPrice?: string;
    discountPercentage?: string;
    rating?: string;
    ratingCount?: string;
};

function cleanPrice(p?: string | number | null): number {
    return Number(String(p || "").replace(/[^\d.]/g, "")) || 0;
}

function normalizeSource(source: any): string {
    return String(source || "").trim().toLowerCase();
}

function isSharafdgSource(source: any): boolean {
    return normalizeProductSource(source) === "sharafdg";
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

function parseRatingValue(value: any): number | null {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(String(value).replace(/[^\d.]/g, ""));
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.max(0, Math.min(5, n));
}

function normalizeRatingCount(item: any): string {
    return toText(item?.ratingCount || item?.reviews);
}

function getOfferSortPrice(item: {
    initialNumericPrice?: number;
    numericPrice?: number;
    liveNumericPrice?: number;
    price?: string;
    currentPrice?: string;
}) {
    if (typeof item?.initialNumericPrice === "number" && item.initialNumericPrice > 0) {
        return item.initialNumericPrice;
    }

    if (typeof item?.numericPrice === "number" && item.numericPrice > 0) {
        return item.numericPrice;
    }

    if (typeof item?.liveNumericPrice === "number" && item.liveNumericPrice > 0) {
        return item.liveNumericPrice;
    }

    return cleanPrice(item?.price ?? item?.currentPrice);
}

function orderOffersForDisplay<T extends {
    initialNumericPrice?: number;
    numericPrice?: number;
    liveNumericPrice?: number;
    price?: string;
    currentPrice?: string;
}>(items: T[]): T[] {
    return [...items].sort((a, b) => getOfferSortPrice(a) - getOfferSortPrice(b));
}

function normalizeListProduct(item: any): OfferProduct {
    const ratingValue =
        parseRatingValue(item?.average_rating) ?? parseRatingValue(item?.rating);
    const imageUrl = resolvePrimaryProductImage(item);
    const source = String(item?.source || "");
    const images = resolveProductImages(item);

    return {
        _id: String(item?._id || ""),
        product_url: String(item?.product_url || ""),
        source,
        product_name: formatProductDisplayName(item?.product_name || item?.title || "", {
            source,
            category: item?.category,
            specifications: item?.specifications,
        }),
        full_name: item?.product_name || item?.title,
        image_url: imageUrl,
        images,
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
        average_rating: ratingValue,
        rating: toText(item?.rating),
        ratingCount: normalizeRatingCount(item),
        created_at: typeof item?.created_at === "string" ? item.created_at : "",
        updated_at: typeof item?.updated_at === "string" ? item.updated_at : "",
        match_score:
            typeof item?.match_score === "number" ? item.match_score : undefined,
        faiss_score:
            typeof item?.faiss_score === "number" ? item.faiss_score : undefined,
        numericPrice: cleanPrice(item?.price ?? item?.currentPrice),
        numericOldPrice: cleanPrice(item?.old_price ?? item?.previousPrice),
        initialNumericPrice: cleanPrice(item?.price ?? item?.currentPrice),
    };
}

function getDisplayTitle(item: any): string {
    return String(item?.title || item?.product_name || "").trim() || "Product image";
}

function getSharafDisplayImages(item: any): ProductImage[] {
    if (!Array.isArray(item?.display_images) && !Array.isArray(item?.displayImages)) {
        return [];
    }

    const rawImages = Array.isArray(item?.displayImages) ? item.displayImages : item.display_images;
    const fallbackAlt = getDisplayTitle(item);

    return rawImages
        .map((image: any): ProductImage => ({
            src: String(image?.src || "").trim(),
            alt: String(image?.alt || "").trim() || fallbackAlt,
        }))
        .filter((image: ProductImage) => image.src && image.src !== PRODUCT_PLACEHOLDER_SRC);
}

function getUsableImages(item: any): ProductImage[] {
    if (isSharafdgSource(item?.source)) return [];

    const fallbackAlt = getDisplayTitle(item);
    const candidates = Array.isArray(item?.images)
        ? item.images
        : resolveProductImages(item);

    return candidates
        .map((image: any): ProductImage => ({
            src: String(image?.src || "").trim(),
            alt: String(image?.alt || "").trim() || fallbackAlt,
        }))
        .filter((image: ProductImage) => image.src && image.src !== PRODUCT_PLACEHOLDER_SRC);
}

function collectFallbackGalleryImages(items: any[], limit = 4): ProductImage[] {
    const selected: ProductImage[] = [];
    const seen = new Set<string>();

    for (const item of items) {
        for (const image of getUsableImages(item)) {
            if (seen.has(image.src)) continue;
            seen.add(image.src);
            selected.push(image);

            if (selected.length >= limit) {
                return selected;
            }
        }
    }

    return selected;
}

function needsBorrowedImage(item: any): boolean {
    if (!isSharafdgSource(item?.source)) return false;

    const currentImage = String(item?.image_url || item?.images?.[0]?.src || "").trim();
    return !currentImage || currentImage === PRODUCT_PLACEHOLDER_SRC;
}

function applyBorrowedImagesToSharafOffers(
    offerItems: OfferProduct[],
    fallbackImages: ProductImage[]
): OfferProduct[] {
    if (!fallbackImages.length) return offerItems;

    let fallbackIndex = 0;
    let changed = false;

    const updatedOffers = offerItems.map((item) => {
        if (!needsBorrowedImage(item)) return item;

        const fallbackImage = fallbackImages[fallbackIndex % fallbackImages.length];
        fallbackIndex += 1;
        changed = true;

        return {
            ...item,
            image_url: fallbackImage.src,
            images: [fallbackImage],
        };
    });

    return changed ? updatedOffers : offerItems;
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
        rating: toText(json.rating),
        ratingCount: toText(json.ratingCount),
    };
}

function getUniqueLiveItems<T extends OfferProduct | RelatedProduct>(items: T[]): T[] {
    const seen = new Set<string>();
    const unique: T[] = [];

    for (const item of items) {
        if (!normalizeLivePriceSource(item.source)) continue;

        const productKey = getProductKey(item);
        if (!item.product_url || !productKey || seen.has(productKey)) continue;

        seen.add(productKey);
        unique.push(item);
    }

    return unique;
}

function shouldRefreshLiveItem(item: { product_url?: string; source?: string }) {
    return Boolean(item?.product_url && normalizeLivePriceSource(item.source));
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
        const refreshedProductKeys = new Set<string>();

        function updateProductEverywhere(
            productKey: string,
            updater: (item: any) => any
        ) {
            setProduct((current: any) =>
                current && getProductKey(current) === productKey ? updater(current) : current
            );
            setOffers((current) =>
                current.map((item) =>
                    getProductKey(item) === productKey ? updater(item) : item
                )
            );
            setRelatedProducts((current) =>
                current.map((item) =>
                    getProductKey(item) === productKey ? updater(item) : item
                )
            );
        }

        function setProductLoadingEverywhere(productKey: string, loading: boolean) {
            updateProductEverywhere(productKey, (item) => ({
                ...item,
                livePriceLoading: loading,
            }));
        }

        async function refreshLiveItem(item: any, label: string) {
            const productKey = getProductKey(item);
            if (!productKey || !shouldRefreshLiveItem(item)) return;
            if (refreshedProductKeys.has(productKey)) return;

            setProductLoadingEverywhere(productKey, true);

            try {
                const live = await fetchLivePrice(
                    item.product_url,
                    item.source || sourceName || "",
                    liveController.signal
                );

                if (!active || liveController.signal.aborted || !live) return;

                updateProductEverywhere(productKey, (current: any) => {
                    const nextCurrent = {
                        ...current,
                        currentPrice: live.currentPrice,
                        price: live.currentPrice,
                        previousPrice: live.previousPrice?.trim()
                            ? live.previousPrice
                            : current.previousPrice ?? current.old_price,
                        old_price: live.previousPrice?.trim()
                            ? live.previousPrice
                            : current.old_price ?? current.previousPrice,
                        discount: live.discountPercentage?.trim()
                            ? live.discountPercentage
                            : current.discount,
                        discountPercentage: live.discountPercentage?.trim()
                            ? live.discountPercentage
                            : current.discountPercentage,
                        liveNumericPrice: cleanPrice(live.currentPrice),
                        numericPrice: cleanPrice(live.currentPrice),
                        livePriceLoading: false,
                    };

                    const nextRating = parseRatingValue(live.rating);
                    const nextRatingCount = live.ratingCount?.trim()
                        ? live.ratingCount
                        : current.ratingCount || current.reviews;

                    return {
                        ...nextCurrent,
                        average_rating: nextRating ?? current.average_rating,
                        rating: live.rating?.trim() ? live.rating : current.rating,
                        ratingCount: nextRatingCount,
                        reviews: nextRatingCount || current.reviews,
                    };
                });
                refreshedProductKeys.add(productKey);
            } catch (err: any) {
                if (err?.name === "AbortError" || !active || liveController.signal.aborted) return;
                console.error(`${label} live price refresh error:`, item.product_url, err);
                setProductLoadingEverywhere(productKey, false);
            }
        }

        async function refreshLiveItemsSequentially(items: any[], label: string) {
            const refreshItems = getUniqueLiveItems(items);
            if (!refreshItems.length) return;

            for (const item of refreshItems) {
                if (!active || liveController.signal.aborted) return;
                await refreshLiveItem(item, label);
            }
        }

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
                )}&source=${encodeURIComponent(sourceName || "")}`;

                const res = await fetch(url, { cache: "no-store" });
                const json = await res.json();

                if (!active) return null;

                if (!res.ok || json?.success === false || !json?.data) {
                    setProduct(null);
                    toast.error("Product details could not be loaded.");
                    return null;
                }

                const selectedProduct = {
                    ...json.data,
                    product_url: json.data.product_url || productUrl,
                    source: json.data.source || sourceName || "",
                };

                const suggestedName = toText(selectedProduct.suggestedName).trim();
                const displayName = suggestedName || formatProductDisplayName(
                    selectedProduct.title || selectedProduct.product_name || "",
                    {
                        source: selectedProduct.source,
                        category: selectedProduct.category,
                        specifications: selectedProduct.specifications,
                    }
                );
                if (displayName) {
                    selectedProduct.title = displayName;
                    selectedProduct.product_name = displayName;
                }

                selectedProduct.images = resolveProductImages(selectedProduct);
                selectedProduct.image_url = resolvePrimaryProductImage(selectedProduct);

                const sharafDisplayImages = getSharafDisplayImages(selectedProduct);
                if (isSharafdgSource(selectedProduct.source) && sharafDisplayImages.length > 0) {
                    selectedProduct.images = sharafDisplayImages;
                    selectedProduct.image_url = sharafDisplayImages[0]?.src || selectedProduct.image_url;
                }

                setProduct(selectedProduct);
                return selectedProduct;
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
                    .map((item: any) => {
                        const normalized = normalizeListProduct(item);
                        return {
                            ...normalized,
                            source: normalized.source || sourceName || "",
                        };
                    })
                    .filter((p: any) => p.product_name && p.image_url && p.product_url);

                const orderedMapped: OfferProduct[] = orderOffersForDisplay<OfferProduct>(mapped);

                setOffers(orderedMapped);
                setOfferCount(Number(json?.offer_count || 0));
                setIsMobileProduct(Boolean(json?.is_mobile_product));
                setProductCase(
                    typeof json?.product_case === "string" ? json.product_case : "unknown"
                );
                return orderedMapped;
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
            if (active) {
                setRelatedProducts([]);
                setVariantCount(0);
                setRelatedLoading(false);
            }

            // Variants are intentionally hidden for now.
            // Keep the original fetch logic commented instead of removing it.
            /*
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
            */

            return [];
        }

        async function fetchVariantImageCandidates() {
            if (!productUrl) return [];

            try {
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

                if (!active || !res.ok || json?.success === false) {
                    return [];
                }

                const apiProducts = Array.isArray(json?.products) ? json.products : [];

                return apiProducts
                    .map((item: any) => {
                        const normalized = normalizeListProduct(item);
                        return {
                            ...normalized,
                            source: normalized.source || sourceName || "",
                        };
                    })
                    .filter((item: OfferProduct) => getUsableImages(item).length > 0);
            } catch (err) {
                console.error("Variant image candidates fetch error:", err);
                return [];
            }
        }

        async function applySharafGalleryFallback(
            selectedProduct: any | null,
            offerItems: OfferProduct[]
        ) {
            if (!selectedProduct || !isSharafdgSource(selectedProduct.source)) {
                return {
                    product: selectedProduct,
                    offers: offerItems,
                };
            }

            const sharafDisplayImages = getSharafDisplayImages(selectedProduct);
            if (sharafDisplayImages.length > 0) {
                const nextProduct = {
                    ...selectedProduct,
                    images: sharafDisplayImages,
                    image_url: sharafDisplayImages[0]?.src || selectedProduct.image_url,
                };
                setProduct(nextProduct);
                return {
                    product: nextProduct,
                    offers: offerItems,
                };
            }

            const offerGalleryImages = collectFallbackGalleryImages(offerItems, 4);
            const needsOfferImages = offerItems.some(needsBorrowedImage);
            let variantFallbackImages: ProductImage[] = [];
            let nextOfferItems = offerItems;

            if (offerGalleryImages.length === 0 || needsOfferImages) {
                const variantCandidates = await fetchVariantImageCandidates();
                variantFallbackImages = collectFallbackGalleryImages(variantCandidates, 10);

                if (needsOfferImages && variantFallbackImages.length > 0) {
                    nextOfferItems = applyBorrowedImagesToSharafOffers(
                        offerItems,
                        variantFallbackImages
                    );
                    setOffers(nextOfferItems);
                }
            }

            if (offerGalleryImages.length > 0) {
                const nextProduct = {
                    ...selectedProduct,
                    images: offerGalleryImages,
                    image_url: offerGalleryImages[0]?.src || selectedProduct.image_url,
                };
                setProduct(nextProduct);
                return {
                    product: nextProduct,
                    offers: nextOfferItems,
                };
            }

            if (variantFallbackImages.length > 0) {
                const galleryImages = variantFallbackImages.slice(0, 4);
                const nextProduct = {
                    ...selectedProduct,
                    images: galleryImages,
                    image_url: galleryImages[0]?.src || selectedProduct.image_url,
                };
                setProduct(nextProduct);
                return {
                    product: nextProduct,
                    offers: nextOfferItems,
                };
            }

            return {
                product: selectedProduct,
                offers: nextOfferItems,
            };
        }

        async function refreshOneProduct(selectedProduct: any | null) {
            if (!selectedProduct || !selectedProduct.product_url) return;
            await refreshLiveItem(selectedProduct, "Selected product");
        }

        async function refreshRelatedProducts(items: RelatedProduct[]) {
            await refreshLiveItemsSequentially(items, "Variant");
        }

        async function refreshOffers(items: OfferProduct[]) {
            await refreshLiveItemsSequentially(items, "Offer");
        }

        async function run() {
            const [selectedProduct, , offerItems] = await Promise.all([
                fetchProduct(),
                fetchRelatedProducts(),
                fetchOffers(),
            ]);

            if (!active || liveController.signal.aborted) return;

            const displayFallback = await applySharafGalleryFallback(
                selectedProduct,
                offerItems as OfferProduct[]
            );
            const displayProduct = displayFallback.product;
            const displayOfferItems = displayFallback.offers;

            if (!active || liveController.signal.aborted) return;

            const liveOfferItems = getUniqueLiveItems(displayOfferItems as OfferProduct[]);
            const selectedProductKey = displayProduct ? getProductKey(displayProduct) : "";
            const selectedExistsInOffers = Boolean(
                selectedProductKey &&
                liveOfferItems.some((item) => getProductKey(item) === selectedProductKey)
            );

            if (liveOfferItems.length) {
                await refreshOffers(liveOfferItems as OfferProduct[]);
                if (!active || liveController.signal.aborted) return;

                if (!selectedExistsInOffers) {
                    await refreshOneProduct(displayProduct);
                }
            } else if (!selectedExistsInOffers) {
                await refreshOneProduct(displayProduct);
            }

            // Variant live refresh is intentionally disabled while the variants panel is hidden.
            /*
            if (!active || liveController.signal.aborted) return;
            await refreshRelatedProducts(related as RelatedProduct[]);
            */
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
