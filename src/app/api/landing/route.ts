import { NextResponse } from "next/server";
import { resolvePrimaryProductImage } from "@/lib/products/imageFallback";
import { formatProductDisplayName } from "@/lib/products/displayName";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

type Product = {
  _id: string;
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
  rating?: string;
  ratingCount?: string;
  reviews?: string;
  average_rating?: number | null;
  faiss_score?: number;
};

type RawProduct = {
  _id?: string;
  source?: string;
  product_url?: string;
  title?: string;
  product_name?: string;
  suggestedName?: string;
  category?: string;
  image_url?: string;
  images?: { src?: string; alt?: string }[];
  price?: string | number;
  currentPrice?: string | number;
  old_price?: string | number;
  previousPrice?: string | number;
  discount?: string | number;
  reviews?: string | number;
  average_rating?: number | null;
  faiss_score?: number;
  specifications?: Record<string, unknown>;
};

function toPriceString(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

function normalizeProduct(raw: RawProduct): Product | null {
  const id = typeof raw?._id === "string" ? raw._id : "";
  const productUrl = typeof raw?.product_url === "string" ? raw.product_url : "";
  const source = typeof raw?.source === "string" ? raw.source : "";
  const category = typeof raw?.category === "string" ? raw.category : "";

  const suggestedName =
    typeof raw?.suggestedName === "string" && raw.suggestedName.trim() !== ""
      ? raw.suggestedName.trim()
      : "";

  const productName = suggestedName ||
    (typeof raw?.product_name === "string" && raw.product_name.trim() !== ""
      ? formatProductDisplayName(raw.product_name, {
        source,
        category,
        specifications: raw?.specifications,
      })
      : typeof raw?.title === "string" && raw.title.trim() !== ""
        ? formatProductDisplayName(raw.title, {
          source,
          category,
          specifications: raw?.specifications,
        })
        : "");

  const imageUrl =
    resolvePrimaryProductImage(raw);

  const price =
    raw?.price !== undefined && raw?.price !== null && raw?.price !== ""
      ? toPriceString(raw.price)
      : toPriceString(raw.currentPrice);

  const oldPrice =
    raw?.old_price !== undefined && raw?.old_price !== null && raw?.old_price !== ""
      ? toPriceString(raw.old_price)
      : raw?.previousPrice !== undefined && raw?.previousPrice !== null && raw?.previousPrice !== ""
        ? toPriceString(raw.previousPrice)
        : undefined;

  if (!id || !productUrl || !productName || !imageUrl || !price) {
    return null;
  }

  return {
    _id: id,
    product_url: productUrl,
    source,
    product_name: productName,
    image_url: imageUrl,
    price,
    old_price: oldPrice,
    discount:
      raw?.discount !== undefined && raw?.discount !== null && raw?.discount !== ""
        ? String(raw.discount)
        : undefined,
    rating:
      raw?.average_rating !== undefined && raw?.average_rating !== null
        ? String(raw.average_rating)
        : undefined,
    ratingCount:
      raw?.reviews !== undefined && raw?.reviews !== null && raw?.reviews !== ""
        ? String(raw.reviews)
        : undefined,
    reviews:
      raw?.reviews !== undefined && raw?.reviews !== null && raw?.reviews !== ""
        ? String(raw.reviews)
        : undefined,
    average_rating:
      typeof raw?.average_rating === "number" ? raw.average_rating : null,
    faiss_score:
      typeof raw?.faiss_score === "number" ? raw.faiss_score : undefined,
  };
}

function dedupeProducts(products: Product[], limit: number): Product[] {
  const seenIds = new Set<string>();
  const selected: Product[] = [];

  for (const product of products) {
    if (seenIds.has(product._id)) continue;

    seenIds.add(product._id);
    selected.push(product);

    if (selected.length >= limit) break;
  }

  return selected;
}

async function fetchProductsBySearchQuery(
  query: string,
  limit: number,
  candidateLimit: number
): Promise<Product[]> {
  if (!BASE_URL) {
    console.error("SCRAPER_API_BASE_URL is not defined");
    return [];
  }

  const res = await fetch(
    `${BASE_URL}/search/products?q=${encodeURIComponent(query)}&limit=${candidateLimit}`,
    {
    cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Elasticsearch search error:", res.status);
    return [];
  }

  const data = await res.json();
  const rawProducts: RawProduct[] = Array.isArray(data?.products) ? data.products : [];

  const normalizedProducts = rawProducts
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);

  return dedupeProducts(normalizedProducts, limit);
}

export async function GET() {
  try {
    const [iphoneDeals, dairyProducts, fashionProducts] = await Promise.all([
      fetchProductsBySearchQuery("iphone 16", 12, 60),
      fetchProductsBySearchQuery("milk", 12, 60),
      fetchProductsBySearchQuery("fashion", 18, 80),
    ]);

    return NextResponse.json({
      iphoneDeals,
      dairyProducts,
      fashionProducts,
    });
  } catch (err) {
    console.error("Landing API error:", err);

    return NextResponse.json(
      {
        iphoneDeals: [],
        dairyProducts: [],
        fashionProducts: [],
      },
      { status: 500 }
    );
  }
}
