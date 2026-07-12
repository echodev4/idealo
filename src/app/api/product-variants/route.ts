import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/category/searchProducts";
import { enrichCategoryProducts } from "@/lib/category/enrichCategoryProducts";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;
const SEARCH_LIMIT = 160;
const VARIANT_LIMIT = 20;

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "new",
  "best",
  "sale",
  "shop",
  "buy",
  "price",
]);

const COLOR_KEYS = [
  "colour name",
  "color name",
  "colour",
  "color",
  "colourname",
  "colorname",
];

const STORAGE_KEYS = [
  "internal memory",
  "internal storage",
  "storage capacity",
  "storage size",
  "built-in storage",
  "builtin storage",
  "rom",
  "storage",
  "memory",
];

const KNOWN_COLORS = [
  "deep blue",
  "sky blue",
  "cobalt violet",
  "desert titanium",
  "natural titanium",
  "black titanium",
  "white titanium",
  "blue titanium",
  "space black",
  "midnight",
  "starlight",
  "silver",
  "black",
  "white",
  "blue",
  "pink",
  "violet",
  "purple",
  "green",
  "yellow",
  "gold",
  "orange",
  "red",
  "gray",
  "grey",
];

type RankedProduct = {
  product: any;
  score: number;
};

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeKey(value: unknown): string {
  return toText(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token && !STOPWORDS.has(token) && (token.length > 1 || /^\d+$/.test(token)));
}

function scoreProductForQuery(query: string, product: any): number {
  const queryTokens = normalizeTokens(query);
  if (queryTokens.length === 0) return 0;

  const productTokens = new Set(
    normalizeTokens(
      [
        product?.suggestedName,
        product?.product_name,
        product?.title,
        product?.category,
        product?.main_category,
        product?.category_path_text,
      ]
        .filter(Boolean)
        .join(" ")
    )
  );

  let score = 0;
  for (const token of queryTokens) {
    if (productTokens.has(token)) score += 1;
  }

  const productText = Array.from(productTokens).join(" ");
  const accessoryTerms = [
    "adapter",
    "band",
    "cable",
    "case",
    "charger",
    "cover",
    "glass",
    "holder",
    "mount",
    "protector",
    "receiver",
    "screen",
    "skin",
  ];

  if (accessoryTerms.some((term) => productText.includes(term))) {
    score -= 1;
  }

  return score;
}

function normalizeGroupName(product: any): string {
  const suggestedName = toText(product?.suggestedName);
  if (suggestedName) return normalizeKey(suggestedName);

  return normalizeKey(product?.product_url || product?._id);
}

function groupProductsBySuggestedName(products: RankedProduct[]): any[] {
  const seen = new Set<string>();
  const groupedProducts: any[] = [];

  products.forEach(({ product }) => {
    const key = normalizeGroupName(product);
    if (!key || seen.has(key)) return;

    seen.add(key);
    groupedProducts.push(product);
  });

  return groupedProducts;
}

function readSpecValue(specifications: unknown, candidates: string[]): string {
  if (!specifications || typeof specifications !== "object" || Array.isArray(specifications)) {
    return "";
  }

  const entries = Object.entries(specifications as Record<string, unknown>)
    .map(([key, value]) => ({
      key: normalizeKey(key),
      value: toText(value),
    }))
    .filter((entry) => entry.key && entry.value);

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeKey(candidate);
    const match = entries.find((entry) => entry.key.includes(normalizedCandidate));
    if (match) return match.value;
  }

  return "";
}

function normalizeStorage(value: string): string {
  const match = value.match(/(\d+(?:\.\d+)?)\s*(tb|gb)\b/i);
  if (!match) return "";

  const amount = Number(match[1]);
  const unit = match[2].toUpperCase();
  if (!Number.isFinite(amount)) return "";

  return `${amount % 1 === 0 ? amount.toFixed(0) : amount} ${unit}`;
}

