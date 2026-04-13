import { getProductCase } from "@/lib/matching/getProductCase";
import { getMobileOfferCount } from "@/lib/matching/mobile/getMobileOfferCount";
import type { CategoryProduct } from "@/lib/products/types";

type EnrichCategoryProductsParams = {
    visibleProducts: CategoryProduct[];
    candidateProducts: CategoryProduct[];
};

export function enrichCategoryProducts({
    visibleProducts,
    candidateProducts,
}: EnrichCategoryProductsParams): CategoryProduct[] {
    return visibleProducts.map((product) => {
        const productCase = getProductCase(product);

        if (productCase !== "mobile") {
            return {
                ...product,
                offerCount: 0,
            };
        }

        return {
            ...product,
            offerCount: getMobileOfferCount(product, candidateProducts),
        };
    });
}