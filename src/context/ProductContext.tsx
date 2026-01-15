"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

export interface Product {
    product_url: string;
    _id: string;
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

/**
 * Converts formatted price strings to numeric values.
 * Safe for strings like "AED 3,499" or "$1,299"
 */
function cleanPrice(p?: string): number {
    return Number((p || "").replace(/[^\d.]/g, "")) || 0;
}

interface ProductContextType {
    product: any | null;
    loading: boolean;

    relatedProducts: any[];
    relatedLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({
    product: null,
    loading: true,

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

    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    useEffect(() => {
        let active = true;

        /* ============================
           Fetch Product Details
        ============================ */

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

                const res = await fetch(url);
                const json = await res.json();

                if (!active) return;

                if (sourceName === "noon" && json?.success && json?.data) {
                    setProduct(json.data);
                }

                if (sourceName !== "noon" && json?.success && json?.scraped?.data) {
                    setProduct(json.scraped.data);
                }
            } catch (err) {
                console.error("❌ Product fetch error:", err);
            } finally {
                if (active) setLoading(false);
            }
        }

        /* ============================
           Fetch Related Products
        ============================ */

        async function fetchRelated() {
            if (!productName) {
                setRelatedProducts([]);
                setRelatedLoading(false);
                return;
            }

            try {
                setRelatedLoading(true);

                const res = await fetch(
                    `/api/products?q=${encodeURIComponent(productName)}&limit=10`,
                    { cache: "no-store" }
                );

                const json = await res.json();
                const apiProducts: Product[] = json.products || [];

                const mapped: Product[] = apiProducts
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

                setRelatedProducts(mapped);
            } catch (err) {
                console.error("❌ Related products fetch error:", err);
            } finally {
                if (active) setRelatedLoading(false);
            }
        }

        /* ============================
           Run BOTH
        ============================ */

        fetchProduct();
        fetchRelated();

        return () => {
            active = false;
        };
    }, [productUrl, productName, sourceName]);

    return (
        <ProductContext.Provider
            value={{
                product,
                loading,
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
