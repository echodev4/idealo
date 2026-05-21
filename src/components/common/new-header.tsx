"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BriefcaseBusiness, ChevronDown, CreditCard, Heart, Menu, Search, User, X } from "lucide-react";

const topBarItems = ["Vouchers"];
const mobileMenuItems = ["Vouchers"];

export default function NewHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);

  const showProductSearch = pathname.startsWith("/category");

  function handleTopBarClick(item: string) {
    if (item === "Vouchers") {
      setMobileMenuOpen(false);
      router.push("/?section=vouchers");
    }
  }

  function submitProductSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchQuery("");
    router.push(`/category/${encodeURIComponent(query)}?view=suggestions`);
  }

  function openCreditCards() {
    setSearchTypeOpen(false);
    router.push("/card-comparison");
  }

  return (
    <header className="landing-upper-toolbar relative z-40 bg-[#032b6b] text-white">
      <div className="landing-page-container mx-auto flex min-h-[42px] max-w-[1440px] items-center justify-between gap-4 px-4 py-1.5 lg:min-h-[46px] lg:px-6">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="landing-toolbar-menu flex h-8 w-8 items-center justify-center rounded-[4px] border border-white/20 lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={20} />}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="landing-toolbar-logo shrink-0 text-[24px] font-bold leading-none text-white sm:text-[26px] lg:text-[28px]"
          aria-label="Ideolo home"
        >
          idea<span className="text-[#ff6a00]">lo</span>
        </button>

        {showProductSearch ? (
          <form
            onSubmit={submitProductSearch}
            className="hidden min-w-0 flex-1 items-center justify-center gap-0 lg:flex"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchTypeOpen((value) => !value)}
                className="flex h-10 min-w-[150px] items-center justify-between gap-2 rounded-l-[4px] border border-white/20 bg-white px-4 text-[15px] font-bold text-[#ff6600]"
                aria-expanded={searchTypeOpen}
              >
                <span className="inline-flex items-center gap-2">
                  <BriefcaseBusiness size={18} />
                  Products
                </span>
                <ChevronDown size={16} className={searchTypeOpen ? "rotate-180 transition" : "transition"} />
              </button>

              {searchTypeOpen ? (
                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-[210px] overflow-hidden rounded-[6px] border border-[#d1d5db] bg-white py-1 text-[#06163a] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                  <button
                    type="button"
                    onClick={() => setSearchTypeOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-semibold text-[#ff6600] hover:bg-[#fff4ed]"
                  >
                    <BriefcaseBusiness size={17} />
                    Products
                  </button>
                  <button
                    type="button"
                    onClick={openCreditCards}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-semibold hover:bg-[#f5f6fa]"
                  >
                    <CreditCard size={17} />
                    Credit Cards
                  </button>
                </div>
              ) : null}
            </div>

            <div className="relative w-full max-w-[520px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 w-full rounded-r-[4px] border border-l-0 border-white/20 bg-white pl-11 pr-4 text-[15px] text-[#111827] outline-none focus:ring-2 focus:ring-[#ff6600]/35"
                placeholder="What are you looking to compare?"
              />
            </div>
          </form>
        ) : null}

        {!showProductSearch ? <div className="hidden flex-1 lg:block" /> : null}

        <div className="landing-toolbar-actions ml-auto flex items-center gap-2 sm:gap-4">
          {topBarItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleTopBarClick(item)}
              className="landing-toolbar-action hidden rounded-[4px] px-2 py-1.5 text-[14px] font-semibold hover:bg-white/10 sm:block"
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="landing-toolbar-action hidden items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] font-semibold hover:bg-white/10 sm:flex"
          >
            <Heart size={18} />
            Watchlist
          </button>
          <button
            type="button"
            className="landing-toolbar-action flex items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] font-semibold hover:bg-white/10"
          >
            <User size={18} />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        </div>
      </div>

      {showProductSearch ? (
        <form onSubmit={submitProductSearch} className="border-t border-white/10 px-4 pb-3 lg:hidden">
          <div className="mx-auto flex max-w-[720px]">
            <button
              type="button"
              onClick={() => setSearchTypeOpen((value) => !value)}
              className="flex h-10 min-w-[118px] items-center justify-center gap-2 rounded-l-[4px] bg-white px-3 text-[13px] font-bold text-[#ff6600]"
            >
              <BriefcaseBusiness size={16} />
              Products
            </button>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 w-full rounded-r-[4px] bg-white pl-9 pr-3 text-[14px] text-[#111827] outline-none"
                placeholder="Search products"
              />
            </div>
          </div>
        </form>
      ) : null}

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-white/10 bg-[#032b6b] shadow-[0_12px_24px_rgba(3,43,107,0.22)] lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-2">
            {mobileMenuItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTopBarClick(item)}
                className="min-h-11 text-left text-[15px] font-semibold text-white/95 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
