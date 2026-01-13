"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Bell, User2, Search, Loader2, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useRouter } from "next/navigation";

// small debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const SkipLinks = () => {
  const { t } = useLanguage();
  return (
    <nav>
      <ul className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:p-4 focus-within:bg-white focus-within:text-black focus-within:z-50">
        <li><a href="#i-header-navigation">{t("header.skipLinks.navigation")}</a></li>
        <li><a href="#i-header-search">{t("header.skipLinks.search")}</a></li>
        <li><a href="#main">{t("header.skipLinks.main")}</a></li>
      </ul>
    </nav>
  );
};

export default function Header() {
  const { t, direction } = useLanguage();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // debounce query by 1000ms
  const debouncedQuery = useDebounce(query, 1200);

  const handleSearchClick = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setQuery("")
    setShowDropdown(false)
    router.push(`/category/${query}`);
  };

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/`);
  };

  // fetch suggestions
  useEffect(() => {
    let isActive = true; // guards against state updates after unmount

    const fetchProducts = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 3) {
        if (isActive) {
          setResults([]);
          setShowDropdown(false);
        }
        return;
      }

      try {
        setLoading(true);
        setShowDropdown(true);

        const res = await fetch(
          `/api/search-products?q=${encodeURIComponent(debouncedQuery)}`
        );

        const data = await res.json();

        if (isActive) {
          setResults(data.data || []);
        }
      } catch (err) {
        console.error("Search suggestion fetch failed:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Prevent state updates after unmount
    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);


  // close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <SkipLinks />
      <header
        id="header-idealo"
        className="bg-[#24456f] text-white font-sans sticky top-0 z-[10000]"
      >
        <div className="hidden md:block">
          <div className="container mx-auto flex justify-between items-center text-xs py-1 px-4">
            <nav id="i-header-navigation">
              <ul className="flex items-center text-sm" role="menu">
                <li role="none">
                  <span
                    className="font-semibold cursor-default px-2"
                    onClick={handleClick}
                  >
                    {t("header.navigation.shopping")}
                  </span>
                </li>
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
        </div>

        <div className="container mx-auto flex items-center justify-between px-4 h-16 relative">
          <div
            className="flex-1 max-w-xl mx-4 hidden md:block relative"
            ref={dropdownRef}
          >
            <form
              id="i-header-search"
              role="search"
              className="relative"
              onSubmit={handleSearchClick}
            >
              <Input
                type="search"
                id="i-search-input"
                placeholder={t("header.search.placeholder")}
                className="bg-white text-gray-900 rounded-full h-11 w-full pl-6 pr-16 text-base"
                aria-label={t("header.search.placeholder")}
                dir={direction}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
              />
              <Button
                type="submit"
                className={`absolute ${direction === "rtl" ? "left-1" : "right-1"
                  } top-1/2 -translate-y-1/2 h-9 w-12 bg-[#FF6600] hover:bg-orange-600 rounded-full flex items-center justify-center p-0`}
                aria-label={t("header.search.searchButton")}
              >
                <Search size={20} className="text-white" />
              </Button>
            </form>

            {/* Suggestions dropdown */}
            {showDropdown && debouncedQuery && (
              <div className="absolute mt-1 w-full bg-white text-black shadow-lg rounded-md max-h-80 overflow-y-auto z-50">
                {loading ? (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : results.length > 0 ? (
                  <ul>
                    {results.map((item: string, index: number) => (
                      <li key={index}>
                        <Link
                          href={`/category/${item}`}
                          className="block px-4 py-2 hover:bg-gray-100 truncate"
                          onClick={() => {
                            setQuery("")
                            setShowDropdown(false)
                          }}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 text-sm text-gray-600">No results found</div>
                )}
              </div>
            )}
          </div>

          <div
            className={`flex items-center space-x-2 md:space-x-4 ${direction === "rtl" ? "flex-row-reverse space-x-reverse" : ""
              }`}
          >
            <button
              className="md:hidden p-1"
              aria-label={t("header.search.searchButton")}
            >
              <Search size={24} />
            </button>
            <p
              className="hidden md:flex flex-col items-center cursor-pointer space-y-1 text-xs hover:opacity-80 transition-opacity"
              onClick={()=>router.push("/card-comparison")}
            >
              <CreditCard size={24} />
              <span>{t("header.userActions.card")}</span>
            </p>
            <p
              className="hidden md:flex flex-col items-center cursor-pointer space-y-1 text-xs hover:opacity-80 transition-opacity"
            >
              <Heart size={24} />
              <span>{t("header.userActions.wishlist")}</span>
            </p>
            <p
              className="hidden md:flex flex-col items-center cursor-pointer space-y-1 text-xs hover:opacity-80 transition-opacity"
            >
              <Bell size={24} />
              <span>{t("header.userActions.priceAlert")}</span>
            </p>
            <p
              className="hidden md:flex flex-col cursor-pointer items-center space-y-1 text-xs hover:opacity-80 transition-opacity"
            >
              <User2 size={24} />
              <span>{t("header.userActions.login")}</span>
            </p>
            <div className="md:hidden">
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
