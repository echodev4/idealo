import { MOBILE_CASE_CATEGORIES } from "@/lib/matching/cases";
import type { CategoryProduct, ProductCase } from "@/lib/products/types";

export function getProductCase(product: CategoryProduct): ProductCase {
    const category = (product.category || "").trim();

    if (MOBILE_CASE_CATEGORIES.includes(category)) {
        return "mobile";
    }

    return "unknown";
}