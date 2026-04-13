import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/category/searchProducts";
import { paginateProducts } from "@/lib/category/paginateProducts";
import { enrichCategoryProducts } from "@/lib/category/enrichCategoryProducts";

export const runtime = "nodejs";

const CANDIDATE_LIMIT = 160;

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

    const searchResult = await searchProducts(q, CANDIDATE_LIMIT);

    const paginated = paginateProducts(searchResult.products, page, limit);

    const enrichedProducts = enrichCategoryProducts({
      visibleProducts: paginated.products,
      candidateProducts: searchResult.products,
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