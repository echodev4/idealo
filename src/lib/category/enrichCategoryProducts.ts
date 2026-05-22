import type { CategoryProduct } from "@/lib/products/types";
import {
    normalizeProductSource,
    PRODUCT_PLACEHOLDER_SRC,
} from "@/lib/products/imageFallback";

type EnrichCategoryProductsParams = {
    visibleProducts: CategoryProduct[];
    offerCountMap: Map<string, number>;
};

type ProductImage = { src: string; alt?: string };

function getProductKey(product: CategoryProduct): string {
    return `${product.product_url}::${product.source || ""}`;
}

function isSharafdgProduct(product: CategoryProduct): boolean {
    return normalizeProductSource(product.source) === "sharafdg";
}

function isUsableImage(src: string): boolean {
    return Boolean(src && src !== PRODUCT_PLACEHOLDER_SRC);
}

function getProductAlt(product: CategoryProduct): string {
    return product.title || "Product image";
}

function getSharafOfferDisplayImages(product: CategoryProduct): ProductImage[] {
    if (!Array.isArray(product.displayImages)) return [];

    return product.displayImages
        .map((image) => ({
            src: String(image?.src || "").trim(),
            alt: String(image?.alt || "").trim() || getProductAlt(product),
        }))
        .filter((image) => isUsableImage(image.src));
}

function getSharafFallbackImage(
    products: CategoryProduct[],
    sharafIndex: number,
    usedImageSrcs: Set<string>
): ProductImage | null {
    const indexedCandidates = products
        .map((product, index) => ({ product, index }))
        .filter(({ product, index }) => index !== sharafIndex && !isSharafdgProduct(product))
        .sort((a, b) => {
            const distanceDiff =
                Math.abs(a.index - sharafIndex) - Math.abs(b.index - sharafIndex);

            if (distanceDiff !== 0) return distanceDiff;
            return a.index - b.index;
        });

    for (const { product } of indexedCandidates) {
        for (const image of product.images || []) {
            const src = String(image?.src || "").trim();
            if (!isUsableImage(src) || usedImageSrcs.has(src)) continue;

            return {
                src,
                alt: image?.alt || getProductAlt(product),
            };
        }
    }

    return null;
}

export function enrichCategoryProducts({
    visibleProducts,
    offerCountMap,
}: EnrichCategoryProductsParams): CategoryProduct[] {
    const usedFallbackImageSrcs = new Set<string>();

    return visibleProducts.map((product, index) => {
        const enrichedProduct: CategoryProduct = {
            ...product,
            offerCount: Math.max(1, offerCountMap.get(getProductKey(product)) || 0),
        };

        const primaryImage = String(enrichedProduct.images?.[0]?.src || "").trim();

        if (!isSharafdgProduct(enrichedProduct) || isUsableImage(primaryImage)) {
            return enrichedProduct;
        }

        const offerDisplayImages = getSharafOfferDisplayImages(enrichedProduct);
        if (offerDisplayImages.length > 0) {
            return {
                ...enrichedProduct,
                images: offerDisplayImages,
            };
        }

        const fallbackImage = getSharafFallbackImage(
            visibleProducts,
            index,
            usedFallbackImageSrcs
        );

        if (!fallbackImage) {
            return enrichedProduct;
        }

        usedFallbackImageSrcs.add(fallbackImage.src);

        return {
            ...enrichedProduct,
            images: [
                {
                    src: fallbackImage.src,
                    alt: fallbackImage.alt || getProductAlt(enrichedProduct),
                },
            ],
        };
    });
}
