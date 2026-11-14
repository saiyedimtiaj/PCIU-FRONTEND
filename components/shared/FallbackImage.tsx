"use client";

import { useState, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type FallbackImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null;
  /** Rendered instead of the image when `src` is missing or fails to load. */
  fallback: ReactNode;
};

/**
 * `next/image` with a fallback for missing or broken uploads. Shared by the clubs and sports pages.
 * `onError` needs a client boundary.
 */
export default function FallbackImage({ src, fallback, alt, ...props }: FallbackImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <>{fallback}</>;
  return <Image {...props} src={src} alt={alt} onError={() => setFailedSrc(src)} />;
}

type CoverImageProps = {
  src: string | null;
  alt: string;
  sizes: string;
  fallback: ReactNode;
  preload?: boolean;
  eager?: boolean;
  /** Extra classes for the sharp foreground image (e.g. a hover zoom). */
  className?: string;
};

/**
 * Fills a sized, `relative` frame with an upload *without cropping it*: the
 * image is shown whole (`object-contain`) over a blurred, zoomed copy of
 * itself, so a banner of any aspect ratio reads edge to edge. Both layers
 * request the same optimized URL, so the browser downloads it once.
 */
export function CoverImage({ src, alt, sizes, fallback, preload, eager, className }: CoverImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <>{fallback}</>;

  const loading = preload ? undefined : eager ? "eager" : "lazy";
  const onError = () => setFailedSrc(src);
  return (
    <>
      {/* Shimmer behind both layers: visible until the image paints over it */}
      <div aria-hidden className="absolute inset-0 animate-pulse bg-linear-to-br from-muted-foreground/20 via-muted-foreground/5 to-muted-foreground/20" />
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        loading={loading}
        onError={onError}
        className="scale-125 object-cover opacity-70 blur-2xl"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={loading}
        fetchPriority={preload || eager ? "high" : "auto"}
        onError={onError}
        className={cn("object-contain", className)}
      />
    </>
  );
}
