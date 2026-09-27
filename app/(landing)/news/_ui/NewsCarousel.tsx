"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function NewsCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const hasControls = images.length > 1;
  const move = (offset: number) =>
    setActive((current) => (current + offset + images.length) % images.length);

  return (
    <div className="border-b border-primary/10">
      <div className="relative aspect-[16/9] max-h-[34rem] bg-muted">
        <Image
          src={images[active]}
          alt={`${title} image ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-cover"
        />
        {hasControls && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
      {hasControls && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${index === active ? "border-accent" : "border-transparent"}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
