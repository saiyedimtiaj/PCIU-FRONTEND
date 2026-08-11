import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Required starting with Next.js 16 — unrestricted access would let
    // callers request arbitrary optimization qualities.
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "portcity.edu.bd",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
