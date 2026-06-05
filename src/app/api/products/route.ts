import { NextResponse } from "next/server";
import { resolvePrimaryProductImage } from "@/lib/products/imageFallback";
import { formatProductDisplayName } from "@/lib/products/displayName";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("SCRAPER_API_BASE_URL is not defined");
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeProduct(raw: any) {
  const source = toText(raw?.source);
  const category = toText(raw?.category);
  const productName =
    toText(raw?.suggestedName) ||
    formatProductDisplayName(raw?.title || raw?.product_name, {
      source,
      category,
      specifications: raw?.specifications,
    });
  const imageUrl = resolvePrimaryProductImage(raw);
  const price =
    raw?.price !== undefined && raw?.price !== null && raw?.price !== ""
      ? toText(raw.price)
      : toText(raw?.currentPrice);

  if (
    !toText(raw?._id) ||
    !toText(raw?.product_url) ||
    !source ||
    !productName ||
    !imageUrl ||
    !price
  ) {
    return null;
  }

  return {
    ...raw,
    product_name: productName,
    image_url: imageUrl,
    price,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const limit = Number(searchParams.get("limit") || "12");

    if (q.length < 2) {
      return NextResponse.json({
        count: 0,
        products: [],
      });
    }

    const searchResponse = await fetch(
      `${BASE_URL}/search/products?q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Elasticsearch backend error:", errorText);

      return NextResponse.json(
        {
          count: 0,
          products: [],
        },
        { status: 500 }
      );
    }

    const data = await searchResponse.json();

    const products = Array.isArray(data.products)
      ? data.products
          .map((product: any) => normalizeProduct(product))
          .filter((product: any) => product !== null)
      : [];

    return NextResponse.json({
      count: typeof data?.count === "number" ? data.count : products.length,
      products,
    });

  } catch (error) {
    console.error("API /products error:", error);

    return NextResponse.json(
      {
        count: 0,
        products: [],
      },
      { status: 500 }
    );
  }
}
