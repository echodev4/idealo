import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/category/searchProducts";
import { paginateProducts } from "@/lib/category/paginateProducts";
import { enrichCategoryProducts } from "@/lib/category/enrichCategoryProducts";

export const runtime = "nodejs";

const BASE_URL = process.env.SCRAPER_API_BASE_URL;
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
  const groups = new Map<
    string,
    {
      product: any;
      price: number;
      order: number;
    }
  >();

  products.forEach(({ product }, index) => {
    const key = normalizeGroupName(product);
    if (!key) return;

    const price = parsePrice(product?.currentPrice ?? product?.price);
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, { product, price, order: index });
      return;
    }

    if (price < existing.price) {
      groups.set(key, { product, price, order: existing.order });
    }
  });

  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .map(({ product }) => product);
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

    if (!BASE_URL) {
      throw new Error("SCRAPER_API_BASE_URL is not defined");
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

    const countPayload = {
      items: paginated.products.map((product) => ({
        product_url: product.product_url,
        source: product.source || "",
      })),
    };

    const countRes = await fetch(`${BASE_URL}/offers/count-by-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(countPayload),
      cache: "no-store",
    });

    if (!countRes.ok) {
      const errorText = await countRes.text();
      throw new Error(`Offer count backend error: ${errorText}`);
    }

    const countJson = await countRes.json();

    const offerCountMap = new Map<string, number>();
    const displayImageMap = new Map<
      string,
      {
        displayImages: { src: string; alt?: string }[];
        displayImageUrl: string;
        displaySource: string;
        displayProductUrl: string;
      }
    >();
    const results = Array.isArray(countJson?.results) ? countJson.results : [];

    for (const item of results) {
      const key = `${item?.product_url || ""}::${item?.source || ""}`;
      offerCountMap.set(key, Number(item?.offer_count || 0));

      displayImageMap.set(key, {
        displayImages: Array.isArray(item?.display_images) ? item.display_images : [],
        displayImageUrl:
          typeof item?.display_image_url === "string" ? item.display_image_url : "",
        displaySource: typeof item?.display_source === "string" ? item.display_source : "",
        displayProductUrl:
          typeof item?.display_product_url === "string" ? item.display_product_url : "",
      });
    }

    const enrichedProducts = enrichCategoryProducts({
      visibleProducts: paginated.products.map((product) => {
        const displayImage = displayImageMap.get(
          `${product.product_url}::${product.source || ""}`
        );

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


