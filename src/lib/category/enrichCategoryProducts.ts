import type { CategoryProduct } from "@/lib/products/types";

type EnrichCategoryProductsParams = {
    visibleProducts: CategoryProduct[];
    offerCountMap: Map<string, number>;
};

function getProductKey(product: CategoryProduct): string {
    return `${product.product_url}::${product.source || ""}`;
}

export function enrichCategoryProducts({
    visibleProducts,
    offerCountMap,
}: EnrichCategoryProductsParams): CategoryProduct[] {
    return visibleProducts.map((product) => ({
        ...product,
        offerCount: offerCountMap.get(getProductKey(product)) || 0,
    }));
}