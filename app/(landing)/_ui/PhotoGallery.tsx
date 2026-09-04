// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { X, Camera } from "lucide-react";
// import { cn } from "@/lib/utils";
// import galleryData from "@/content/home/gallery.json";
// import type { GalleryItem } from "@/types/home";

// const galleryItems = galleryData as GalleryItem[];

// export default function PhotoGallery() {
//   const [selected, setSelected] = useState<GalleryItem | null>(null);

//   return (
//     <section className="py-16 md:py-24 relative overflow-hidden">
//       {/* Background */}
//       <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5" />

//       <div className="container mx-auto px-4 relative z-10">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
//             <Camera className="w-4 h-4" />
//             Photo Gallery
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
//             Life at <span className="text-primary">PCIU</span>
//           </h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
//             Explore the vibrant moments that define our campus — from academics to celebrations.
//           </p>
//         </div>

//         {/* Masonry-style Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
//           {galleryItems.map((item, idx) => (
//             <button
//               key={item.src}
//               onClick={() => setSelected(item)}
//               className={cn(
//                 "group relative overflow-hidden rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
//                 idx === 0 && "col-span-2 row-span-2",
//                 idx === 3 && "row-span-2",
//                 idx === 5 && "col-span-2"
//               )}
//             >
//               <div
//                 className={cn(
//                   "relative w-full",
//                   idx === 0 || idx === 3 ? "aspect-square" : "aspect-4/3"
//                 )}
//               >
//                 <Image
//                   src={item.src}
//                   alt={item.title}
//                   fill
//                   loading="lazy"
//                   sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
//                   className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//                 />
//               </div>

//               {/* Hover Overlay */}
//               <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />

//               {/* Category Badge */}
//               <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
//                 {item.category}
//               </div>

//               {/* Bottom Content */}
//               <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
//                 <h3 className="text-white font-bold text-sm md:text-base lg:text-lg leading-tight drop-shadow-lg">
//                   {item.title}
//                 </h3>
//                 <p className="text-white/80 text-xs mt-1 hidden md:block">
//                   Click to read the story →
//                 </p>
//               </div>

//               {/* Corner glow */}
//               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Lightbox / Story Modal */}
//       {selected && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
//           onClick={() => setSelected(null)}
//         >
//           <div
//             className="relative bg-card rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl animate-scale-in"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close button */}
//             <button
//               onClick={() => setSelected(null)}
//               className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/70 transition-colors"
//               aria-label="Close"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Image */}
//             <div className="relative md:w-1/2 flex-shrink-0 h-64 md:h-auto">
//               <Image
//                 src={selected.src}
//                 alt={selected.title}
//                 fill
//                 sizes="(min-width: 768px) 50vw, 100vw"
//                 className="object-cover"
//               />
//             </div>

//             {/* Story Content */}
//             <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
//               <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
//                 {selected.category}
//               </span>
//               <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
//                 {selected.title}
//               </h3>
//               <p className="text-muted-foreground leading-relaxed text-base">{selected.story}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import galleryData from "@/content/home/gallery.json";
import type { GalleryItem } from "@/types/home";

const galleryItems = galleryData as GalleryItem[];

export default function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? galleryItems[selectedIndex] : null;

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((i) => (i === null ? null : (i + 1) % galleryItems.length));
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((i) =>
          i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

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
          <path d="M20 6 Q410 82 800 6" stroke="hsl(42 85% 58%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.42" />
          <path d="M10 18 Q410 94 810 18" stroke="hsl(230 70% 50%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.24" />
          <path d="M28 30 Q410 102 792 30" stroke="hsl(42 85% 72%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38" />
          <path d="M45 42 Q410 108 775 42" stroke="hsl(231 77% 22%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.16" />
          <path d="M36 12 Q410 76 784 12" stroke="hsl(230 70% 50%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />
          <path d="M18 26 Q410 100 802 26" stroke="hsl(42 85% 58%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.25" />
          <path d="M54 38 Q410 106 766 38" stroke="hsl(42 85% 72%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.22" />
          <path d="M68 50 Q410 110 752 50" stroke="hsl(231 77% 22%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.12" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent sm:text-xs">
            <Camera className="h-3.5 w-3.5" />
            Photo Gallery
          </span>
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Life at <span className="text-accent">PCIU</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Explore the vibrant moments that define our campus — from academics to celebrations.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {galleryItems.map((item, idx) => (
            <button
              key={item.src}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow duration-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
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
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

              {/* Category Badge */}
              <div className="absolute left-3 top-3 -translate-y-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {item.category}
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                <h3 className="text-sm font-bold leading-tight text-white drop-shadow-lg md:text-base lg:text-lg">
                  {item.title}
                </h3>
                <p className="mt-1 hidden text-xs text-white/75 md:block">
                  Click to read the story →
                </p>
              </div>

              {/* Corner glow */}
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
              className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
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
                      i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length
                    )
                  }
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:left-3"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex((i) => (i === null ? null : (i + 1) % galleryItems.length))
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