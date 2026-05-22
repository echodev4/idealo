"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import WatchlistToggle from "@/components/common/watchlist-toggle";
import { readWatchlist, subscribeWatchlist, type WatchlistItem } from "@/lib/watchlist";

function formatPrice(value?: string) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const amount = Number(raw.replace(/,/g, "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return raw;

  return `AED ${amount.toLocaleString("en-AE", {
    maximumFractionDigits: 2,
  })}`;
}

function getProductHref(item: WatchlistItem) {
  return `/product/${encodeURIComponent(item.product_url)}?product_name=${encodeURIComponent(item.product_name)}&source=${encodeURIComponent(
    item.source
  )}`;
}

function WatchlistCard({ item }: { item: WatchlistItem }) {
  const href = getProductHref(item);

  return (
    <div className="relative rounded-[8px] bg-white p-3 shadow-[0_4px_14px_rgba(6,22,58,0.08)] sm:p-4">
      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        <WatchlistToggle product={item} iconSize={16} buttonSize={9} className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>

      <Link href={href} className="block">
        <div className="relative mx-auto h-[150px] w-full max-w-[220px]">
          <Image src={item.image_url} alt={item.product_name} fill className="object-contain" sizes="(max-width: 640px) 46vw, 220px" />
        </div>
      </Link>

      <div className="mt-3">
        <Link href={href} className="block">
          <div className="min-h-[48px] text-[14px] font-bold leading-5 text-[#06163a] hover:text-[#ff6600] sm:text-[15px]">
            {item.product_name}
          </div>
        </Link>
        {item.price ? (
          <div className="mt-2 text-[15px] font-bold text-[#ff6600] sm:text-[16px]">
            {formatPrice(item.price)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = React.useState<WatchlistItem[]>([]);

  React.useEffect(() => {
    const sync = () => setItems(readWatchlist());

    sync();
    return subscribeWatchlist(sync);
  }, []);

  return (
    <main className="bg-[#f5f6fa]">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-5 md:px-6 md:py-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold leading-tight text-[#06163a] md:text-[28px]">
              Watchlist
            </h1>
            <p className="mt-1 text-[13px] text-[#526175]">
              {items.length} saved {items.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => (
              <WatchlistCard key={`${item.product_url}::${item.source}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] bg-white p-6 text-center shadow-[0_4px_14px_rgba(6,22,58,0.08)]">
            <div className="text-[16px] font-bold text-[#06163a]">Your watchlist is empty.</div>
            <div className="mt-2 text-[13px] text-[#526175]">
              Add products by tapping the heart on product cards.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
