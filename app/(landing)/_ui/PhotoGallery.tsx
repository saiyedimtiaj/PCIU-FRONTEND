"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import galleryData from "@/content/home/gallery.json";
import type { GalleryItem } from "@/types/home";

const galleryItems = galleryData as GalleryItem[];

export default function PhotoGallery() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            Photo Gallery
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Life at <span className="text-primary">PCIU</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore the vibrant moments that define our campus — from academics to celebrations.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {galleryItems.map((item, idx) => (
            <button
              key={item.src}
              onClick={() => setSelected(item)}
              className={cn(
                "group relative overflow-hidden rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                idx === 0 && "col-span-2 row-span-2",
                idx === 3 && "row-span-2",
                idx === 5 && "col-span-2"
              )}
            >
              <div
                className={cn(
                  "relative w-full",
                  idx === 0 || idx === 3 ? "aspect-square" : "aspect-4/3"
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

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                {item.category}
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="text-white font-bold text-sm md:text-base lg:text-lg leading-tight drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="text-white/80 text-xs mt-1 hidden md:block">
                  Click to read the story →
                </p>
              </div>

              {/* Corner glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox / Story Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-card rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="relative md:w-1/2 flex-shrink-0 h-64 md:h-auto">
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Story Content */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
              <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                {selected.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {selected.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">{selected.story}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
