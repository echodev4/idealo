import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product_url =
      typeof body?.product_url === "string" ? body.product_url.trim() : "";
    const source =
      typeof body?.source === "string" ? body.source.trim() : "";

    const rawLimit = Number(body?.limit);
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0
        ? Math.min(Math.max(Math.floor(rawLimit), 1), 10)
        : 10;

    if (!product_url) {
      return NextResponse.json(
        { success: false, error: "product_url is required", offer_count: 0, offers: [] },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("SCRAPER_API_BASE_URL is not defined");
      return NextResponse.json(
        { success: false, error: "Backend base URL is missing", offer_count: 0, offers: [] },
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
        limit,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("product-offers backend error:", errorText);

      return NextResponse.json(
        { success: false, error: "Backend error", offer_count: 0, offers: [] },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: Boolean(data?.success),
      offer_count: Number(data?.offer_count || 0),
      offers: Array.isArray(data?.offers) ? data.offers : [],
    });
  } catch (err) {
    console.error("product-offers route error:", err);

    return NextResponse.json(
      { success: false, error: "Internal server error", offer_count: 0, offers: [] },
      { status: 500 }
    );
  }
}