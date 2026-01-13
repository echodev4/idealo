"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, Heart, Bell, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const HeaderNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-[60px] items-center justify-between px-4 md:px-6">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <div className="flex items-center gap-3 lg:gap-4">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            {/* Categories (non-navigation placeholder) */}
            <button
              type="button"
              className="hidden items-center gap-2 text-sm font-medium md:flex"
            >
              <Menu className="h-6 w-6" />
              <span>Categories</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Badge (non-navigation placeholder) */}
              <button
                type="button"
                className="relative flex-shrink-0 h-[30px] w-5"
              >
                <div className="absolute top-0 left-0 origin-bottom-left -rotate-[15deg] transform">
                  <div className="bg-[#ffb700] text-black text-[8px] font-bold px-1 rounded-sm leading-tight text-center">
                    25
                    <br />
                    YEARS
                  </div>
                </div>
              </button>

              <Link href="/" className="ml-1">
                <span className="text-3xl font-bold tracking-tight text-white">
                  idealo
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden flex-1 justify-center px-4 md:flex lg:px-8">
            <div className="w-full max-w-lg relative">
              <Input
                type="search"
                placeholder="I'm searching..."
                className="h-11 w-full rounded-md border-0 bg-white pl-4 pr-12 text-sm text-gray-900 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-11 w-11 text-gray-500 hover:bg-transparent"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            <p className="hidden text-xs font-medium lg:flex flex-col items-center">
              <Heart className="h-6 w-6" />
              <span>Wishlist</span>
            </p>
            <p className="hidden text-xs font-medium lg:flex flex-col items-center">
              <Bell className="h-6 w-6" />
              <span>Price alert</span>
            </p>
            <p className="flex flex-col items-center text-xs font-medium">
              <User className="h-6 w-6" />
              <span>Sign in</span>
            </p>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-6 w-6" />
                <span className="sr-only">Open search</span>
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent side="left" className="bg-primary text-primary-foreground p-0">
            <SheetHeader className="flex flex-row items-center justify-between border-b border-white/20 p-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <span className="text-2xl font-bold tracking-tight text-white">
                  idealo
                </span>
              </Link>

              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetTrigger>
            </SheetHeader>

            <div className="p-4">
              <div className="relative mb-4">
                <Input
                  type="search"
                  placeholder="I'm searching..."
                  className="h-11 w-full rounded-md border-0 bg-white pl-4 pr-12 text-sm text-gray-900 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-11 w-11 text-gray-500 hover:bg-transparent"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>

              <nav className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-white/10"
                >
                  <Heart className="h-6 w-6" />
                  <span>Wishlist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-white/10"
                >
                  <Bell className="h-6 w-6" />
                  <span>Price alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-white/10"
                >
                  <User className="h-6 w-6" />
                  <span>Sign in</span>
                </button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default HeaderNavigation;
