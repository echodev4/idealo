import type { Db } from "mongodb";
import type { Connection } from "mongoose";
import { connectDB } from "@/lib/mongodb";

const PRODUCTS_COLLECTION = "products";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type CachedProductDoc = {
  product_url?: string;
  source?: string;
  currentPrice?: string | number | null;
  previousPrice?: string | number | null;
  rating?: string | number | null;
  ratingCount?: string | number | null;
  average_rating?: number | null;
  reviews?: string | number | null;
  lastLiveScrapedAt?: Date | string | { $date?: string } | null;
};

type PersistLiveScrapeParams = {
  productUrl: string;
  source: string;
  currentPrice: string;
  previousPrice?: string;
  rating?: string;
  ratingCount?: string;
};

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function parseDateMs(value: CachedProductDoc["lastLiveScrapedAt"]): number {
  const raw =
    value && typeof value === "object" && "$date" in value
      ? value.$date
      : value;

  if (!raw) return 0;

  const ms = Date.parse(String(raw));
  return Number.isFinite(ms) ? ms : 0;
}

function parseRatingNumber(value: string): number | null {
  const numeric = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

async function getDb(): Promise<Db> {
  const conn = (await connectDB()) as typeof import("mongoose") & {
    connection: Connection;
  };
  const db = conn.connection.db;

  if (!db) {
    throw new Error("MongoDB database connection is not available");
  }

  return db;
}

export async function findCachedProduct(productUrl: string, source: string) {
  const db = await getDb();

  let doc = (await db
    .collection<CachedProductDoc>(PRODUCTS_COLLECTION)
    .findOne({ product_url: productUrl, source })) as CachedProductDoc | null;

  if (!doc) {
    doc = (await db
      .collection<CachedProductDoc>(PRODUCTS_COLLECTION)
      .findOne({ product_url: productUrl })) as CachedProductDoc | null;
  }

  return doc;
}

export function hasFreshLivePrice(doc: CachedProductDoc | null | undefined): boolean {
  if (!doc) return false;
  if (!toText(doc.currentPrice)) return false;

  const lastLiveScrapedMs = parseDateMs(doc.lastLiveScrapedAt);
  if (!lastLiveScrapedMs) return false;

  return Date.now() - lastLiveScrapedMs < THIRTY_DAYS_MS;
}

export function buildCachedLivePricePayload(doc: CachedProductDoc) {
  return {
    currentPrice: toText(doc.currentPrice),
    previousPrice: toText(doc.previousPrice),
    rating: toText(doc.rating) || toText(doc.average_rating),
    ratingCount: toText(doc.ratingCount) || toText(doc.reviews),
  };
}

export async function persistLiveScrapeResult({
  productUrl,
  source,
  currentPrice,
  previousPrice,
  rating,
  ratingCount,
}: PersistLiveScrapeParams) {
  const db = await getDb();
  const existing = await findCachedProduct(productUrl, source);
  const now = new Date();

  const nextPreviousPrice = toText(previousPrice) || toText(existing?.previousPrice);
  const nextRating = toText(rating);
  const nextRatingCount = toText(ratingCount);
  const nextAverageRating = nextRating ? parseRatingNumber(nextRating) : null;

  const setFields: Record<string, unknown> = {
    currentPrice: toText(currentPrice),
    price: toText(currentPrice),
    lastLiveScrapedAt: now,
  };

  if (nextPreviousPrice) {
    setFields.previousPrice = nextPreviousPrice;
    setFields.old_price = nextPreviousPrice;
  }

  if (nextRating) {
    setFields.rating = nextRating;
    setFields.average_rating = nextAverageRating;
  }

  if (nextRatingCount) {
    setFields.ratingCount = nextRatingCount;
    setFields.reviews = nextRatingCount;
  }

  await db.collection(PRODUCTS_COLLECTION).updateOne(
    existing
      ? existing.source
        ? { product_url: productUrl, source: existing.source }
        : { product_url: productUrl }
      : { product_url: productUrl },
    { $set: setFields }
  );

  return {
    currentPrice: toText(currentPrice),
    previousPrice: nextPreviousPrice,
    rating: nextRating || toText(existing?.rating) || toText(existing?.average_rating),
    ratingCount: nextRatingCount || toText(existing?.ratingCount) || toText(existing?.reviews),
    lastLiveScrapedAt: now.toISOString(),
  };
}
