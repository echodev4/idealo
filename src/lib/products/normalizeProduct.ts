import type { CategoryProduct, RawProduct } from "@/lib/products/types";

function toText(value: unknown): string {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function normalizeImage(raw: RawProduct): { src: string; alt?: string }[] {
    const title = toText(raw.title || raw.product_name);

    if (Array.isArray(raw.images) && raw.images.length > 0) {
        const validImages = raw.images
            .map((img) => ({
                src: toText(img?.src),
                alt: toText(img?.alt) || title,
            }))
            .filter((img) => img.src);

        if (validImages.length > 0) return validImages;
    }

    const fallback = toText(raw.image_url);
    return fallback ? [{ src: fallback, alt: title }] : [];
}

export function normalizeFaissProduct(raw: RawProduct): CategoryProduct | null {
    const id = toText(raw._id);
    const productUrl = toText(raw.product_url);
    const title = toText(raw.title || raw.product_name);
    const images = normalizeImage(raw);

    const currentPrice = toText(
        raw.currentPrice !== undefined && raw.currentPrice !== null && raw.currentPrice !== ""
            ? raw.currentPrice
            : raw.price
    );

    const previousPrice = toText(
        raw.previousPrice !== undefined && raw.previousPrice !== null && raw.previousPrice !== ""
            ? raw.previousPrice
            : raw.old_price
    );

    if (!id || !productUrl || !title || images.length === 0 || !currentPrice) {
        return null;
    }

    return {
        _id: id,
        product_url: productUrl,
        title,
        currentPrice,
        previousPrice: previousPrice || "",
        discountPercentage: toText(raw.discount),
        rating:
            raw.average_rating !== null && raw.average_rating !== undefined
                ? String(raw.average_rating)
                : "",
        ratingCount: toText(raw.reviews),
        images,
        category_path_text: toText(raw.category_path_text),
        category: toText(raw.category),
        main_category: toText(raw.main_category),
        source: toText(raw.source),
        source_record_id: id,
        scraped_at: toText(raw.scraped_at || raw.created_at || raw.inserted_at),
        offerCount: 0,
        faiss_score: typeof raw.faiss_score === "number" ? raw.faiss_score : undefined,
        specifications:
            raw.specifications && typeof raw.specifications === "object"
                ? raw.specifications
                : {},
    };
}