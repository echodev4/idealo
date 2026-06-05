import { normalizeFaissProduct } from "@/lib/products/normalizeProduct";
import { dedupeProducts } from "@/lib/products/dedupeProducts";
import type { RawProduct, SearchProductsResult, CategoryProduct } from "@/lib/products/types";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

export async function searchProducts(
    query: string,
    candidateLimit = 160
): Promise<SearchProductsResult> {
    if (!BASE_URL) {
        throw new Error("SCRAPER_API_BASE_URL is not defined");
    }

    const searchRes = await fetch(
        `${BASE_URL}/search/products?q=${encodeURIComponent(query)}&limit=${candidateLimit}`,
        {
        cache: "no-store",
        }
    );

    if (!searchRes.ok) {
        const errorText = await searchRes.text();
        throw new Error(`Elasticsearch backend error: ${errorText}`);
    }

    const searchJson = await searchRes.json();

    const normalizedProducts: CategoryProduct[] = Array.isArray(searchJson?.products)
        ? searchJson.products
            .map((item: RawProduct) => normalizeFaissProduct(item))
            .filter((item: CategoryProduct | null): item is CategoryProduct => item !== null)
        : [];

    return {
        products: dedupeProducts(normalizedProducts),
    };
}
