import { normalizeMobileSpecs } from "@/lib/matching/mobile/normalizeMobileSpecs";
import { isMobileOffer } from "@/lib/matching/mobile/isMobileOffer";
import type { CategoryProduct } from "@/lib/products/types";

function isSameProduct(a: CategoryProduct, b: CategoryProduct): boolean {
    if (a._id && b._id) return a._id === b._id;
    return a.product_url === b.product_url;
}

export function getMobileOfferCount(
    product: CategoryProduct,
    candidateProducts: CategoryProduct[]
): number {
    const currentSpecs = normalizeMobileSpecs(product);

    if (
        !currentSpecs.model ||
        !currentSpecs.color ||
        currentSpecs.ramGb === null ||
        currentSpecs.storageGb === null
    ) {
        return 0;
    }

    let count = 0;

    for (const candidate of candidateProducts) {
        if (isSameProduct(product, candidate)) continue;

        const candidateSpecs = normalizeMobileSpecs(candidate);

        if (isMobileOffer(currentSpecs, candidateSpecs)) {
            count += 1;
        }
    }

    return count;
}