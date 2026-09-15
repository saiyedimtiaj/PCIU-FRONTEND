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
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, current],
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
      diff > 0 ? next() : prev();
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
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {imageUrl ? (
              <>
                <div className="absolute inset-0 overflow-hidden bg-primary">
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    sizes="100vw"
                    aria-hidden="true"
                    className="object-cover scale-110 blur-2xl brightness-[0.55] saturate-125"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt={slide.heading || `Slide ${index + 1}`}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="object-contain"
                  />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-primary" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-primary/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent" />

            {(slide.heading || slide.subheading) && (
              <div className="absolute inset-0 z-10 flex items-center pb-16 sm:pb-14 md:pb-16">
                <div className="container mx-auto px-4 sm:px-6 md:px-12">
                  <div className="max-w-xl md:max-w-2xl lg:max-w-3xl">
                    {slide.heading && (
                      <div
                        className={`transition-all duration-700 ${
                          isActive
                            ? "translate-y-0 opacity-100 scale-100"
                            : "translate-y-6 opacity-0 scale-[0.98]"
                        }`}
                      >
                        {/* Kicker: accent bar + small label instead of a bare line */}
                        <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                          <span className="h-[3px] w-8 sm:w-10 rounded-full bg-gradient-to-r from-accent via-accent to-accent/30" />
                          <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-accent">
                            PCIU
                          </span>
                        </div>
                        <h2 className="font-heading font-bold tracking-tight text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] drop-shadow-lg">
                          {slide.heading}
                        </h2>
                      </div>
                    )}
                    {slide.subheading && (
                      <p
                        className={`mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl text-white/90 max-w-[300px] sm:max-w-xl md:max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none drop-shadow-md transition-all duration-700 delay-150 ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                        }`}
                      >
                        {slide.subheading}
                      </p>
                    )}
                    {slide.ctaLabel && slide.ctaUrl && (
                      <div
                        className={`mt-5 sm:mt-8 transition-all duration-700 delay-300 ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                        }`}
                      >
                        <Link
                          href={slide.ctaUrl}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-primary shadow-lg shadow-black/20 transition-all hover:bg-accent/90 hover:shadow-xl hover:-translate-y-0.5"
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

      {/* Unified bottom control bar — progress pill (left) / arrow buttons (right) */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 sm:pb-6 md:pb-8">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <div className="flex items-center justify-between gap-4 max-w-xl md:max-w-2xl lg:max-w-3xl">
              {/* Progress + counter, now a single glass pill */}
              <div className="flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg shadow-black/10">
                <div className="flex gap-1.5 sm:gap-2 w-24 sm:w-32">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goTo(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === current}
                      className="relative h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden"
                    >
                      {index === current && (
                        <span
                          key={current}
                          className="absolute inset-y-0 left-0 bg-accent rounded-full progress-fill"
                          style={{
                            animationDuration: `${AUTOPLAY_MS}ms`,
                            animationPlayState: isPaused ? "paused" : "running",
                          }}
                        />
                      )}
                      {index < current && (
                        <span className="absolute inset-0 bg-accent/70 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                <span className="h-4 w-px bg-white/20" />
                <span className="text-white text-xs sm:text-sm font-semibold tabular-nums">
                  {String(current + 1).padStart(2, "0")}
                  <span className="text-white/50 font-normal">
                    {" "}
                    / {String(slides.length).padStart(2, "0")}
                  </span>
                </span>
              </div>

              {/* Nav arrows: larger, glass with accent hover state */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="group w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-accent hover:border-accent hover:text-primary active:scale-90 shadow-lg shadow-black/10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={next}
                  className="group w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-accent hover:border-accent hover:text-primary active:scale-90 shadow-lg shadow-black/10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .progress-fill {
          animation-name: fillProgress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes fillProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .progress-fill {
            animation: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
