import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RawProduct = {
  _id?: string;
  source?: string;
  product_url?: string;
  title?: string;
  product_name?: string;
  currentPrice?: string | number;
  previousPrice?: string | number;
  price?: string | number;
  old_price?: string | number;
  discount?: string | number;
  reviews?: string | number;
  average_rating?: number | null;
  images?: { src?: string; alt?: string }[];
  image_url?: string;
  category?: string;
  main_category?: string;
  category_path_text?: string;
  scraped_at?: string;
  created_at?: string;
  inserted_at?: string;
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
  numericPrice?: number;
  numericOldPrice?: number;
  scraped_at?: string;
  offerCount?: number;
};

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeImage(raw: RawProduct): { src: string; alt?: string }[] {
  const title = toText(raw.title || raw.product_name);

  if (Array.isArray(raw.images) && raw.images.length > 0) {
    const validImages = raw.images
      .map((img) => ({
        src: toText(img?.src),
        alt: toText(img?.alt) || title,
      }))
      .filter((img) => img.src);

    if (validImages.length > 0) return validImages;
  }

  const fallback = toText(raw.image_url);
  return fallback ? [{ src: fallback, alt: title }] : [];
}

function normalizeFaissProduct(raw: RawProduct): CategoryProduct | null {
  const id = toText(raw._id);
  const productUrl = toText(raw.product_url);
  const title = toText(raw.title || raw.product_name);
  const images = normalizeImage(raw);

  const currentPrice = toText(
    raw.currentPrice !== undefined && raw.currentPrice !== null && raw.currentPrice !== ""
      ? raw.currentPrice
      : raw.price
  );

  const previousPrice = toText(
    raw.previousPrice !== undefined && raw.previousPrice !== null && raw.previousPrice !== ""
      ? raw.previousPrice
      : raw.old_price
  );

  if (!id || !productUrl || !title || images.length === 0 || !currentPrice) {
    return null;
  }

  return {
    _id: id,
    product_url: productUrl,
    title,
    currentPrice,
    previousPrice: previousPrice || "",
    discountPercentage: toText(raw.discount),
    rating:
      raw.average_rating !== null && raw.average_rating !== undefined
        ? String(raw.average_rating)
        : "",
    ratingCount: toText(raw.reviews),
    images,
    category_path_text: toText(raw.category_path_text),
    category: toText(raw.category),
    main_category: toText(raw.main_category),
    source: toText(raw.source),
    source_record_id: id,
    scraped_at: toText(raw.scraped_at || raw.created_at || raw.inserted_at),
    offerCount: 0,
  };
}

function dedupeProducts(products: CategoryProduct[]): CategoryProduct[] {
  const seen = new Set<string>();
  const result: CategoryProduct[] = [];

  for (const product of products) {
    const key = product._id || product.product_url;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(product);
  }

  return result;
}

async function fetchOfferCountsForProducts(
  products: CategoryProduct[],
  baseUrl: string
): Promise<Map<string, number>> {
  const countsMap = new Map<string, number>();

  if (!products.length) return countsMap;

  try {
    const res = await fetch(`${baseUrl}/offers/count-by-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: products.map((product) => ({
          product_url: product.product_url,
          source: product.source || "",
        })),
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Batch offer count backend error:", errorText);
      return countsMap;
    }

    const json = await res.json();
    const results = Array.isArray(json?.results) ? json.results : [];

    for (const item of results) {
      const productUrl =
        typeof item?.product_url === "string" ? item.product_url : "";
      const offerCount = Number(item?.offer_count || 0);

      if (productUrl) {
        countsMap.set(productUrl, offerCount);
      }
    }

    return countsMap;
  } catch (err) {
    console.error("Batch offer count fetch failed:", err);
    return countsMap;
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

    if (!BASE_URL) {
      console.error("SCRAPER_API_BASE_URL is not defined");
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

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: q,
    });

    const vector = embeddingResponse.data[0].embedding;

    // Kept reasonably high for quality, but much lower than 500 for speed
    const candidateLimit = 160;

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

    const normalizedProducts = Array.isArray(faissJson?.products)
      ? faissJson.products
          .map((item: RawProduct) => normalizeFaissProduct(item))
          .filter((item: CategoryProduct | null): item is CategoryProduct => item !== null)
      : [];

    const dedupedProducts = dedupeProducts(normalizedProducts);

    const total = dedupedProducts.length;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedProducts = dedupedProducts.slice(start, end);

    const offerCountsMap = await fetchOfferCountsForProducts(paginatedProducts, BASE_URL);

    const enrichedProducts = paginatedProducts.map((product) => ({
      ...product,
      offerCount: offerCountsMap.get(product.product_url) || 0,
    }));

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