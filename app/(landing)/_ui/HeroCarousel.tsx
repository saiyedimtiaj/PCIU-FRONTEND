"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "@/lib/utils/media";
import type { HeroSliderItem } from "@/types/home";

const AUTOPLAY_MS = 5000;

export default function HeroCarousel({ slides }: { slides: HeroSliderItem[] }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, slides.length, isPaused]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    },
    [next, prev],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="absolute inset-0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={(e) => {
        setIsPaused(true);
        handleTouchStart(e);
      }}
      onTouchEnd={(e) => {
        handleTouchEnd(e);
        setIsPaused(false);
      }}
    >
      {slides.map((slide, index) => {
        const imageUrl = getMediaUrl(slide.image);
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 -z-10"
            }`}
            aria-hidden={!isActive}
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
                className=" h-full w-full object-cover object-[center_30%] sm:object-[center_30%] md:object-[center_35%] lg:object-center "
              />
            ) : (
              <div className="absolute inset-0 bg-primary" />
            )}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(13,26,99,0.08)_30%,rgba(13,26,99,0.25)_100%)]" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/45 via-primary/15 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-primary/45 via-primary/15 to-transparent" />
            {/* Text content */}
            {(slide.heading || slide.subheading) && (
              <div className="absolute inset-0 z-10 flex items-end pb-14 sm:pb-14 md:pb-14">
                <div className="container mx-auto px-4 sm:px-6 md:px-12">
                  <div className="group inline-flex items-center gap-2 pb-2">
                    {/* Accent Line */}
                    <span className="relative h-1.5 w-9 overflow-hidden rounded-full bg-gradient-to-r from-[#0d1a63] to-[#f5b71d] shadow-[0_2px_10px_rgba(245,183,29,0.3)] transition-all duration-500 group-hover:w-14">
                      <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-white/30 blur-[1px]" />
                    </span>

                    {/* Brand Text */}
                    <h1 className="bg-gradient-to-r from-[#f5b71d] via-[#f5b71d] to-white bg-clip-text text-xs md:text-2xl font-extrabold italic leading-none tracking-wide text-transparent drop-shadow-[0_2px_10px_rgba(245,183,29,0.28)] transition-all duration-500">
                      PCIU...
                    </h1>
                  </div>
                  <div className="max-w-[92%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                    {slide.heading && (
                      <h2
                        className={`font-heading font-extrabold tracking-[-0.04em] text-[clamp(1rem,3.6vw,2.6rem)] leading-[0.95] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-700 ${
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
                        className={`mt-1 md:mt-1.5 max-w-[92%] text-[11px] sm:text-xs md:text-sm text-white/90 font-medium drop-shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-all duration-700 delay-150 ${
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
                        className={`mt-4 sm:mt-4 transition-all duration-700 delay-300 ${
                          index === current
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        <Link
                          href={slide.ctaUrl}
                          className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 sm:px-5 sm:py-2.5 text-sm sm:text-base font-bold text-primary shadow-[0_4px_10px_rgba(245,183,29,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-[0_6px_12px_rgba(245,183,29,0.14)]"
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

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full px-2 py-1 shadow-sm shadow-black/5 backdrop-blur-sm">
          <button
            onClick={prev}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-sm shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:h-8 sm:w-8"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-2.5 bg-accent shadow-[0_0_3px_rgba(245,183,29,0.18)]"
                    : "w-2.5 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-sm shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:h-8 sm:w-8"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
