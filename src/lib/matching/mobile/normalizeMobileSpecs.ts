import { MOBILE_SPEC_ALIASES } from "@/lib/matching/mobile/specAliases";
import {
    normalizeColor,
    normalizeModel,
    parseGbNumber,
} from "@/lib/matching/mobile/valueNormalizers";
import type { CategoryProduct, NormalizedMobileSpecs } from "@/lib/products/types";

function getSpecValue(
    specifications: Record<string, unknown> | undefined,
    aliases: string[]
): unknown {
    if (!specifications || typeof specifications !== "object") return null;

    for (const key of aliases) {
        if (key in specifications) {
            return specifications[key];
        }
    }

    return null;
}

export function normalizeMobileSpecs(product: CategoryProduct): NormalizedMobileSpecs {
    const specifications =
        product.specifications && typeof product.specifications === "object"
            ? product.specifications
            : {};

    const modelRaw = getSpecValue(specifications, MOBILE_SPEC_ALIASES.model) || product.title;
    const colorRaw = getSpecValue(specifications, MOBILE_SPEC_ALIASES.color);
    const ramRaw = getSpecValue(specifications, MOBILE_SPEC_ALIASES.ram);
    const storageRaw = getSpecValue(specifications, MOBILE_SPEC_ALIASES.storage);

    return {
        model: normalizeModel(modelRaw),
        color: normalizeColor(colorRaw),
        ramGb: parseGbNumber(ramRaw),
        storageGb: parseGbNumber(storageRaw),
    };
}