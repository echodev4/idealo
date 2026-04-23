import { NextResponse } from "next/server";
import {
  buildCachedLivePricePayload,
  findCachedProduct,
  hasFreshLivePrice,
  persistLiveScrapeResult,
} from "@/lib/liveScrapeCache";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

function normalizeSource(source: unknown): string {
  const value = String(source || "").trim().toLowerCase();

  if (value === "carrefour" || value === "carrefouruae") return "carrefouruae";
  if (value === "noon") return "noon";

  return "";
}

function getBackendPath(source: string): string {
  if (source === "noon") return "/noon-current-price/api/scrape/current-price";
  if (source === "carrefouruae") return "/carrefouruae-current-price/api/scrape/current-price";
  return "";
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

    const cachedProduct = await findCachedProduct(productUrl, source);

    if (hasFreshLivePrice(cachedProduct)) {
      const cached = buildCachedLivePricePayload(cachedProduct!);

      return NextResponse.json({
        success: true,
        product_url: productUrl,
        source,
        currentPrice: cached.currentPrice,
        lastLiveScrapedAt: cachedProduct?.lastLiveScrapedAt,
        cached: true,
      });
    }

    const backendPath = getBackendPath(source);
    const scraperUrl = `${BASE_URL}${backendPath}?product_url=${encodeURIComponent(productUrl)}`;

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
          error: data?.message || data?.detail || "Live current price could not be fetched",
        },
        { status: scraperResponse.status || 500 }
      );
    }

    const currentPrice = data?.data?.currentPrice;
    if (!currentPrice) {
      return NextResponse.json(
        { success: false, error: "Live current price was not found" },
        { status: 502 }
      );
    }

    const persisted = await persistLiveScrapeResult({
      productUrl,
      source,
      currentPrice: String(currentPrice),
    });

    return NextResponse.json({
      success: true,
      product_url: productUrl,
      source,
      currentPrice: persisted.currentPrice,
      lastLiveScrapedAt: persisted.lastLiveScrapedAt,
      cached: false,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { success: false, error: "Request aborted" },
        { status: 499 }
      );
    }

    console.error("live-current-price route error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
