"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

const breadcrumbsData = [
  {
    name: "Electronics",
    href: "https://www.idealo.de/preisvergleich/SubProductCategory/30311.html",
  },
  {
    name: "Telecommunication",
    href: "https://www.idealo.de/preisvergleich/SubProductCategory/1002.html",
  },
  {
    name: "Mobile Phones & Smartphones",
    href: "https://www.idealo.de/preisvergleich/ProductCategory/19116.html",
  },
  {
    name: "Apple iPhone Air",
    href: "https://www.idealo.de/preisvergleich/OffersOfProduct/207645214_-iphone-air-apple.html",
  },
];

const currentPageName = "1000GB Sky Blue";

const BreadcrumbNavigation = () => {
  const siteUrl = "https://www.idealo.de";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      ...breadcrumbsData.map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: breadcrumb.name,
        item: breadcrumb.href,
      })),
      {
        "@type": "ListItem",
        position: breadcrumbsData.length + 2,
        name: currentPageName,
      },
    ],
  };

  return (
    <div className="bg-background-gray-light">
      <nav aria-label="breadcrumb" className="container py-2">
        <ol className="flex flex-wrap items-center text-[13px]">
          <li className="flex items-center">
            <Link
              href="/"
              className="text-text-secondary hover:text-brand-blue-light"
            >
              <Home className="h-[19px] w-4" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {breadcrumbsData.map((item) => (
            <li key={item.href} className="flex items-center">
              <ChevronRight
                className="mx-1.5 h-2 w-2 text-text-tertiary"
                aria-hidden="true"
              />
              <a
                href={item.href}
                className="text-text-secondary hover:text-brand-blue-light hover:underline"
                rel="noopener noreferrer"
              >
                {item.name}
              </a>
            </li>
          ))}

          {/* Current page */}
          <li className="flex items-center">
            <ChevronRight
              className="mx-1.5 h-2 w-2 text-text-tertiary"
              aria-hidden="true"
            />
            <span
              className="font-medium text-text-primary"
              aria-current="page"
            >
              {currentPageName}
            </span>
          </li>
        </ol>
      </nav>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default BreadcrumbNavigation;
