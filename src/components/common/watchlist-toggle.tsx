"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isProductInWatchlist,
  normalizeWatchlistProduct,
  subscribeWatchlist,
  toggleWatchlistProduct,
  type WatchlistInput,
} from "@/lib/watchlist";

type Props = {
  product: WatchlistInput;
  className?: string;
  iconSize?: number;
  buttonSize?: number;
};

export default function WatchlistToggle({
  product,
  className,
  iconSize = 17,
  buttonSize = 10,
}: Props) {
  const normalized = normalizeWatchlistProduct(product);
  const watchlistKey = normalized ? `${normalized.product_url}::${normalized.source}` : "";
  const [isSaved, setIsSaved] = React.useState(() => (normalized ? isProductInWatchlist(normalized) : false));

  React.useEffect(() => {
    setIsSaved(normalized ? isProductInWatchlist(normalized) : false);
  }, [watchlistKey]);

  React.useEffect(() => {
    return subscribeWatchlist(() => {
      setIsSaved(normalized ? isProductInWatchlist(normalized) : false);
    });
  }, [watchlistKey]);

  function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!normalized) return;

    const result = toggleWatchlistProduct(normalized);
    setIsSaved(result.isAdded);
  }

  if (!normalized) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border bg-white transition focus:outline-none focus:ring-2 focus:ring-[#ff6600]/25",
        isSaved
          ? "border-[#ff6600] text-[#ff6600]"
          : "border-[#d1d5db] text-[#7890aa] hover:border-[#ff6600] hover:text-[#ff6600]",
        className
      )}
      style={{ width: buttonSize * 4, height: buttonSize * 4 }}
    >
      <Heart
        size={iconSize}
        fill={isSaved ? "currentColor" : "none"}
        strokeWidth={2.1}
        className="transition-colors"
      />
    </button>
  );
}
