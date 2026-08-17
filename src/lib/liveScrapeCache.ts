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
  stock?: string | null;
  isOutOfStock?: boolean | null;
  rating?: string | number | null;
  ratingCount?: string | number | null;
  average_rating?: number | null;
  reviews?: string | number | null;
  lastUpdatedAtPrice?: DateLike;
};

type GroupedProductDoc = {
  _id?: any;
  product_url?: string;
  source?: string;
  currentPrice?: string | number | null;
  previousPrice?: string | number | null;
  stock?: string | null;
  isOutOfStock?: boolean | null;
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

type PersistOutOfStockParams = {
  productUrl: string;
  source: string;
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

function normalizeProductUrl(value: unknown): string {
  const text = toText(value);
  if (!text) return "";

  try {
    const url = new URL(text);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return text.split("#")[0].split("?")[0].replace(/\/$/, "");
  }
}

function urlPathSignature(value: unknown): string {
  const text = toText(value);
  if (!text) return "";

  try {
    const url = new URL(text);
    return `${url.hostname}${url.pathname}`.toLowerCase().replace(/\/$/, "");
  } catch {
    return text.split("#")[0].split("?")[0].toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function getUrlParam(value: unknown, paramName: string): string {
  const text = toText(value);
  if (!text) return "";

  try {
    const url = new URL(text);
    return toText(url.searchParams.get(paramName)).toLowerCase();
  } catch {
    const match = text.match(new RegExp(`[?&]${paramName}=([^&#]+)`, "i"));
    return match ? decodeURIComponent(match[1]).toLowerCase() : "";
  }
}

function productUrlVariants(value: unknown): string[] {
  const raw = toText(value).replace(/\/$/, "");
  const normalized = normalizeProductUrl(raw);
  return Array.from(new Set([raw, normalized].filter(Boolean)));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceAliases(source: string): string[] {
  const normalized = normalizeSource(source);
  if (!normalized) return [];
  if (normalized === "carrefour") return ["carrefour", "carrefouruae"];
  return [normalized];
}

function sameProductUrl(left: unknown, right: unknown): boolean {
  const leftVariants = new Set(productUrlVariants(left));
  const rightVariants = productUrlVariants(right);
  if (rightVariants.some((url) => leftVariants.has(url))) return true;

  const leftPath = urlPathSignature(left);
  const rightPath = urlPathSignature(right);
  if (leftPath && rightPath && leftPath === rightPath) return true;

  const leftModelCode = getUrlParam(left, "modelCode");
  const rightModelCode = getUrlParam(right, "modelCode");
  return Boolean(leftModelCode && rightModelCode && leftModelCode === rightModelCode);
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
    if (!sameProductUrl(offer.product_url, productUrl)) {
      return false;
    }
    const offerSource = normalizeSource(offer.source);
    return aliases.size === 0 || aliases.has(offerSource);
  });
}

async function findGroupedDocByOfferUrl(
  collection: ReturnType<Db["collection"]>,
  productUrl: string,
  source: string
): Promise<GroupedProductDoc | null> {
  const aliases = sourceAliases(source);
  const urls = productUrlVariants(productUrl);
  const sourceMatch = aliases.length > 0 ? { source: { $in: aliases } } : {};
  const projection = {
    product_url: 1,
    source: 1,
    currentPrice: 1,
    previousPrice: 1,
    stock: 1,
    isOutOfStock: 1,
    rating: 1,
    ratingCount: 1,
    average_rating: 1,
    reviews: 1,
    lastUpdatedAtPrice: 1,
    offerItems: 1,
  };

  const exactDoc = await collection.findOne(
    {
      offerItems: {
        $elemMatch: {
          product_url: { $in: urls },
          ...sourceMatch,
        },
      },
    },
    { projection }
  );
  if (exactDoc) return exactDoc as GroupedProductDoc;

  const modelCode = getUrlParam(productUrl, "modelCode");
  if (modelCode) {
    const modelCodeDoc = await collection.findOne(
      {
        offerItems: {
          $elemMatch: {
            product_url: { $regex: `modelCode=${escapeRegExp(modelCode)}`, $options: "i" },
            ...sourceMatch,
          },
        },
      },
      { projection }
    );
    if (modelCodeDoc) return modelCodeDoc as GroupedProductDoc;
  }

  const path = urlPathSignature(productUrl);
  if (path) {
    const pathDoc = await collection.findOne(
      {
        offerItems: {
          $elemMatch: {
            product_url: { $regex: escapeRegExp(path), $options: "i" },
            ...sourceMatch,
          },
        },
      },
      { projection }
    );
    if (pathDoc) return pathDoc as GroupedProductDoc;
  }

  return null;
}

function parsePriceNumber(value: unknown): number | null {
  const numeric = Number(toText(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function isOfferOutOfStock(offer: OfferItem | CachedProductDoc | null | undefined): boolean {
  if (!offer) return false;
  return Boolean(offer.isOutOfStock) || /\bout\s+of\s+stock\b/i.test(toText(offer.stock));
}

function cheapestCurrentPrice(offers: OfferItem[]): string {
  let bestPriceText = "";
  let bestPriceNumber = Number.POSITIVE_INFINITY;

  for (const offer of offers) {
    if (isOfferOutOfStock(offer)) continue;
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
  const urls = productUrlVariants(productUrl);
  const collection = db.collection<GroupedProductDoc>(PRODUCTS_V2_COLLECTION);

  let doc = await findGroupedDocByOfferUrl(collection, productUrl, source);

  if (!doc) {
    doc = await collection.findOne(
      { product_url: { $in: urls } },
      {
        projection: {
          product_url: 1,
          source: 1,
          currentPrice: 1,
          previousPrice: 1,
          stock: 1,
          isOutOfStock: 1,
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
    stock: doc.stock,
    isOutOfStock: doc.isOutOfStock,
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
  if (!toText(doc.currentPrice) && !isOfferOutOfStock(doc)) return false;

  const lastUpdatedAtPriceMs = parseDateMs(doc.lastUpdatedAtPrice);
  if (!lastUpdatedAtPriceMs) return false;

  return Date.now() - lastUpdatedAtPriceMs < PRICE_FRESHNESS_MS;
}

export function buildCachedLivePricePayload(doc: CachedProductDoc) {
  return {
    currentPrice: toText(doc.currentPrice),
    previousPrice: toText(doc.previousPrice),
    stock: toText(doc.stock),
    isOutOfStock: isOfferOutOfStock(doc),
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

  const doc = await findGroupedDocByOfferUrl(collection, productUrl, source);

  if (!doc) {
    throw new Error("Matching products_v2 offer was not found");
  }

  let matchedOffer: OfferItem | null = null;
  const updatedOffers = (Array.isArray(doc.offerItems) ? doc.offerItems : []).map((offer) => {
    const offerSource = normalizeSource(offer.source);
    const isMatch =
      sameProductUrl(offer.product_url, productUrl) &&
      (aliases.length === 0 || aliases.includes(offerSource));

    if (!isMatch) return offer;

    const nextPreviousPrice = toText(previousPrice) || toText(offer.previousPrice);
    const nextRating = toText(rating);
    const nextRatingCount = toText(ratingCount);

    matchedOffer = {
      ...offer,
      currentPrice: toText(currentPrice),
      previousPrice: nextPreviousPrice || offer.previousPrice,
      stock: "In Stock",
      isOutOfStock: false,
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
        stock: topLevelPrice ? "In Stock" : "Out of Stock",
        isOutOfStock: !topLevelPrice,
        lastUpdatedAtPrice: now,
      },
    }
  );

  return {
    currentPrice: toText(currentPrice),
    previousPrice: toText(savedOffer.previousPrice),
    stock: toText(savedOffer.stock),
    isOutOfStock: Boolean(savedOffer.isOutOfStock),
    rating: toText(savedOffer.rating) || toText(savedOffer.average_rating),
    ratingCount: toText(savedOffer.ratingCount) || toText(savedOffer.reviews),
    lastUpdatedAtPrice: now.toISOString(),
  };
}

export async function persistOutOfStockResult({
  productUrl,
  source,
}: PersistOutOfStockParams) {
  const db = await getDb();
  const aliases = sourceAliases(source);
  const collection = db.collection<GroupedProductDoc>(PRODUCTS_V2_COLLECTION);
  const now = new Date();

  const doc = await findGroupedDocByOfferUrl(collection, productUrl, source);

  if (!doc) {
    throw new Error("Matching products_v2 offer was not found");
  }

  let matchedOffer: OfferItem | null = null;
  const updatedOffers = (Array.isArray(doc.offerItems) ? doc.offerItems : []).map((offer) => {
    const offerSource = normalizeSource(offer.source);
    const isMatch =
      sameProductUrl(offer.product_url, productUrl) &&
      (aliases.length === 0 || aliases.includes(offerSource));

    if (!isMatch) return offer;

    matchedOffer = {
      ...offer,
      currentPrice: "",
      stock: "Out of Stock",
      isOutOfStock: true,
      lastUpdatedAtPrice: now,
    };

    return matchedOffer;
  });

  if (!matchedOffer) {
    throw new Error("Matching products_v2 offer was not found");
  }

  const topLevelPrice = cheapestCurrentPrice(updatedOffers);

  await collection.updateOne(
    { _id: doc._id },
    {
      $set: {
        offerItems: updatedOffers,
        currentPrice: topLevelPrice,
        stock: topLevelPrice ? "In Stock" : "Out of Stock",
        isOutOfStock: !topLevelPrice,
        lastUpdatedAtPrice: now,
      },
    }
  );

  return {
    currentPrice: "",
    stock: "Out of Stock",
    isOutOfStock: true,
    lastUpdatedAtPrice: now.toISOString(),
  };
}
