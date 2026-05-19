"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { CreditCard, Heart, Menu, User } from "lucide-react";

const landingTopBarItems = ["Vouchers"];
const defaultTopBarItems = [
  "Categories",
  "Popular Products",
  "Deals",
  "Top 3 Quotes",
  "Credit Cards",
  "Tire Replacement",
];

export default function NewHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const topBarItems = isLandingPage ? landingTopBarItems : defaultTopBarItems;

  function handleTopBarClick(item: string) {
    if (item === "Vouchers") {
      router.push("/?section=vouchers");
      return;
    }

    if (item === "Credit Cards") {
      router.push("/card-comparison");
    }
  }

  return (
    <header className="landing-upper-toolbar bg-[#032b6b] text-white">
      <div
        className={`landing-page-container mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6 ${
          isLandingPage ? "h-[74px] lg:h-[80px]" : "py-4"
        }`}
      >
        <button
          type="button"
          className="landing-toolbar-menu flex h-10 w-10 items-center justify-center rounded-[4px] border border-white/20 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="landing-toolbar-logo shrink-0 text-[28px] font-bold leading-none text-white sm:text-[32px] lg:text-[34px]"
          aria-label="Ideolo home"
        >
          idea<span className="text-[#ff6a00]">lo</span>
        </button>

        <nav className="landing-toolbar-nav hidden items-center gap-6 text-[15px] font-semibold lg:flex">
          {topBarItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleTopBarClick(item)}
              className="landing-toolbar-link text-white/95 hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="landing-toolbar-actions flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="landing-toolbar-action hidden items-center gap-2 rounded-[4px] px-2 py-2 text-[14px] font-semibold hover:bg-white/10 sm:flex"
          >
            <Heart size={18} />
            Watchlist
          </button>
          {!isLandingPage && (
            <button
              type="button"
              onClick={() => router.push("/card-comparison")}
              className="landing-toolbar-action hidden items-center gap-2 rounded-[4px] px-2 py-2 text-[14px] font-semibold hover:bg-white/10 sm:flex"
            >
              <CreditCard size={18} />
              Credit Card
            </button>
          )}
          <button
            type="button"
            className="landing-toolbar-action flex items-center gap-2 rounded-[4px] px-2 py-2 text-[14px] font-semibold hover:bg-white/10"
          >
            <User size={18} />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        </div>
      </div>
    </header>
  );
}
