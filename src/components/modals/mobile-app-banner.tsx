"use client";

import { useState } from "react";
import Image from "next/image";

export default function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-[0_-1px_3px_rgba(0,0,0,0.05)] lg:hidden">
      <div className="container mx-auto px-3 py-2 flex items-center space-x-2">
        <a
          href="https://j24y.adj.st/oop/207702184/1/?adj_t=1hmefqv0_1hnzx4fw&adj_adgroup=B_variant&adj_deep_link=ipc%3A%2F%2Fdeeplink%2Foop%3Fsid%3D207702184%26pid%3D1"
          className="flex-1 flex items-center space-x-3 no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* App Logo */}
          <div className="flex-shrink-0">
            <Image
              src="https://cdn.idealo.com/storage/offerpage/assets/offerpage/img/mobile_app_logo-64324a222bc09d3dd446.png"
              alt="idealo App Logo"
              width={48}
              height={48}
              className="rounded-xl"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-text-primary leading-tight truncate">
              Jetzt Preise vergleichen & sparen!
            </p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-text-secondary">222.000</span>
            </div>
          </div>

          {/* CTA "Zur App" */}
          <div className="flex-shrink-0 pl-2">
            <span className="block bg-brand-blue-light text-primary-foreground font-semibold text-sm py-2 px-3 rounded-md whitespace-nowrap">
              Zur App
            </span>
          </div>
        </a>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-2 self-center flex-shrink-0 -mr-2"
          aria-label="Schließen"
        >
          <Image
            src="https://cdn.idealo.com/storage/offerpage/assets/offerpage/img/close-d7823204560a71ca58b6.svg"
            alt="Schließen"
            width={16}
            height={16}
            className="opacity-60"
          />
        </button>
      </div>
    </div>
  );
}