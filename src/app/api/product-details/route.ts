import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const product_url = searchParams.get("product_url");

    if (!product_url) {
      return NextResponse.json(
        { success: false, data: null, error: "product_url is required" },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("SCRAPER_API_BASE_URL is not defined");
      return NextResponse.json(
        { success: false, data: null, error: "Backend base URL is missing" },
        { status: 500 }
      );
    }

    const res = await fetch(`${BASE_URL}/lookup/by-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_url }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("product-details backend error:", errorText);

      return NextResponse.json(
        { success: false, data: null, error: "Product not found" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("product-details route error:", err);

    return NextResponse.json(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}