import { Check, Compass, Eye, Heart, Target, type LucideIcon } from "lucide-react";
import foundationData from "@/content/about/foundation.json";
import { cn } from "@/lib/utils";
import type { AboutUniversity, FoundationContent } from "@/types/about";

// Section heading isn't part of the `/about` record, so it stays in JSON.
const foundation = foundationData as FoundationContent;

interface Card {
  icon: LucideIcon;
  title: string;
  description: string;
  points?: string[];
  /** Navy card with white text; otherwise white card with navy text. */
  dark: boolean;
}

function FoundationCard({ card, index }: { card: Card; index: number }) {
  const { icon: Icon, dark } = card;

  return (
    <article
      className={cn(
        "reveal group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-8 lg:p-10",
        dark
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          : "border-primary/10 bg-white text-primary shadow-sm hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10",
      )}
    >
      {/* Oversized step number as a watermark */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-5 top-4 select-none font-heading text-5xl font-extrabold leading-none sm:right-7 sm:top-6 sm:text-6xl",
          dark ? "text-white/10" : "text-primary/[0.07]",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14",
            dark ? "bg-white text-primary" : "bg-primary text-white",
          )}
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h3 className="font-heading text-xl font-bold sm:text-2xl">{card.title}</h3>
      </div>

      <div
        className={cn(
          "relative z-10 my-5 h-px w-12 transition-all duration-300 group-hover:w-20 sm:my-6",
          dark ? "bg-white/40" : "bg-primary/30",
        )}
      />

      <p
        className={cn(
          "relative z-10 text-sm leading-relaxed sm:text-[15px] sm:leading-[1.8]",
          dark ? "text-white/80" : "text-primary/75",
        )}
      >
        {card.description}
      </p>

      {card.points && card.points.length > 0 && (
        <ul className="relative z-10 mt-5 space-y-3 sm:mt-6">
          {card.points.map((point) => (
            <li
              key={point}
              className={cn("flex items-start gap-3 text-sm", dark ? "text-white/90" : "text-primary/80")}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  dark ? "bg-white text-primary" : "bg-primary text-white",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function VisionMissionValues({ about }: { about: AboutUniversity }) {
  // Checkerboard on the 2-column grid: navy, white / white, navy.
  const cards: Card[] = [
    { icon: Eye, title: about.visionTitle, description: about.vision, dark: true },
    { icon: Target, title: about.missionTitle, description: about.mission, dark: false },
    { icon: Compass, title: about.strategyTitle, description: about.strategy, dark: false },
    {
      icon: Heart,
      title: about.valuesTitle,
      description: about.valuesDescription,
      points: about.valuesPoints,
      dark: true,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-muted/40 py-12 sm:py-14 md:py-16">
      {/* Soft navy glow behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-[min(700px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="container relative mx-auto px-4">
        <div className="reveal mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary">
            {foundation.eyebrow}
          </span>
          <h2 className="text-2xl font-extrabold text-primary sm:text-3xl md:text-4xl">
            {foundation.heading} <span className="text-accent">{foundation.headingAccent}</span>
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-1 w-3 rounded-full bg-accent" />
            <span className="h-1 w-12 rounded-full bg-primary" />
            <span className="h-1 w-3 rounded-full bg-accent" />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 sm:gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <FoundationCard key={card.title || index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
