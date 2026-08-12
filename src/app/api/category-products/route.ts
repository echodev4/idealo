import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/category/searchProducts";
import { paginateProducts } from "@/lib/category/paginateProducts";
import { enrichCategoryProducts } from "@/lib/category/enrichCategoryProducts";

export const runtime = "nodejs";

const SEARCH_LIMIT = 160;
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

type RankedProduct = {
  product: any;
  score: number;
};

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
        product?.product_name,
        product?.title,
        product?.category,
        product?.main_category,
        product?.category_path_text,
        product?.modelName,
        product?.storage,
        product?.colour,
        product?.specs,
        Array.isArray(product?.sources) ? product.sources.join(" ") : "",
        Array.isArray(product?.offerItems)
          ? product.offerItems
              .map((offer: any) => [offer?.title, offer?.product_name, offer?.source].filter(Boolean).join(" "))
              .join(" ")
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    )
  );

  let score = 0;
  for (const token of queryTokens) {
    if (productTokens.has(token)) {
      score += 1;
    }
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

function shouldApplyStrictFilter(query: string): boolean {
  return normalizeTokens(query).length >= 2;
}

function normalizeGroupName(product: any): string {
  const suggestedName = String(product?.suggestedName || "").trim();
  if (suggestedName) {
    return suggestedName.toLowerCase().replace(/\s+/g, " ");
  }

  return String(product?.product_url || product?._id || "")
    .trim()
    .toLowerCase();
}

function parsePrice(value: unknown): number {
  const text = String(value || "").trim();
  if (!text) return Number.POSITIVE_INFINITY;

  const numeric = Number(text.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : Number.POSITIVE_INFINITY;
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

function getGroupedOfferCount(product: any): number {
  const candidates = [
    product?.variantCount,
    product?.offerCount,
    Array.isArray(product?.offerItems) ? product.offerItems.length : 0,
    Array.isArray(product?.productOffers) ? product.productOffers.length : 0,
  ];

  for (const value of candidates) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  return 1;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20", 10), 1),
      50
    );

    if (q.length < 2) {
      return NextResponse.json({
        total: 0,
        page,
        limit,
        totalPages: 0,
        products: [],
      });
    }

    const searchResult = await searchProducts(q, SEARCH_LIMIT);
    const applyStrictFilter = shouldApplyStrictFilter(q);
    const rankedProducts = [...searchResult.products]
      .map((product) => ({
        product,
        score: scoreProductForQuery(q, product),
      }))
      .filter(({ score }) => (applyStrictFilter ? score > 0 : true))
      .sort((a, b) => b.score - a.score);

    const groupedProducts = groupProductsBySuggestedName(rankedProducts);
    const paginated = paginateProducts(groupedProducts, page, limit);

    const offerCountMap = new Map<string, number>();
    paginated.products.forEach((product) => {
      offerCountMap.set(`${product.product_url}::${product.source || ""}`, getGroupedOfferCount(product));
    });

    const enrichedProducts = enrichCategoryProducts({
      visibleProducts: paginated.products,
      offerCountMap,
    });

    return NextResponse.json({
      total: paginated.total,
      page: paginated.page,
      limit: paginated.limit,
      totalPages: paginated.totalPages,
      products: enrichedProducts,
    });
  } catch (error) {
    console.error("API /category-products error:", error);

    return NextResponse.json(
      {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
        products: [],
      },
      { status: 500 }
    );
  }
}


