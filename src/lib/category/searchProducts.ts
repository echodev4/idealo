import OpenAI from "openai";
import { normalizeFaissProduct } from "@/lib/products/normalizeProduct";
import { dedupeProducts } from "@/lib/products/dedupeProducts";
import type { RawProduct, SearchProductsResult, CategoryProduct } from "@/lib/products/types";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function searchProducts(
    query: string,
    candidateLimit = 160
): Promise<SearchProductsResult> {
    if (!BASE_URL) {
        throw new Error("SCRAPER_API_BASE_URL is not defined");
    }

    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
    });

    const vector = embeddingResponse.data[0].embedding;

    const faissRes = await fetch(`${BASE_URL}/faiss/search_by_vector`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            vector,
            limit: candidateLimit,
        }),
        cache: "no-store",
    });

    if (!faissRes.ok) {
        const errorText = await faissRes.text();
        throw new Error(`FAISS backend error: ${errorText}`);
    }

    const faissJson = await faissRes.json();

    const normalizedProducts: CategoryProduct[] = Array.isArray(faissJson?.products)
        ? faissJson.products
            .map((item: RawProduct) => normalizeFaissProduct(item))
            .filter((item: CategoryProduct | null): item is CategoryProduct => item !== null)
        : [];

    return {
        products: dedupeProducts(normalizedProducts),
    };
}