import { NextResponse } from "next/server";

const BASE_URL = process.env.SCRAPER_API_BASE_URL

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { product_url, source, limit = 20 } = body;

    if (!product_url) {
      return NextResponse.json(
        { success: false, error: "product_url is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BASE_URL}/offers/by-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_url,
        source,
        limit,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Backend error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("product-offers error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}