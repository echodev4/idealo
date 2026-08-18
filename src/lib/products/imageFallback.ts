const SHARAFDG_SOURCE = "sharafdg";
export const PRODUCT_PLACEHOLDER_SRC = "/placeholder.png";
const SECOND_IMAGE_SOURCE_SET = new Set(["jumbo", "jackys", "istyle", "eros", "samsung"]);
const BAD_IMAGE_KEYWORDS = [
    "tdra",
    "qr",
    "barcode",
    "warranty",
    "certificate",
    "certification",
    "energy",
    "label",
    "badge",
    "card",
];
const STRONG_PRODUCT_IMAGE_PATTERNS = [
    "pdp_image_position_1",
    "image_position_1",
    "position_1",
    "_1.",
    "-1.",
];

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

function normalizeImageText(value: unknown): string {
    return toText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function productTokens(input: ProductImageInput): string[] {
    const text = normalizeImageText(`${toText(input.title)} ${toText(input.product_name)}`);
    const stopWords = new Set(["with", "only", "version", "smartphone", "phone", "mobile"]);
    return text
        .split(/\s+/)
        .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function scoreProductImage(
    image: { src: string; alt: string },
    input: ProductImageInput,
    index: number
): number {
    const sourceText = String(image.src || "").toLowerCase();
    const combinedText = `${sourceText} ${String(image.alt || "").toLowerCase()}`;
    const normalizedText = normalizeImageText(combinedText);
    let score = Math.max(0, 20 - index);

    for (const pattern of STRONG_PRODUCT_IMAGE_PATTERNS) {
        if (sourceText.includes(pattern)) score += 80;
    }

    for (const keyword of BAD_IMAGE_KEYWORDS) {
        if (normalizedText.includes(keyword)) score -= 120;
    }

    for (const token of productTokens(input)) {
        if (normalizedText.includes(token)) score += 4;
    }

    return score;
}

function sortBestProductImages(
    images: { src: string; alt: string }[],
    input: ProductImageInput
): { src: string; alt: string }[] {
    if (!SECOND_IMAGE_SOURCE_SET.has(normalizeProductSource(input.source))) {
        return images;
    }

    return images
        .map((image, index) => ({
            image,
            index,
            score: scoreProductImage(image, input, index),
        }))
        .sort((a, b) => {
            const scoreDiff = b.score - a.score;
            if (scoreDiff !== 0) return scoreDiff;
            return a.index - b.index;
        })
        .map((item) => item.image);
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

        if (validImages.length > 0) return sortBestProductImages(validImages, input);
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
    return resolvePrimaryProductImage(input);
}
