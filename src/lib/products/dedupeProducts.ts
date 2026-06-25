import type { CategoryProduct } from "@/lib/products/types";

export function dedupeProducts(products: CategoryProduct[]): CategoryProduct[] {
    const seen = new Set<string>();
    const result: CategoryProduct[] = [];

    for (const product of products) {
        const key = product._id || product.product_url;
        if (!key || seen.has(key)) continue;

        seen.add(key);
        result.push(product);
    }

    return result;
}
