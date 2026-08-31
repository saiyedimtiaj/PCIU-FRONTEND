import type { NextConfig } from "next";

const backendHost = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "",
    ).hostname;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin uploads (department covers, hero slides, article PDFs) travel
      // to the API through Server Actions, and the 1MB default rejects most
      // real images. The limit covers multipart boundary overhead too.
      bodySizeLimit: "8mb",
    },
  },
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
      // Uploads come back as paths under the API host (e.g.
      // /uploads/departments/…webp) and are rendered through next/image.
      ...(backendHost
        ? [
            {
              protocol: "https" as const,
              hostname: backendHost,
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
