"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, User, X } from "lucide-react";

const topBarItems = ["Vouchers"];
const mobileMenuItems = ["Vouchers"];

export default function NewHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleTopBarClick(item: string) {
    if (item === "Vouchers") {
      setMobileMenuOpen(false);
      router.push("/?section=vouchers");
    }
  }

  return (
    <header className="landing-upper-toolbar relative z-40 bg-[#032b6b] text-white">
      <div className="landing-page-container mx-auto flex h-[42px] max-w-[1440px] items-center justify-between gap-4 px-4 lg:h-[46px] lg:px-6">
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
