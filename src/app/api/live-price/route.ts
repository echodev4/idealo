import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

function normalizeSource(source: unknown): string {
  const value = String(source || "").trim().toLowerCase();

  if (value === "carrefour" || value === "carrefouruae") return "carrefouruae";
  if (value === "noon") return "noon";

  return "";
}

function toPriceText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value).trim();
}

function normalizePricePayload(data: any) {
  const scraped = data?.data || {};

  return {
    currentPrice: toPriceText(scraped?.currentPrice),
    previousPrice: toPriceText(scraped?.previousPrice),
    discountPercentage: toPriceText(scraped?.discountPercentage),
    rating: toPriceText(scraped?.rating),
    ratingCount: toPriceText(scraped?.ratingCount),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productUrl = typeof body?.product_url === "string" ? body.product_url.trim() : "";
    const source = normalizeSource(body?.source);

    if (!productUrl) {
      return NextResponse.json(
        { success: false, error: "product_url is required" },
        { status: 400 }
      );
    }

    if (!source) {
      return NextResponse.json(
        { success: false, error: "Unsupported source" },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("SCRAPER_API_BASE_URL is not defined");
      return NextResponse.json(
        { success: false, error: "Backend base URL is missing" },
        { status: 500 }
      );
    }

    const scraperUrl = `${BASE_URL}/${source}/api/scrape/details?product_url=${encodeURIComponent(productUrl)}`;

    const scraperResponse = await fetch(scraperUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: req.signal,
    });

    let data: any = null;
    try {
      data = await scraperResponse.json();
    } catch {
      data = null;
    }

    if (!scraperResponse.ok || data?.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || data?.detail || "Live price could not be fetched",
        },
        { status: scraperResponse.status || 500 }
      );
    }

    const prices = normalizePricePayload(data);

    if (!prices.currentPrice) {
      return NextResponse.json(
        { success: false, error: "Live price was not found" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      product_url: productUrl,
      source,
      ...prices,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { success: false, error: "Request aborted" },
        { status: 499 }
      );
    }

    console.error("live-price route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
