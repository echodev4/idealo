"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Product {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  brand: string;
  storeUrl: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const encodedUrl = encodeURIComponent(product.storeUrl);

  return (
    <Link
      href={`/product/${encodedUrl}`}
      className="group block border border-gray-200 hover:shadow-md transition-all duration-200 rounded-sm bg-white p-3 text-left"
    >
      {/* Image */}
      <div className="relative w-full h-[140px] mb-3 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="200px"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0066CC] transition-colors leading-snug mb-1 line-clamp-2">
        {product.title}
      </h3>

      {/* Brand */}
      <p className="text-xs text-gray-600 mb-1 line-clamp-1">
        {product.brand}
      </p>

      {/* Rating + Reviews */}
      {(product.rating > 0 || product.reviewCount > 0) && (
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
          {product.rating > 0 && (
            <span className="font-medium mr-1">
              {product.rating.toFixed(1)}
            </span>
          )}
          {product.reviewCount > 0 && (
            <span className="text-[11px] text-gray-500">
              ({product.reviewCount.toLocaleString()} reviews)
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <p className="text-sm text-gray-700 mt-auto">
        <span className="text-lg font-bold text-[#E55300]">
          AED {product.price.toFixed(2)}
        </span>
      </p>
    </Link>
  );
}
