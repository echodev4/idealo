export type WatchlistInput = {
  _id?: string;
  product_url?: string;
  source?: string;
  product_name?: string;
  title?: string;
  image_url?: string;
  price?: string;
  currentPrice?: string;
  images?: { src?: string; alt?: string }[];
};

export type WatchlistItem = {
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price?: string;
};

const STORAGE_KEY = "ideolo_watchlist_v1";
const WATCHLIST_CHANGE_EVENT = "ideolo-watchlist-change";

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeSource(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function getItemKey(item: Pick<WatchlistItem, "product_url" | "source">) {
  return `${item.product_url}::${normalizeSource(item.source)}`;
}

function dedupeItems(items: WatchlistItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getItemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeWatchlistProduct(input: WatchlistInput | null | undefined): WatchlistItem | null {
  if (!input) return null;

  const product_url = normalizeText(input.product_url);
  const source = normalizeSource(input.source);
  const product_name = normalizeText(input.product_name || input.title);
  const image_url = normalizeText(input.image_url || input.images?.[0]?.src);
  const price = normalizeText(input.price || input.currentPrice);

  if (!product_url || !product_name || !image_url) return null;

  return {
    product_url,
    source,
    product_name,
    image_url,
    price: price || undefined,
  };
}

export function getWatchlistKey(input: WatchlistInput | WatchlistItem | null | undefined) {
  const normalized = "product_name" in (input || {}) || "image_url" in (input || {})
    ? normalizeWatchlistProduct(input as WatchlistInput)
    : null;

  if (!normalized) return "";
  return getItemKey(normalized);
}

export function readWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return dedupeItems(
      parsed
        .map((item) => normalizeWatchlistProduct(item as WatchlistInput))
        .filter((item): item is WatchlistItem => Boolean(item))
    );
  } catch {
    return [];
  }
}

export function writeWatchlist(items: WatchlistItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dedupeItems(items)));
  window.dispatchEvent(new Event(WATCHLIST_CHANGE_EVENT));
}

export function isProductInWatchlist(input: WatchlistInput | WatchlistItem | null | undefined) {
  const key = getWatchlistKey(input);
  if (!key) return false;

  return readWatchlist().some((item) => getItemKey(item) === key);
}

export function toggleWatchlistProduct(input: WatchlistInput | null | undefined) {
  const normalized = normalizeWatchlistProduct(input);
  if (!normalized) {
    return { items: readWatchlist(), isAdded: false };
  }

  const current = readWatchlist();
  const key = getItemKey(normalized);
  const exists = current.some((item) => getItemKey(item) === key);
  const nextItems = exists
    ? current.filter((item) => getItemKey(item) !== key)
    : [normalized, ...current];

  writeWatchlist(nextItems);
  return { items: nextItems, isAdded: !exists };
}

export function subscribeWatchlist(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleChange = () => listener();
  window.addEventListener("storage", handleChange);
  window.addEventListener(WATCHLIST_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(WATCHLIST_CHANGE_EVENT, handleChange);
  };
}

