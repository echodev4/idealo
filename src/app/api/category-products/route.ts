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
    scraped_at?: unknown;
    faiss_score?: number;
};

type CategoryProduct = {
    _id?: string;
    product_url: string;
    title: string;
    currentPrice: string;
    previousPrice?: string;
    discountPercentage?: string;
    rating?: string;
    ratingCount?: string;
    images: { src: string; alt?: string }[];
    category_path_text?: string;
    category?: string;
    main_category?: string;
    source?: string;
    source_record_id?: string;
    scraped_at?: unknown;
    offerCount?: number;
};

function normalizeSource(source?: string): string {
    const s = String(source || "").trim().toLowerCase();

    if (s === "noon") return "noon";
    if (s === "carrefour" || s === "carrefouruae") return "carrefour";
    if (s === "sharafdg") return "sharafdg";

    return "other";
}

function isValidCatalogProduct(p: unknown): p is CatalogProduct {
    if (!p || typeof p !== "object") return false;

    const item = p as Record<string, unknown>;

    return (
        typeof item._id === "string" &&
        typeof item.product_url === "string" &&
        item.product_url.startsWith("http") &&
        typeof item.source === "string" &&
        typeof item.product_name === "string" &&
        item.product_name.trim() !== "" &&
        typeof item.image_url === "string" &&
        item.image_url.startsWith("http") &&
        typeof item.price === "string" &&
        item.price.trim() !== ""
    );
}

function diversifyProducts(products: CatalogProduct[]): CatalogProduct[] {
    const noon: CatalogProduct[] = [];
    const carrefour: CatalogProduct[] = [];
    const other: CatalogProduct[] = [];

    for (const product of products) {
        const source = normalizeSource(product.source);

        if (source === "sharafdg") continue;
        if (source === "noon") noon.push(product);
        else if (source === "carrefour") carrefour.push(product);
        else other.push(product);
    }

    const selected: CatalogProduct[] = [];
    let i = 0;

    while (i < noon.length || i < carrefour.length || i < other.length) {
        if (i < noon.length) selected.push(noon[i]);
        if (i < carrefour.length) selected.push(carrefour[i]);
        if (i < other.length) selected.push(other[i]);
        i += 1;
    }

    return selected;
}

function mapCatalogToCategoryProduct(p: CatalogProduct): CategoryProduct {
    return {
        _id: p._id,
        product_url: p.product_url,
        title: p.product_name,
        currentPrice: p.price,
        previousPrice: p.old_price || "",
        discountPercentage: p.discount || "",
        rating:
            p.average_rating !== null && p.average_rating !== undefined
                ? String(p.average_rating)
                : "",
        ratingCount: p.reviews || "",
        images: [{ src: p.image_url, alt: p.product_name }],
        category_path_text: p.category_path_text,
        category: p.category,
        main_category: p.main_category,
        source: p.source,
        source_record_id: p._id,
        scraped_at: p.scraped_at,
        offerCount: 0,
    };
}

async function fetchOfferCountForProduct(
    product: CategoryProduct,
    baseUrl: string
): Promise<number> {
    try {
        const res = await fetch(`${baseUrl}/offers/by-product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_url: product.product_url,
                source: product.source || "",
                limit: 20,
            }),
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Offer count backend error:", errorText);
            return 0;
        }

        const json = await res.json();

        if (!json?.success) return 0;

        // Includes the selected product itself.
        // If later you want ONLY other offers, use:
        // return Math.max(0, Number(json.offer_count || 0) - 1);
        return Number(json.offer_count || 0);
    } catch (err) {
        console.error("Offer count fetch failed:", product?.product_url, err);
        return 0;
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const q = searchParams.get("q")?.trim() || "";
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const limit = Math.min(
            Math.max(parseInt(searchParams.get("limit") || "20", 10), 1),
            50
        );

        if (q.length < 2) {
            return NextResponse.json({
                total: 0,
                page,
                limit,
                totalPages: 0,
                products: [],
            });
        }

        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: q,
        });

        const vector = embeddingResponse.data[0].embedding;

        const candidateLimit = 500;

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
            console.error("FAISS backend error:", errorText);

            return NextResponse.json(
                {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                    products: [],
                },
                { status: 500 }
            );
        }

        const faissJson = await faissRes.json();

        const catalogProducts: CatalogProduct[] = Array.isArray(faissJson.products)
            ? faissJson.products
                .filter(isValidCatalogProduct)
                .filter((p: any) => normalizeSource(p.source) !== "sharafdg")
            : [];

        const diversified = diversifyProducts(catalogProducts);
        const total = diversified.length;
        const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

        const start = (page - 1) * limit;
        const end = start + limit;

        const paginatedProducts = diversified.slice(start, end);
        const mappedProducts = paginatedProducts.map(mapCatalogToCategoryProduct);

        const enrichedProducts = await Promise.all(
            mappedProducts.map(async (product) => {
                const offerCount = await fetchOfferCountForProduct(product, BASE_URL);
                return {
                    ...product,
                    offerCount,
                };
            })
        );

        return NextResponse.json({
            total,
            page,
            limit,
            totalPages,
            products: enrichedProducts,
        });
    } catch (error) {
        console.error("API /category-products error:", error);

        return NextResponse.json(
            {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0,
                products: [],
            },
            { status: 500 }
        );
    }
}