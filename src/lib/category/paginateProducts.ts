import type { CategoryProduct, PaginatedProductsResult } from "@/lib/products/types";

export function paginateProducts(
    products: CategoryProduct[],
    page: number,
    limit: number
): PaginatedProductsResult {
    const total = products.length;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        total,
        page,
        limit,
        totalPages,
        products: products.slice(start, end),
    };
}