import { NextResponse } from "next/server";
import { LANDING_EMBEDDINGS } from "@/lib/landingEmbeddings";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("SCRAPER_API_BASE_URL is not defined");
}

/* =========================
   HELPERS
========================= */

async function fetchFaissByVector(vector: number[], limit = 8) {
  const res = await fetch(`${BASE_URL}/faiss/search_by_vector`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vector, limit }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("FAISS error:", res.status);
    return [];
  }

  const data = await res.json();

  /* =========================
     FILTER INVALID PRODUCTS
  ========================= */

  const products = Array.isArray(data.products)
    ? data.products.filter((p: any) => {
      return (
        typeof p._id === "string" &&
        typeof p.product_url === "string" &&
        p.product_url.startsWith("http") &&
        typeof p.source === "string" &&
        typeof p.product_name === "string" &&
        typeof p.image_url === "string" &&
        p.image_url.startsWith("http") &&
        typeof p.price === "string" &&
        p.price.trim() !== ""
      );
    })
    : [];

  return products;
}

/* =========================
   ROUTE
========================= */

const LIMIT = 12;

export async function GET() {
  try {
    const [iphoneDeals, dairyProducts, fashionProducts] =
      await Promise.all([
        fetchFaissByVector(LANDING_EMBEDDINGS.iphoneDeals, LIMIT),
        fetchFaissByVector(LANDING_EMBEDDINGS.dairyProducts, LIMIT),
        fetchFaissByVector(LANDING_EMBEDDINGS.fashionProducts, LIMIT),
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
