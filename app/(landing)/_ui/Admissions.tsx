import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  CreditCard,
  Download,
  FolderOpen,
  GraduationCap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { iconMap } from "@/lib/icons";
import admissionsData from "@/content/home/admissions.json";
import type { AdmissionsContent } from "@/types/home";

const admissions = admissionsData as AdmissionsContent;

/**
 * Illustration styling for each card, by position — mirrors the reference
 * design: clipboard + check, cap + books, folder + download, card + shield.
 * Each is a tilted 3D-style tile with a small badge, plus which corner accent
 * colour the card gets.
 */
const ILLUSTRATIONS: {
  icon: LucideIcon;
  tile: string;
  iconColor: string;
  badge: LucideIcon;
  badgeBg: string;
  badgeColor: string;
  corner: "gold" | "blue";
}[] = [
  {
    icon: ClipboardList,
    tile: "from-[rgb(84,132,255)] to-[rgb(29,70,190)]",
    iconColor: "text-white",
    badge: Check,
    badgeBg: "bg-accent",
    badgeColor: "text-primary",
    corner: "gold",
  },
  {
    icon: GraduationCap,
    tile: "from-[rgb(30,52,120)] to-[rgb(8,22,70)]",
    iconColor: "text-accent",
    badge: BookOpen,
    badgeBg: "bg-[rgb(37,84,214)]",
    badgeColor: "text-white",
    corner: "blue",
  },
  {
    icon: FolderOpen,
    tile: "from-[#ffd65c] to-[#e9a90c]",
    iconColor: "text-white",
    badge: Download,
    badgeBg: "bg-primary",
    badgeColor: "text-white",
    corner: "blue",
  },
  {
    icon: CreditCard,
    tile: "from-[rgb(84,132,255)] to-[rgb(29,70,190)]",
    iconColor: "text-white",
    badge: ShieldCheck,
    badgeBg: "bg-[rgb(22,163,74)]",
    badgeColor: "text-white",
    corner: "gold",
  },
];

