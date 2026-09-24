"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types/home";

export default function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const galleryItems = items;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? galleryItems[selectedIndex] : null;

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((i) =>
          i === null ? null : (i + 1) % galleryItems.length,
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((i) =>
          i === null
            ? null
            : (i - 1 + galleryItems.length) % galleryItems.length,
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryItems.length, selectedIndex]);

  if (galleryItems.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24">
      {/* Layered thin arcs behind the heading with a gentle 180-degree turn */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-24 w-[min(820px,90vw)] -translate-x-1/2"
      >
        <svg
          className="h-full w-full motion-safe:animate-arc-rotate"
          viewBox="0 0 820 110"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M20 6 Q410 82 800 6"
            stroke="hsl(42 85% 58%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M10 18 Q410 94 810 18"
            stroke="hsl(230 70% 50%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.24"
          />
          <path
            d="M28 30 Q410 102 792 30"
            stroke="hsl(42 85% 72%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.38"
          />
          <path
            d="M45 42 Q410 108 775 42"
            stroke="hsl(231 77% 22%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.16"
          />
          <path
            d="M36 12 Q410 76 784 12"
            stroke="hsl(230 70% 50%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M18 26 Q410 100 802 26"
            stroke="hsl(42 85% 58%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path
            d="M54 38 Q410 106 766 38"
            stroke="hsl(42 85% 72%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.22"
          />
          <path
            d="M68 50 Q410 110 752 50"
            stroke="hsl(231 77% 22%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.12"
          />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Life at <span className="text-accent">PCIU</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Explore the vibrant moments that define our campus — from academics
            to celebrations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:auto-rows-38.5 lg:grid-cols-12">
          {galleryItems.map((item, idx) => (
            <button
              key={item.src}
              onClick={() => setSelectedIndex(idx)}
              type="button"
              aria-label={`Open ${item.title}`}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow duration-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                idx === 0 &&
                  "col-span-2 row-span-2 md:col-span-2 lg:col-span-6 lg:row-span-2",
                idx === 1 && "md:col-span-2 lg:col-span-3 lg:row-span-2",
                idx === 2 && "lg:col-span-3",
                idx === 3 && "lg:col-span-3",
                idx === 4 && "lg:col-span-3",
                idx === 5 && "col-span-2 lg:col-span-6",
                idx > 5 && "lg:col-span-3",
              )}
            >
              <div
                className={cn(
                  "relative w-full lg:h-full lg:aspect-auto",
                  idx === 0 ? "aspect-square" : "aspect-4/3",
                )}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/40 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

              <div className="absolute left-3 top-3 -translate-y-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.category}
              </div>

              <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                <h3 className="text-sm font-bold leading-tight text-white drop-shadow-lg md:text-base lg:text-lg">
                  {item.title}
                </h3>
                <p className="mt-1 hidden text-xs text-white/75 md:block">
                  Click to read the story →
                </p>
              </div>

              <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-accent/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox / Story Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-primary/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl animate-scale-in flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev/Next arrows */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedIndex((i) =>
                      i === null
                        ? null
                        : (i - 1 + galleryItems.length) % galleryItems.length,
                    )
                  }
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:left-3"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex((i) =>
                      i === null ? null : (i + 1) % galleryItems.length,
                    )
                  }
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:right-16"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative h-64 shrink-0 md:h-auto md:w-1/2">
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Story Content */}
            <div className="flex flex-col justify-center overflow-y-auto p-6 md:w-1/2 md:p-8">
              <span className="mb-4 w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                {selected.category}
              </span>
              <h3 className="font-heading mb-4 text-xl font-bold text-primary sm:text-2xl md:text-3xl">
                {selected.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {selected.story}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
