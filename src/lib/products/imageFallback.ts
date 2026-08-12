const SHARAFDG_SOURCE = "sharafdg";
export const PRODUCT_PLACEHOLDER_SRC = "/placeholder.jpg";
const SECOND_IMAGE_SOURCE_SET = new Set(["jumbo", "jackys", "istyle", "eros", "samsung"]);

type ProductImageInput = {
    source?: unknown;
    image_url?: unknown;
    images?: Array<{ src?: unknown; alt?: unknown }> | null;
    title?: unknown;
    product_name?: unknown;
};

function toText(value: unknown): string {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

export function normalizeProductSource(source: unknown): string {
    const value = toText(source).toLowerCase();
    const compact = value.replace(/[^a-z0-9]/g, "");

    if (compact === "sharafdg") return SHARAFDG_SOURCE;
    if (compact === "carrefouruae") return "carrefour";

    return value;
}

export function shouldUseSharafdgPlaceholder(source: unknown): boolean {
    return normalizeProductSource(source) === SHARAFDG_SOURCE;
}

function getImageAlt(input: ProductImageInput): string {
    return toText(input.title) || toText(input.product_name) || "Product image";
}

export function resolveProductImages(input: ProductImageInput): { src: string; alt: string }[] {
    const alt = getImageAlt(input);

    if (shouldUseSharafdgPlaceholder(input.source)) {
        return [{ src: PRODUCT_PLACEHOLDER_SRC, alt }];
    }

    if (Array.isArray(input.images) && input.images.length > 0) {
        const validImages = input.images
            .map((img) => ({
                src: toText(img?.src),
                alt: toText(img?.alt) || alt,
            }))
            .filter((img) => img.src);

        if (validImages.length > 0) return validImages;
    }

    const fallback = toText(input.image_url);
    return fallback ? [{ src: fallback, alt }] : [];
}

export function resolvePrimaryProductImage(input: ProductImageInput): string {
    return resolveProductImages(input)[0]?.src || "";
}

export function shouldPreferSecondProductImage(source: unknown): boolean {
    return SECOND_IMAGE_SOURCE_SET.has(normalizeProductSource(source));
}

export function resolvePreferredProductImage(input: ProductImageInput): string {
    if (shouldPreferSecondProductImage(input.source)) {
        const secondImage = Array.isArray(input.images) ? toText(input.images[1]?.src) : "";
        if (secondImage) return secondImage;
    }

    return resolvePrimaryProductImage(input);
}
