"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "@/lib/utils/media";
import type { HeroSliderItem } from "@/types/home";

export default function HeroCarousel({ slides }: { slides: HeroSliderItem[] }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <>
      {slides.map((slide, index) => {
        const imageUrl = getMediaUrl(slide.image);
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={slide.heading || `Slide ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-primary" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

            {/* Text overlay */}
            {(slide.heading || slide.subheading) && (
              <div className="absolute inset-0 z-10 flex items-end pb-36 sm:pb-32 md:pb-40">
                <div className="container mx-auto px-4 sm:px-6 md:px-12">
                  <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">
                    {slide.heading && (
                      <h2
                        className={`font-heading font-bold text-xl sm:text-3xl md:text-5xl lg:text-6xl text-white mb-2 sm:mb-4 drop-shadow-lg transition-all duration-700 ${
                          index === current
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        {slide.heading}
                      </h2>
                    )}
                    {slide.subheading && (
                      <p
                        className={`text-xs sm:text-base md:text-xl text-white/90 max-w-[280px] sm:max-w-xl md:max-w-2xl line-clamp-2 sm:line-clamp-none drop-shadow-md transition-all duration-700 delay-150 ${
                          index === current
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        {slide.subheading}
                      </p>
                    )}
                    {slide.ctaLabel && slide.ctaUrl && (
                      <div
                        className={`mt-3 sm:mt-8 transition-all duration-700 delay-300 ${
                          index === current
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        <Link
                          href={slide.ctaUrl}
                          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-base font-semibold text-primary shadow-sm transition-colors hover:bg-accent/90"
                        >
                          {slide.ctaLabel}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <div className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-24 sm:bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-8 bg-accent" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}