function extractStorage(product: any): string {
  const specStorage = normalizeStorage(readSpecValue(product?.specifications, STORAGE_KEYS));
  if (specStorage) return specStorage;

  return normalizeStorage(
    [product?.suggestedName, product?.title, product?.product_name].filter(Boolean).join(" ")
  );
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function extractColor(product: any): string {
  const specColor = readSpecValue(product?.specifications, COLOR_KEYS);
  if (specColor) return titleCase(specColor);

  const name = normalizeKey(
    [product?.suggestedName, product?.title, product?.product_name].filter(Boolean).join(" ")
  );

  const color = KNOWN_COLORS
    .sort((a, b) => b.length - a.length)
    .find((candidate) => name.includes(candidate));

  return color ? titleCase(color) : "";
}

function isMobileProduct(product: any): boolean {
  return Boolean(extractColor(product) && extractStorage(product));
}

function getSearchQuery(product: any, fallbackName: string): string {
  return (
    toText(product?.suggestedName) ||
    toText(product?.title) ||
    toText(product?.product_name) ||
    fallbackName
  );
}

function parsePrice(value: unknown): number {
  const text = toText(value);
  if (!text) return Number.POSITIVE_INFINITY;

  const numeric = Number(text.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : Number.POSITIVE_INFINITY;
}

async function fetchSelectedProduct(productUrl: string, source: string) {
  if (!BASE_URL) {
    throw new Error("SCRAPER_API_BASE_URL is not defined");
  }

  const res = await fetch(`${BASE_URL}/lookup/by-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_url: productUrl,
      source,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Variant selected product lookup failed: ${errorText}`);
  }

  return res.json();
}

async function enrichWithOfferCounts(products: any[]) {
  if (!BASE_URL || products.length === 0) return products;

  const countRes = await fetch(`${BASE_URL}/offers/count-by-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: products.map((product) => ({
        product_url: product.product_url,
        source: product.source || "",
      })),
    }),
    cache: "no-store",
  });

  if (!countRes.ok) {
    const errorText = await countRes.text();
    throw new Error(`Variant offer count backend error: ${errorText}`);
  }

  const countJson = await countRes.json();
  const offerCountMap = new Map<string, number>();
  const displayImageMap = new Map<string, any>();
  const results = Array.isArray(countJson?.results) ? countJson.results : [];

  for (const item of results) {
    const key = `${item?.product_url || ""}::${item?.source || ""}`;
    offerCountMap.set(key, Number(item?.offer_count || 0));
    displayImageMap.set(key, {
      displayImages: Array.isArray(item?.display_images) ? item.display_images : [],
      displayImageUrl: typeof item?.display_image_url === "string" ? item.display_image_url : "",
      displaySource: typeof item?.display_source === "string" ? item.display_source : "",
      displayProductUrl: typeof item?.display_product_url === "string" ? item.display_product_url : "",
    });
  }

  return enrichCategoryProducts({
    visibleProducts: products.map((product) => {
      const displayImage = displayImageMap.get(`${product.product_url}::${product.source || ""}`);
      if (!displayImage) return product;

      return {
        ...product,
        displayImages: displayImage.displayImages,
        displayImageUrl: displayImage.displayImageUrl,
        displaySource: displayImage.displaySource,
        displayProductUrl: displayImage.displayProductUrl,
      };
    }),
    offerCountMap,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productUrl = toText(body?.product_url);
    const source = toText(body?.source);
    const fallbackName = toText(body?.product_name);

    if (!productUrl) {
      return NextResponse.json(
        { success: false, isMobileProduct: false, variants: [], error: "product_url is required" },
        { status: 400 }
      );
    }

    const selectedProduct = await fetchSelectedProduct(productUrl, source);

    if (!isMobileProduct(selectedProduct)) {
      return NextResponse.json({
        success: true,
        isMobileProduct: false,
        variants: [],
        filters: { colors: [], memories: [] },
      });
    }

    const query = getSearchQuery(selectedProduct, fallbackName);
    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        isMobileProduct: true,
        variants: [],
        filters: { colors: [], memories: [] },
      });
    }

    const searchResult = await searchProducts(query, SEARCH_LIMIT);
    const rankedProducts = [...searchResult.products]
      .map((product) => ({
        product,
        score: scoreProductForQuery(query, product),
      }))
      .filter(({ product, score }) => score > 0 && isMobileProduct(product))
      .sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        return parsePrice(a.product?.currentPrice) - parsePrice(b.product?.currentPrice);
      });

    const groupedProducts = groupProductsBySuggestedName(rankedProducts).slice(0, VARIANT_LIMIT);
    const enrichedProducts = await enrichWithOfferCounts(groupedProducts);

    const variants = enrichedProducts.map((product) => ({
      ...product,
      variantColor: extractColor(product),
      variantMemory: extractStorage(product),
    }));

    const colors = Array.from(new Set(variants.map((product) => product.variantColor).filter(Boolean))).sort();
    const memories = Array.from(new Set(variants.map((product) => product.variantMemory).filter(Boolean))).sort(
      (a, b) => parsePrice(a) - parsePrice(b)
    );

    return NextResponse.json({
      success: true,
      isMobileProduct: true,
      variants,
      filters: { colors, memories },
    });
  } catch (error) {
    console.error("API /product-variants error:", error);

    return NextResponse.json(
      { success: false, isMobileProduct: false, variants: [], filters: { colors: [], memories: [] } },
      { status: 500 }
    );
  }
}
