import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.mafrservices.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.idealo.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
