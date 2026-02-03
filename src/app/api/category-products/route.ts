import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!BASE_URL) throw new Error("SCRAPER_API_BASE_URL is not defined");
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not defined");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

type CatalogProduct = {
    _id: string;
    source: string;
    product_url: string;
    product_name: string;
    image_url: string;
    price: string;
    old_price?: string;
    discount?: string | null;
    reviews?: string;
    average_rating?: number | string | null;

    category_path_text?: string;
    category?: string;
    main_category?: string;
};

type NoonDetail = {
    product_url: string;
    title?: string;
    currentPrice?: string;
    previousPrice?: string;
    discountPercentage?: string;
    rating?: string;
    ratingCount?: string;
    images?: { src: string; alt?: string }[];
    overview?: string;
    highlights?: string[];
    specifications?: Record<string, any>;
};

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const q = searchParams.get("q")?.trim() || "";
        const limit = Math.min(Number(searchParams.get("limit") || "100"), 200);

        if (q.length < 2) {
            return NextResponse.json({ count: 0, products: [] });
        }

        // 1) embedding
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: q,
        });

        const vector = embeddingResponse.data[0].embedding;

        // 2) faiss search (catalog records)
        const faissRes = await fetch(`${BASE_URL}/faiss/search_by_vector`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vector, limit }),
            cache: "no-store",
        });

        if (!faissRes.ok) {
            const errorText = await faissRes.text();
            console.error("FAISS backend error:", errorText);
            return NextResponse.json({ count: 0, products: [] }, { status: 500 });
        }

        const faissJson = await faissRes.json();

        const catalogProducts: CatalogProduct[] = Array.isArray(faissJson.products)
            ? faissJson.products.filter((p: any) => {
                return (
                    typeof p._id === "string" &&
                    typeof p.product_url === "string" &&
                    p.product_url.startsWith("http") &&
                    typeof p.source === "string" &&
                    typeof p.product_name === "string" &&
                    typeof p.image_url === "string" &&
                    p.image_url.startsWith("http")
                );
            })
            : [];

        if (!catalogProducts.length) {
            return NextResponse.json({ count: 0, products: [] });
        }

        // 3) batch fetch details by URLs
        const urls = catalogProducts.map((p) => p.product_url);

        const detailsRes = await fetch(`${BASE_URL}/lookup/by-urls`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_urls: urls }),
            cache: "no-store",
        });

        const detailsList: NoonDetail[] = detailsRes.ok ? await detailsRes.json() : [];

        // 4) map details by product_url
        const detailsMap = new Map<string, NoonDetail>();
        for (const d of detailsList) {
            if (d?.product_url) detailsMap.set(d.product_url, d);
        }

        // 5) merge: detail fields + category fields
        // and FILTER OUT missing details
        const merged = catalogProducts
            .map((c) => {
                const d = detailsMap.get(c.product_url);
                if (!d) return null;

                return {
                    ...d,

                    category_path_text: c.category_path_text,
                    category: c.category,
                    main_category: c.main_category,

                    source: c.source,
                    source_record_id: c._id,
                };
            })
            .filter(Boolean);

        return NextResponse.json({
            count: merged.length,
            products: merged,
        });
    } catch (error) {
        console.error("API /category-products error:", error);
        return NextResponse.json({ count: 0, products: [] }, { status: 500 });
    }
}
