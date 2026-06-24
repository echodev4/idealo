import type { CategoryProduct } from "@/lib/products/types";

function normalizeName(product: CategoryProduct): string {
    return String(product.title || product.suggestedName || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function normalizePrice(product: CategoryProduct): string {
    return String(product.currentPrice || "")
        .trim()
        .replace(/[^\d.]/g, "");
}

function normalizeRatingCount(product: CategoryProduct): string {
    return String(product.ratingCount || "").trim().replace(/[^\d]/g, "");
}

export function dedupeProducts(products: CategoryProduct[]): CategoryProduct[] {
    const seenExact = new Set<string>();
    const seenNameRating = new Set<string>();
    const result: CategoryProduct[] = [];

    for (const product of products) {
        const nameKey = normalizeName(product);
        const priceKey = normalizePrice(product);
        const ratingCountKey = normalizeRatingCount(product);
        const exactKey = `${nameKey}::${priceKey}::${ratingCountKey}`;
        const nameRatingKey = `${nameKey}::${ratingCountKey}`;

        if (seenExact.has(exactKey) || seenNameRating.has(nameRatingKey)) continue;

        seenExact.add(exactKey);
        seenNameRating.add(nameRatingKey);
        result.push(product);
    }

    return result;
}