export default function Admissions() {
  return (
    <section
      id="admissions"
      className="relative isolate overflow-hidden pt-8 pb-11 text-white md:pt-9 md:pb-12"
    >
      {/*
        Campus photo background. The photo is ~2.5:1, so the section is kept
        compact — the shorter it is, the less `object-cover` has to crop from
        the sides. Anchored slightly right so the PCIU tower stays in frame.
      */}
      <Image
        src={admissions.backgroundImage}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[60%_35%]"
      />

      {/* Brand-blue overlay: deep behind the content, opening toward the right so the building reads */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 50% 55%, rgba(6,24,82,0.8) 0%, rgba(6,24,82,0) 100%), linear-gradient(100deg, rgba(6,24,82,0.95) 0%, rgba(11,40,124,0.84) 40%, rgba(16,54,150,0.55) 75%, rgba(16,54,150,0.32) 100%)",
        }}
      />
      {/* Top + bottom vignette */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(4,16,56,0.55)_0%,transparent_22%,transparent_68%,rgb(4,16,56)_100%)]"
      />
      {/* Gold glow behind the heading */}
      <div
        aria-hidden
        className="absolute left-1/2 top-6 -z-10 h-32 w-[520px] max-w-full -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />

      {/* Decorative dot grids */}
      <div
        aria-hidden
        className="absolute left-6 top-6 -z-10 hidden h-20 w-14 opacity-40 lg:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-14 right-8 -z-10 hidden h-14 w-20 opacity-30 lg:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(245,183,29,0.9) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mb-5 text-center md:mb-6">
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-accent/70 bg-[rgba(6,24,82,0.65)] py-1 pl-1.5 pr-4 text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_0_24px_rgba(245,183,29,0.28)] backdrop-blur-sm sm:text-xs">
            <span className="flex size-6 items-center justify-center rounded-full bg-accent text-primary">
              <GraduationCap className="size-3.5" strokeWidth={2.5} />
            </span>
            <span>{admissions.badge}</span>
            <span className="relative ml-0.5 flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
          </div>
          <h2 className="mb-1.5 font-heading text-3xl font-extrabold tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] md:text-[2.75rem] md:leading-tight">
            {admissions.heading}{" "}
            <span className="relative inline-block bg-linear-to-b from-[#ffd863] to-accent bg-clip-text text-transparent">
              {admissions.headingHighlight}
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2 w-full text-accent"
              >
                <path
                  d="M2 9 C 60 2, 140 2, 198 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-white/80 md:text-[15px]">
            {admissions.subheading}
          </p>
        </div>

        {/* Action cards — 2×2, following the reference design */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4">
          {admissions.cards.map((card, i) => {
            const art = ILLUSTRATIONS[i % ILLUSTRATIONS.length];
            const MainIcon = art.icon;
            const BadgeIcon = art.badge;
            const gold = art.corner === "gold";
            const topLeft = i % 2 === 0;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-linear-to-br from-white via-white/95 to-[rgba(230,238,255,0.94)] p-3.5 text-primary shadow-[0_18px_36px_-18px_rgba(2,12,48,0.95)] ring-1 ring-white/80 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_26px_50px_-18px_rgba(2,12,48,1)] hover:ring-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:gap-4 sm:px-4"
              >
                {/* Curved corner accent (top-left on the left column, bottom-right on the right) */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute size-14 transition-all duration-300 group-hover:size-20 ${
                    topLeft
                      ? "left-0 top-0 rounded-tl-2xl border-l-4 border-t-4"
                      : "bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4"
                  } ${gold ? "border-accent" : "border-[rgb(37,84,214)]"}`}
                />
                {/* Soft sheen across the top of the card */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/70 to-transparent"
                />

                {/* Illustration: glow + tilted 3D-style tile + badge */}
                <div className="relative flex size-[84px] shrink-0 items-center justify-center sm:size-24">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(147,180,255,0.5)_0%,rgba(147,180,255,0)_70%)]"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 h-2 w-14 rounded-full bg-primary/20 blur-sm transition-all duration-300 group-hover:w-12 group-hover:opacity-60"
                  />
                  <div
                    className={`relative flex size-14 -rotate-6 items-center justify-center rounded-2xl bg-linear-to-br shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-4px_0_rgba(0,0,0,0.15),0_10px_18px_-8px_rgba(2,12,48,0.7)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0 group-hover:scale-105 sm:size-16 ${art.tile}`}
                  >
                    <MainIcon
                      className={`size-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] sm:size-9 ${art.iconColor}`}
                      strokeWidth={1.75}
                    />
                  </div>
                  <span
                    className={`absolute bottom-2.5 right-1.5 flex size-7 items-center justify-center rounded-full shadow-[0_4px_10px_-2px_rgba(2,12,48,0.5)] ring-[3px] ring-white transition-transform duration-300 group-hover:scale-110 sm:bottom-3 sm:right-2 ${art.badgeBg}`}
                  >
                    <BadgeIcon
                      className={`size-3.5 ${art.badgeColor}`}
                      strokeWidth={2.75}
                    />
                  </span>
                </div>

                {/* Divider */}
                <span
                  aria-hidden
                  className="h-16 w-px shrink-0 bg-linear-to-b from-transparent via-primary/20 to-transparent"
                />

                {/* Text + CTA */}
                <div className="relative min-w-0 flex-1">
                  <h3 className="font-heading text-base font-extrabold leading-tight text-[rgb(10,32,96)] sm:text-lg">
                    {card.title}
                  </h3>
                  <p className="mb-2.5 mt-0.5 text-[13px] leading-snug text-slate-600">
                    {card.description}
                  </p>
                  {/* Visual button only — the whole card is the link */}
                  <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-linear-to-b from-[#ffd04d] to-highlight px-3.5 text-[13px] font-bold text-primary shadow-[0_6px_14px_-6px_rgba(217,157,8,0.95)] ring-1 ring-highlight-hover/40 transition-all duration-300 group-hover:from-highlight group-hover:to-highlight-hover group-hover:shadow-[0_8px_18px_-6px_rgba(217,157,8,1)]">
                    {card.buttonText}
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2.75}
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Highlights strip */}
        <ul className="relative mx-auto mt-4 grid max-w-5xl grid-cols-2 gap-y-2.5 overflow-hidden rounded-xl border border-white/15 bg-[rgba(6,24,82,0.6)] px-3 py-2.5 shadow-[0_12px_30px_-16px_rgba(0,0,0,0.8)] backdrop-blur-md md:grid-cols-4 md:divide-x md:divide-white/15">
          <span
            aria-hidden
            className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent/80 to-transparent"
          />
          {admissions.highlights.map((h) => {
            const Icon = iconMap[h.icon];
            return (
              <li
                key={h.label}
                className="flex items-center justify-center gap-2 px-2 text-[13px] font-medium text-white/90"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/40">
                  <Icon className="size-4 text-accent" />
                </span>
                <span>{h.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom wave swoosh */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 -z-10 h-8 w-full md:h-11"
      >
        <path
          d="M0,70 C320,130 620,10 960,60 C1180,92 1320,70 1440,40 L1440,120 L0,120 Z"
          fill="rgb(4,16,56)"
        />
        <path
          d="M0,78 C320,138 620,18 960,68 C1180,100 1320,78 1440,48"
          fill="none"
          stroke="#f5b71d"
          strokeWidth="4"
        />
      </svg>
    </section>
  );
}
