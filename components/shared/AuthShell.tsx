import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export interface AuthStat {
  value: string;
  label: string;
}

export interface AuthQuote {
  text: string;
  author: string;
  role: string;
}

export interface AuthShellProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  blurb: string;
  stats: AuthStat[];
  quote?: AuthQuote;
  formTitle: string;
  formSubtitle: string;
  footer: ReactNode;
  children: ReactNode;
  /** Only the page most likely to be the entry point should preload its hero image. */
  preloadImage?: boolean;
}

/**
 * Shared split-screen shell for the four auth pages: a branded image panel
 * on the left, a calm form panel on the right, joined by a glowing gold
 * seam. Pure server component — no state, matches "design only" auth pages.
 */
export default function AuthShell({
  image,
  imageAlt,
  eyebrow,
  headline,
  headlineAccent,
  blurb,
  stats,
  quote,
  formTitle,
  formSubtitle,
  footer,
  children,
  preloadImage = false,
}: AuthShellProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* ══ LEFT: image + overlay + content ══ */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16">
        <Image
          src={image}
          alt={imageAlt}
          fill
          preload={preloadImage}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover scale-105"
        />

        {/* Diagonal brand scrim, three stops, so text stays legible over any photo */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/95 via-primary/80 to-primary/60" />
        {/* Bottom-weighted pass so the glass card at the base always has contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent" />

        {/* Decorative grid overlay, same technique as AboutHero */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1zM0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {/* Gold corner bloom */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-accent/25 blur-[120px]" />

        {/* Logo lockup */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/pciu-logo.png"
              alt="PCIU"
              width={44}
              height={44}
              className="size-11 object-contain"
            />
            <span className="font-heading font-bold text-lg leading-tight text-white">
              Port City International
              <span className="block text-xs font-normal tracking-[0.2em] uppercase text-white/60">
                University
              </span>
            </span>
          </Link>
        </div>

        {/* Headline */}
        <div className="relative z-10 max-w-lg animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent ring-1 ring-accent/30 backdrop-blur-sm">
            <GraduationCap className="size-3.5" />
            {eyebrow}
          </span>
          <h2 className="mt-6 font-heading text-4xl xl:text-5xl font-extrabold leading-[1.1] text-white">
            {headline} <span className="text-accent">{headlineAccent}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">{blurb}</p>
        </div>

        {/* Glass card: quote + stats */}
        <div className="relative z-10">
          {quote && (
            <figure className="mb-6 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <blockquote className="text-sm leading-relaxed text-white/85 italic">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <span className="text-xs text-white/70">
                  <span className="font-semibold text-white">{quote.author}</span>
                  {" · "}
                  {quote.role}
                </span>
              </figcaption>
            </figure>
          )}
          <dl className="grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-2xl font-bold text-accent">{stat.value}</dd>
                <dd className="mt-0.5 text-[11px] uppercase tracking-wider text-white/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {/* ══ RIGHT: form ══ */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-subtle px-6 py-12 sm:px-10 lg:px-14">
        {/* The gold seam between panels */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-px bg-linear-to-b from-transparent via-accent to-transparent shadow-glow lg:block"
        />
        {/* Echoing corner wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-[100px]"
        />

        {/* Compact brand bar shown only when the image panel collapses below lg */}
        <Link href="/" className="mb-10 inline-flex items-center gap-2.5 lg:hidden">
          <Image
            src="/images/pciu-logo.png"
            alt="PCIU"
            width={36}
            height={36}
            className="size-9 object-contain"
          />
          <span className="font-heading font-bold text-primary">PCIU</span>
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-[420px] animate-fade-in">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {formTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{formSubtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </section>
    </div>
  );
}
