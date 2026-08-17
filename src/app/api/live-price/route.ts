import { NextResponse } from "next/server";
import {
  buildCachedLivePricePayload,
  findCachedProduct,
  hasFreshLivePrice,
  persistOutOfStockResult,
  persistLiveScrapeResult,
} from "@/lib/liveScrapeCache";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;

function normalizeSource(source: unknown): string {
  const value = String(source || "").trim().toLowerCase();

  if (value === "carrefour" || value === "carrefouruae") return "carrefouruae";
  if (value === "noon") return "noon";
  if (["jumbo", "jackys", "istyle", "eros", "samsung"].includes(value)) return value;

  return "";
}

function toPriceText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value).trim();
}

function scraperPathForSource(source: string): string {
  if (source === "noon") return "/noon-current-price/api/scrape/current-price";
  if (source === "carrefouruae") return "/carrefouruae-current-price/api/scrape/current-price";
  return `/${source}/api/scrape/details`;
}

function isOutOfStockPayload(scraped: any): boolean {
  const stockText = toPriceText(scraped?.stock || scraped?.availability);
  return Boolean(scraped?.isOutOfStock) || /\bout\s+of\s+stock\b/i.test(stockText);
}

function normalizePricePayload(data: any) {
  const scraped = data?.data || {};

  return {
    currentPrice: toPriceText(scraped?.currentPrice),
    previousPrice: toPriceText(scraped?.previousPrice),
    discountPercentage: toPriceText(scraped?.discountPercentage),
    stock: toPriceText(scraped?.stock || scraped?.availability),
    isOutOfStock: isOutOfStockPayload(scraped),
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

    const cachedProduct = await findCachedProduct(productUrl, source);

    if (hasFreshLivePrice(cachedProduct)) {
      const cached = buildCachedLivePricePayload(cachedProduct!);

      return NextResponse.json({
        success: true,
        product_url: productUrl,
        source,
        ...cached,
        cached: true,
      });
    }

    const scraperUrl = `${BASE_URL}${scraperPathForSource(source)}?product_url=${encodeURIComponent(productUrl)}`;

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

    if (prices.isOutOfStock) {
      const persisted = await persistOutOfStockResult({
        productUrl,
        source,
      });

      return NextResponse.json({
        success: true,
        product_url: productUrl,
        source,
        currentPrice: "",
        stock: persisted.stock,
        isOutOfStock: true,
        outOfStock: true,
        lastUpdatedAtPrice: persisted.lastUpdatedAtPrice,
        cached: false,
      });
    }

    if (!prices.currentPrice) {
      return NextResponse.json(
        { success: false, error: "Live price was not found" },
        { status: 502 }
      );
    }

    const persisted = await persistLiveScrapeResult({
      productUrl,
      source,
      currentPrice: prices.currentPrice,
      previousPrice: prices.previousPrice,
      rating: prices.rating,
      ratingCount: prices.ratingCount,
    });

    return NextResponse.json({
      success: true,
      product_url: productUrl,
      source,
      currentPrice: persisted.currentPrice,
      previousPrice: persisted.previousPrice,
      discountPercentage: prices.discountPercentage,
      stock: persisted.stock || prices.stock,
      isOutOfStock: false,
      outOfStock: false,
      rating: persisted.rating,
      ratingCount: persisted.ratingCount,
      lastUpdatedAtPrice: persisted.lastUpdatedAtPrice,
      cached: false,
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
      {
        success: false,
        error: err?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
