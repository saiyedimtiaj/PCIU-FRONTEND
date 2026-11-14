"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import type { KeyPerson } from "@/types/home";

const SWIPE_THRESHOLD_PX = 40;
/** How long each key person stays on screen before autoplay advances. */
const AUTOPLAY_MS = 5000;

/**
 * JS-timed autoplay. Advances after AUTOPLAY_MS, pauses while `paused`, and
 * resumes with only the remaining time (not a fresh full interval). A manual
 * slide change restarts the countdown.
 *
 * Deliberately not tied to the progress bar's CSS animation: an OS-level
 * "reduce motion" setting turns that animation off, which previously
 * stopped autoplay entirely.
 */
function useAutoplay({
  enabled,
  paused,
  index,
  onAdvance,
}: {
  enabled: boolean;
  paused: boolean;
  index: number;
  onAdvance: () => void;
}) {
  const remaining = useRef(AUTOPLAY_MS);
  const lastIndex = useRef(index);

  useEffect(() => {
    if (lastIndex.current !== index) {
      lastIndex.current = index;
      remaining.current = AUTOPLAY_MS;
    }
    if (!enabled || paused) return;

    const startedAt = Date.now();
    const id = window.setTimeout(onAdvance, remaining.current);
    return () => {
      window.clearTimeout(id);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - startedAt),
      );
    };
  }, [enabled, paused, index, onAdvance]);
}
const PORTRAIT_SIZES =
  "(min-width: 1024px) 240px, (min-width: 768px) 220px, 208px";

/** Short title for a person: a title-like designation, else the role. */
function titleOf(person: KeyPerson): string | null {
  if (person.designation && !person.designationIsStatement) {
    return person.designation;
  }
  return person.role;
}

/**
 * True while the element is on screen and the tab is visible. Autoplay pauses
 * otherwise, so an off-screen carousel doesn't keep animating or advancing.
 */
function useInViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        threshold: 0.25,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () =>
      setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return [ref, onScreen && tabVisible] as const;
}

