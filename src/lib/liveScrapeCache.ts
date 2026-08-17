import type { Db } from "mongodb";
import type { Connection } from "mongoose";
import { connectDB } from "@/lib/mongodb";

const PRODUCTS_V2_COLLECTION = "products_v2";
const PRICE_FRESHNESS_MS = 24 * 60 * 60 * 1000;

type DateLike = Date | string | { $date?: string } | null | undefined;

type OfferItem = {
  product_url?: string;
  source?: string;
  currentPrice?: string | number | null;
  previousPrice?: string | number | null;
  rating?: string | number | null;
  ratingCount?: string | number | null;
  average_rating?: number | null;
  reviews?: string | number | null;
  lastUpdatedAtPrice?: DateLike;
};

type GroupedProductDoc = {
  _id?: unknown;
  product_url?: string;
  source?: string;
  currentPrice?: string | number | null;
  previousPrice?: string | number | null;
  rating?: string | number | null;
  ratingCount?: string | number | null;
  average_rating?: number | null;
  reviews?: string | number | null;
  lastUpdatedAtPrice?: DateLike;
  offerItems?: OfferItem[];
};

type CachedProductDoc = OfferItem & {
  groupedProductId?: unknown;
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

function normalizeSource(source: unknown): string {
  const value = toText(source).toLowerCase();
  if (value === "carrefouruae") return "carrefour";
  return value;
}

function sourceAliases(source: string): string[] {
  const normalized = normalizeSource(source);
  if (!normalized) return [];
  if (normalized === "carrefour") return ["carrefour", "carrefouruae"];
  return [normalized];
}

function parseDateMs(value: DateLike): number {
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
  return Number.isFinite(numeric) && numeric > 0 ? Math.max(0, Math.min(5, numeric)) : null;
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

function findOffer(doc: GroupedProductDoc | null, productUrl: string, source: string) {
  const aliases = new Set(sourceAliases(source));
  const offers = Array.isArray(doc?.offerItems) ? doc.offerItems : [];

  return offers.find((offer) => {
    if (toText(offer.product_url) !== productUrl) return false;
    const offerSource = normalizeSource(offer.source);
    return aliases.size === 0 || aliases.has(offerSource);
  });
}

function parsePriceNumber(value: unknown): number | null {
  const numeric = Number(toText(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function cheapestCurrentPrice(offers: OfferItem[]): string {
  let bestPriceText = "";
  let bestPriceNumber = Number.POSITIVE_INFINITY;

  for (const offer of offers) {
    const priceText = toText(offer.currentPrice);
    const priceNumber = parsePriceNumber(priceText);
    if (priceNumber === null || priceNumber >= bestPriceNumber) continue;

    bestPriceText = priceText;
    bestPriceNumber = priceNumber;
  }

  return bestPriceText;
}

export async function findCachedProduct(productUrl: string, source: string) {
  const db = await getDb();
  const aliases = sourceAliases(source);
  const collection = db.collection<GroupedProductDoc>(PRODUCTS_V2_COLLECTION);

  let doc = await collection.findOne(
    {
      offerItems: {
        $elemMatch: {
          product_url: productUrl,
          ...(aliases.length > 0 ? { source: { $in: aliases } } : {}),
        },
      },
    },
    {
      projection: {
        product_url: 1,
        source: 1,
        currentPrice: 1,
        previousPrice: 1,
        rating: 1,
        ratingCount: 1,
        average_rating: 1,
        reviews: 1,
        lastUpdatedAtPrice: 1,
        offerItems: 1,
      },
    }
  );

  if (!doc) {
    doc = await collection.findOne(
      { product_url: productUrl },
      {
        projection: {
          product_url: 1,
          source: 1,
          currentPrice: 1,
          previousPrice: 1,
          rating: 1,
          ratingCount: 1,
          average_rating: 1,
          reviews: 1,
          lastUpdatedAtPrice: 1,
          offerItems: 1,
        },
      }
    );
  }

  const offer = findOffer(doc, productUrl, source);
  if (offer) {
    return {
      ...offer,
      groupedProductId: doc?._id,
    } as CachedProductDoc;
  }

  if (!doc) return null;

  return {
    product_url: doc.product_url,
    source: doc.source,
    currentPrice: doc.currentPrice,
    previousPrice: doc.previousPrice,
    rating: doc.rating,
    ratingCount: doc.ratingCount,
    average_rating: doc.average_rating,
    reviews: doc.reviews,
    lastUpdatedAtPrice: doc.lastUpdatedAtPrice,
    groupedProductId: doc._id,
  } as CachedProductDoc;
}

export function hasFreshLivePrice(doc: CachedProductDoc | null | undefined): boolean {
  if (!doc) return false;
  if (!toText(doc.currentPrice)) return false;

  const lastUpdatedAtPriceMs = parseDateMs(doc.lastUpdatedAtPrice);
  if (!lastUpdatedAtPriceMs) return false;

  return Date.now() - lastUpdatedAtPriceMs < PRICE_FRESHNESS_MS;
}

export function buildCachedLivePricePayload(doc: CachedProductDoc) {
  return {
    currentPrice: toText(doc.currentPrice),
    previousPrice: toText(doc.previousPrice),
    rating: toText(doc.rating) || toText(doc.average_rating),
    ratingCount: toText(doc.ratingCount) || toText(doc.reviews),
    lastUpdatedAtPrice: doc.lastUpdatedAtPrice,
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
  const aliases = sourceAliases(source);
  const collection = db.collection<GroupedProductDoc>(PRODUCTS_V2_COLLECTION);
  const now = new Date();

  const doc = await collection.findOne({
    offerItems: {
      $elemMatch: {
        product_url: productUrl,
        ...(aliases.length > 0 ? { source: { $in: aliases } } : {}),
      },
    },
  });

  if (!doc) {
    throw new Error("Matching products_v2 offer was not found");
  }

  let matchedOffer: OfferItem | null = null;
  const updatedOffers = (Array.isArray(doc.offerItems) ? doc.offerItems : []).map((offer) => {
    const offerSource = normalizeSource(offer.source);
    const isMatch =
      toText(offer.product_url) === productUrl &&
      (aliases.length === 0 || aliases.includes(offerSource));

    if (!isMatch) return offer;

    const nextPreviousPrice = toText(previousPrice) || toText(offer.previousPrice);
    const nextRating = toText(rating);
    const nextRatingCount = toText(ratingCount);

    matchedOffer = {
      ...offer,
      currentPrice: toText(currentPrice),
      previousPrice: nextPreviousPrice || offer.previousPrice,
      rating: nextRating || offer.rating,
      ratingCount: nextRatingCount || offer.ratingCount,
      average_rating: nextRating ? parseRatingNumber(nextRating) : offer.average_rating,
      reviews: nextRatingCount || offer.reviews,
      lastUpdatedAtPrice: now,
    };

    return matchedOffer;
  });

  if (!matchedOffer) {
    throw new Error("Matching products_v2 offer was not found");
  }
  const savedOffer = matchedOffer as OfferItem;

  const topLevelPrice = cheapestCurrentPrice(updatedOffers) || toText(doc.currentPrice);

  await collection.updateOne(
    { _id: doc._id },
    {
      $set: {
        offerItems: updatedOffers,
        currentPrice: topLevelPrice,
        lastUpdatedAtPrice: now,
      },
    }
  );

  return {
    currentPrice: toText(currentPrice),
    previousPrice: toText(savedOffer.previousPrice),
    rating: toText(savedOffer.rating) || toText(savedOffer.average_rating),
    ratingCount: toText(savedOffer.ratingCount) || toText(savedOffer.reviews),
    lastUpdatedAtPrice: now.toISOString(),
  };
}
