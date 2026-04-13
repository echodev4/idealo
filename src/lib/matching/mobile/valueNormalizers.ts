function cleanText(value: unknown): string {
    if (value === null || value === undefined) return "";
    return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeModel(value: unknown): string | null {
    const cleaned = cleanText(value)
        .replace(/[,_/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return cleaned || null;
}

function detectBaseColor(color: string): string {
    const lower = color.toLowerCase();

    const baseColors = [
        "black",
        "white",
        "silver",
        "gold",
        "blue",
        "red",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "gray",
        "grey",
        "brown",
        "beige",
    ];

    for (const base of baseColors) {
        if (lower.includes(base)) {
            return base === "grey" ? "gray" : base;
        }
    }

    return lower;
}

export function normalizeColor(value: unknown): string | null {
    const cleaned = cleanText(value);
    if (!cleaned) return null;

    return detectBaseColor(cleaned);
}

export function parseGbNumber(value: unknown): number | null {
    if (value === null || value === undefined) return null;

    const str = String(value).toLowerCase().trim();
    if (!str) return null;

    const match = str.match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;

    const num = Number(match[1]);
    if (!Number.isFinite(num)) return null;

    return Math.round(num);
}