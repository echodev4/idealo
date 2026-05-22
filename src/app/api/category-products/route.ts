import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/category/searchProducts";
import { paginateProducts } from "@/lib/category/paginateProducts";
import { enrichCategoryProducts } from "@/lib/category/enrichCategoryProducts";

export const runtime = "nodejs";

const CANDIDATE_LIMIT = 160;
const BASE_URL = process.env.SCRAPER_API_BASE_URL;

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

    const searchResult = await searchProducts(q, CANDIDATE_LIMIT);
    const paginated = paginateProducts(searchResult.products, page, limit);

    const countPayload = {
      items: paginated.products.map((product) => ({
        product_url: product.product_url,
        source: product.source || "",
      })),
      candidate_limit: CANDIDATE_LIMIT,
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
