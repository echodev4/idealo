import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;
const OFFER_LIMIT = 160;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product_url =
      typeof body?.product_url === "string" ? body.product_url.trim() : "";
    const source =
      typeof body?.source === "string" ? body.source.trim() : "";

    if (!product_url) {
      return NextResponse.json(
        {
          success: false,
          error: "product_url is required",
          offer_count: 0,
          offers: [],
          is_mobile_product: false,
          product_case: "unknown",
        },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("SCRAPER_API_BASE_URL is not defined");
      return NextResponse.json(
        {
          success: false,
          error: "Backend base URL is missing",
          offer_count: 0,
          offers: [],
          is_mobile_product: false,
          product_case: "unknown",
        },
        { status: 500 }
      );
    }

    const res = await fetch(`${BASE_URL}/offers/by-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_url,
        source,
        limit: OFFER_LIMIT,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("product-offers backend error:", errorText);

      return NextResponse.json(
        {
          success: false,
          error: "Backend error",
          offer_count: 0,
          offers: [],
          is_mobile_product: false,
          product_case: "unknown",
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: Boolean(data?.success),
      product_case: typeof data?.product_case === "string" ? data.product_case : "unknown",
      is_mobile_product: Boolean(data?.is_mobile_product),
      offer_count: Number(data?.offer_count || 0),
      offers: Array.isArray(data?.offers) ? data.offers : [],
      display_images: Array.isArray(data?.display_images) ? data.display_images : [],
      display_image_url:
        typeof data?.display_image_url === "string" ? data.display_image_url : "",
      display_source: typeof data?.display_source === "string" ? data.display_source : "",
      display_product_url:
        typeof data?.display_product_url === "string" ? data.display_product_url : "",
    });
  } catch (err) {
    console.error("product-offers route error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        offer_count: 0,
        offers: [],
        is_mobile_product: false,
        product_case: "unknown",
      },
      { status: 500 }
    );
  }
}
