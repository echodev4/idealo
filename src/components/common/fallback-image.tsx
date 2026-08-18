"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { PRODUCT_PLACEHOLDER_SRC } from "@/lib/products/imageFallback";

type FallbackImageProps = Omit<ImageProps, "src"> & {
  src?: string;
  fallbackSrc?: string;
};

export default function FallbackImage({
  src,
  fallbackSrc = PRODUCT_PLACEHOLDER_SRC,
  alt,
  onError,
  ...rest
}: FallbackImageProps) {
  const safePrimarySrc = String(src || "").trim() || fallbackSrc;
  const safeFallbackSrc = String(fallbackSrc || "").trim() || PRODUCT_PLACEHOLDER_SRC;
  const [currentSrc, setCurrentSrc] = React.useState(safePrimarySrc);

  React.useEffect(() => {
    setCurrentSrc(safePrimarySrc);
  }, [safePrimarySrc]);

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== safeFallbackSrc) {
          setCurrentSrc(safeFallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