export default function KeyPersonsCarousel({
  persons,
}: {
  persons: KeyPerson[];
}) {
  const [rawIndex, setRawIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, true>>({});
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const [rootRef, inViewport] = useInViewport<HTMLDivElement>();

  const count = persons.length;
  // Derived rather than synced in an effect: if the list shrinks under us
  // (e.g. a revalidated payload), the index can never point past the end.
  const index = Math.min(rawIndex, count - 1);
  const active = persons[index];
  const hasMultiple = count > 1;
  const interacting = hovered || focusWithin;
  const paused = interacting || !inViewport;

  const goTo = useCallback(
    (to: number) => setRawIndex(((to % count) + count) % count),
    [count],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useAutoplay({ enabled: hasMultiple, paused, index, onAdvance: next });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const markFailed = useCallback(
    (id: number) =>
      setFailedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true })),
    [],
  );

  const displayName = active.name ?? "Name not provided";
  const title = titleOf(active);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Key persons"
      tabIndex={hasMultiple ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-8 focus-visible:ring-offset-primary"
    >
      {/* ===================== CARD ===================== */}
      <div className="relative mt-10 w-full rounded-3xl bg-linear-to-br from-white via-[#F6F9FE] to-[#E6EEFB] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.6)] ring-1 ring-white/60 md:mt-8">
        {/* Gold sweep along the bottom-right corner */}
        <svg
          aria-hidden
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 right-0 h-8 w-1/2 overflow-hidden rounded-br-3xl sm:h-10"
        >
          <path d="M0 60 C120 50 220 30 300 0 V60 Z" fill="var(--accent)" />
        </svg>
        {/* Faint closing quote, top-right */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-6 top-2 select-none font-serif text-[7rem] font-bold leading-none text-primary/5 sm:right-10"
        >
          ”
        </span>

        <div className="relative grid grid-cols-1 items-center gap-7 px-5 pb-9 sm:px-8 md:grid-cols-[220px_1fr] md:gap-10 md:py-8 lg:grid-cols-[240px_1fr] lg:gap-12 lg:px-12">
          {/* ---------- Portrait (lifted over the card's top edge on mobile) ---------- */}
          <div className="relative mx-auto -mt-10 w-full max-w-52 md:-my-14 md:max-w-none">
            <div
              aria-hidden
              className="absolute -left-4 top-5 h-3/5 w-1/2 rounded-2xl bg-linear-to-b from-accent to-[#E89A0C]"
            />
            <div
              aria-hidden
              className="absolute -right-4 bottom-16 h-2/5 w-1/2 rounded-2xl bg-primary"
            />

            <div className="group relative rounded-[20px] bg-white p-1.5 shadow-[0_22px_44px_-18px_rgba(13,26,99,0.6)]">
              <PortraitStack
                persons={persons}
                index={index}
                failedImages={failedImages}
                onImageError={markFailed}
              />

              {/* Name plate */}
              <div className="relative z-10 mx-2 -mt-9 overflow-hidden rounded-xl bg-primary px-3 py-2.5 text-center shadow-[0_12px_28px_-10px_rgba(13,26,99,0.7)]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-accent"
                />
                <div
                  key={active.id}
                  className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-350"
                >
                  <p className="font-heading text-sm font-bold leading-snug text-white wrap-break-word">
                    {displayName}
                  </p>
                  {title && (
                    <p className="mt-0.5 text-xs font-semibold tracking-wide text-accent">
                      {title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Description ---------- */}
          <div
            key={active.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${displayName}`}
            className="min-w-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-6 motion-safe:duration-400"
          >
            <KeyPersonDescription person={active} title={title} />
          </div>
        </div>
      </div>

      {hasMultiple && (
        <CarouselControls
          persons={persons}
          index={index}
          paused={paused}
          onPrev={prev}
          onNext={next}
          onSelect={goTo}
        />
      )}

      {/* Announces the change only while the user is interacting, so autoplay
          doesn't chatter. */}
      <p
        className="sr-only"
        aria-live={interacting ? "polite" : "off"}
        aria-atomic="true"
      >
        {hasMultiple
          ? `Showing key person ${index + 1} of ${count}: ${displayName}${title ? `, ${title}` : ""}`
          : ""}
      </p>
    </div>
  );
}

/**
 * Crossfading portraits. Only the active slide and its neighbours are mounted,
 * so the next image is already loaded when it fades in, while the rest of the
 * list never downloads until it's needed.
 */
function PortraitStack({
  persons,
  index,
  failedImages,
  onImageError,
}: {
  persons: KeyPerson[];
  index: number;
  failedImages: Record<number, true>;
  onImageError: (id: number) => void;
}) {
  const count = persons.length;
  const near = (i: number) =>
    i === index ||
    i === (index + 1) % count ||
    i === (index - 1 + count) % count;

  return (
    <div className="relative aspect-4/5 overflow-hidden rounded-[15px] bg-[#EEF3F9]">
      {persons.map((person, i) => {
        if (!near(i)) return null;
        const isActive = i === index;
        const src = failedImages[person.id] ? null : person.imageUrl;
        return (
          <div
            key={person.id}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-450 ease-out motion-reduce:transition-none",
              isActive ? "scale-100 opacity-100" : "scale-[1.05] opacity-0",
            )}
          >
            {src ? (
              <Image
                src={src}
                alt={
                  isActive ? `Portrait of ${person.name ?? "key person"}` : ""
                }
                fill
                sizes={PORTRAIT_SIZES}
                onError={() => onImageError(person.id)}
                className="object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035]"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/30">
                <UserRound className="size-14" aria-hidden />
                <span className="text-xs text-slate-500">
                  Photo unavailable
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CarouselControls({
  persons,
  index,
  paused,
  onPrev,
  onNext,
  onSelect,
}: {
  persons: KeyPerson[];
  index: number;
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous key person"
        className={arrowClass}
      >
        <ChevronLeft
          className="size-5 transition-transform duration-300 group-hover/arrow:-translate-x-0.5"
          aria-hidden
        />
      </button>

      <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
        <span className="font-heading text-sm font-bold tabular-nums text-accent">
          {pad(index + 1)}
        </span>
        <div className="flex items-center gap-1.5">
          {persons.map((person, i) => {
            const isActive = i === index;
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Show key person ${i + 1}${person.name ? `: ${person.name}` : ""}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative h-1.5 overflow-hidden rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none",
                  isActive
                    ? "w-10 bg-white/20"
                    : "w-1.5 bg-white/45 hover:w-3 hover:bg-white/80",
                )}
              >
                {/* Visual progress only — useAutoplay owns the timing. Its
                    duration and pause state mirror the JS timer. */}
                {isActive && (
                  <span
                    key={index}
                    aria-hidden
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    className={cn(
                      "absolute inset-0 origin-left animate-key-person-progress rounded-full bg-accent motion-reduce:animate-none",
                      paused && "paused",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="font-heading text-sm font-semibold tabular-nums text-white/50">
          {pad(persons.length)}
        </span>
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next key person"
        className={arrowClass}
      >
        <ChevronRight
          className="size-5 transition-transform duration-300 group-hover/arrow:translate-x-0.5"
          aria-hidden
        />
      </button>
    </div>
  );
}

const arrowClass =
  "group/arrow flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-primary hover:shadow-[0_10px_24px_-8px_rgba(245,183,29,0.6)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none";

const bodyTextClass =
  "line-clamp-6 text-[15px] leading-7 text-[#1B2A6B] sm:text-base sm:leading-8";

/**
 * "Message from the <designation>" heading, then the gold quote mark hanging
 * to the left of the body text.
 */
function QuotedText({
  title,
  children,
}: {
  title: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      {title && (
        <div className="mb-4 text-center md:text-left">
          <h3 className="font-heading text-xl font-extrabold leading-tight sm:text-2xl">
            <span className="text-[#33407F]">Message from the </span>
            {/* Deep blue gradient on the designation: reads far better on the
                white card than plain gold, and stays on brand. */}
            <span className="bg-linear-to-r from-primary via-secondary to-[#2A4BD8] bg-clip-text text-transparent">
              {title}
            </span>
          </h3>
          <span
            aria-hidden
            className="mx-auto mt-2.5 flex items-center gap-1.5 md:mx-0 md:justify-start justify-center"
          >
            <span className="h-1 w-12 rounded-full bg-linear-to-r from-accent to-[#E89A0C]" />
            <span className="size-1 rounded-full bg-accent" />
            <span className="size-1 rounded-full bg-accent/60" />
          </span>
        </div>
      )}
      <div className="relative pl-10 sm:pl-12">
        <span
          aria-hidden
          className="absolute -top-2 left-0 font-serif text-6xl font-bold leading-none text-accent sm:text-7xl"
        >
          “
        </span>
        {children}
      </div>
    </div>
  );
}

function KeyPersonDescription({
  person,
  title,
}: {
  person: KeyPerson;
  title: string | null;
}) {
  // A statement in `designation` is presented as the person's own words;
  // otherwise the management body's description gives context.
  const isStatement = Boolean(
    person.designation && person.designationIsStatement,
  );
  const body = isStatement ? person.designation : person.typeDescription;

  if (!body) {
    return (
      <p className="text-center text-base text-slate-500 md:text-left">
        More about this key person will be shared soon.
      </p>
    );
  }

  return (
    <QuotedText title={title}>
      {isStatement ? (
        <blockquote className={bodyTextClass}>{body}</blockquote>
      ) : (
        <p className={bodyTextClass}>{body}</p>
      )}
    </QuotedText>
  );
}
