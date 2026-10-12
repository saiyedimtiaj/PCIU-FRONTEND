"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export default function EventCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center bg-primary/5 text-primary/40">
        <CalendarDays aria-hidden="true" className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video overflow-hidden bg-muted"
      role="region"
      aria-label={`${title} photos`}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative h-full w-full shrink-0"
          >
            <Image
              src={image}
              alt={`${title} photo ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-contain"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous event image"
            onClick={() =>
              setActiveIndex(
                (index) => (index - 1 + images.length) % images.length,
              )
            }
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next event image"
            onClick={() =>
              setActiveIndex((index) => (index + 1) % images.length)
            }
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
          <span
            className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white"
            aria-live="polite"
          >
            {activeIndex + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
