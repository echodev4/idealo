function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeCategory(category: unknown): string {
  return toText(category);
}

function isCarrefourSource(source: unknown): boolean {
  const normalized = toText(source).toLowerCase();
  return normalized === "carrefour" || normalized === "carrefouruae";
}

function isNoonSource(source: unknown): boolean {
  return toText(source).toLowerCase() === "noon";
}

function getModelName(specifications: unknown): string {
  if (!specifications || typeof specifications !== "object" || Array.isArray(specifications)) {
    return "";
  }

  return toText((specifications as Record<string, unknown>)["Model Name"]);
}

type DisplayNameOptions = {
  source?: unknown;
  category?: unknown;
  specifications?: unknown;
};

export function formatProductDisplayName(
  name: unknown,
  options: DisplayNameOptions = {}
): string {
  const normalizedName = toText(name);
  if (!normalizedName) return "";

  if (
    isNoonSource(options.source) &&
    normalizeCategory(options.category) === "Mobile Phones & Smartphones"
  ) {
    const modelName = getModelName(options.specifications);
    if (modelName) {
      return modelName;
    }
  }

  if (isCarrefourSource(options.source) && normalizedName.includes(",")) {
    return normalizedName.split(",")[0].trim();
  }

  return normalizedName;
}
