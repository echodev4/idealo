import { NextResponse } from "next/server";
import { LANDING_EMBEDDINGS } from "@/lib/landingEmbeddings";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("SCRAPER_API_BASE_URL is not defined");
}

type Product = {
  _id: string;
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
  reviews?: string;
  average_rating?: number | null;
  faiss_score?: number;
};

function isValidProduct(p: any): p is Product {
  return (
    typeof p?._id === "string" &&
    typeof p?.product_url === "string" &&
    p.product_url.startsWith("http") &&
    typeof p?.source === "string" &&
    typeof p?.product_name === "string" &&
    p.product_name.trim() !== "" &&
    typeof p?.image_url === "string" &&
    p.image_url.startsWith("http") &&
    typeof p?.price === "string" &&
    p.price.trim() !== ""
  );
}

function normalizeSource(source: string): string {
  const s = String(source || "").trim().toLowerCase();

  if (s === "noon") return "noon";
  if (s === "sharafdg") return "sharafdg";
  if (s === "carrefour" || s === "carrefouruae") return "carrefour";

  return "other";
}

function diversifyProducts(products: Product[], limit: number): Product[] {
  const buckets: Record<string, Product[]> = {
    noon: [],
    sharafdg: [],
    carrefour: [],
    other: [],
  };

  for (const product of products) {
    const source = normalizeSource(product.source);
    buckets[source].push(product);
  }

  const selected: Product[] = [];
  const usedIds = new Set<string>();
  const sourceOrder = ["noon", "sharafdg", "carrefour", "other"];

  while (selected.length < limit) {
    let addedInRound = false;

    for (const source of sourceOrder) {
      while (buckets[source].length > 0) {
        const item = buckets[source].shift()!;
        if (usedIds.has(item._id)) continue;

        selected.push(item);
        usedIds.add(item._id);
        addedInRound = true;
        break;
      }

      if (selected.length >= limit) break;
    }

    if (!addedInRound) break;
  }

  return selected.slice(0, limit);
}

async function fetchFaissByVector(
  vector: number[],
  limit: number,
  candidateLimit: number
): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/faiss/search_by_vector`, {
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

  if (!res.ok) {
    console.error("FAISS error:", res.status);
    return [];
  }

  const data = await res.json();

  const rawProducts = Array.isArray(data?.products) ? data.products : [];

  const validProducts = rawProducts
    .filter(isValidProduct)
    .filter((p: Product) => normalizeSource(p.source) !== "sharafdg");

  const sourceCounts = validProducts.reduce((acc: Record<string, number>, p: Product) => {
    const key = normalizeSource(p.source);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return diversifyProducts(validProducts, limit);
}

export async function GET() {
  try {
    const [iphoneDeals, dairyProducts, fashionProducts] = await Promise.all([
      fetchFaissByVector(LANDING_EMBEDDINGS.iphoneDeals, 12, 250),
      fetchFaissByVector(LANDING_EMBEDDINGS.dairyProducts, 12, 250),
      fetchFaissByVector(LANDING_EMBEDDINGS.fashionProducts, 18, 300),
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