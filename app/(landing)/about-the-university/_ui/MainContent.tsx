import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconMap, type IconName } from "@/lib/icons";
import type { AboutUniversity } from "@/types/about";

/** The API stores lucide names ("GraduationCap"); the registry is keyed kebab-case. */
function resolveIcon(name: string) {
  const key = name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase() as IconName;
  return iconMap[key] ?? iconMap.award;
}

export default function MainContent({ about }: { about: AboutUniversity }) {
  const paragraphs = about.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const [lead, ...rest] = paragraphs;
  // The API stores the quote with its own quotation marks; the markup adds them.
  const quote = about.highlightQuote.trim().replace(/^["“]|["”]$/g, "");

  return (
    <section className="pt-6 pb-10 sm:pt-8 sm:pb-12 md:pb-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">
          {/* Left: Main content */}
          <div className="min-w-0">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Who We Are
            </span>
            <h2 className="font-heading text-2xl font-extrabold leading-tight text-primary sm:text-3xl md:text-4xl">
              {about.heading}
            </h2>
            <div className="mt-4 mb-8 flex items-center gap-2">
              <span className="h-1 w-12 rounded-full bg-primary" />
              <span className="h-1 w-3 rounded-full bg-accent" />
            </div>

            {lead && (
              <p className="mb-6 text-base font-medium leading-relaxed text-primary sm:text-lg sm:leading-[1.8]">
                {lead}
              </p>
            )}

            <div className="space-y-5 text-[15px] leading-[1.85] text-muted-foreground">
              {rest.map((paragraph, index) => (
                <div key={index}>
                  <p>{paragraph}</p>
                  {index === 0 && quote && (
                    <blockquote className="reveal relative my-10 overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-lg shadow-primary/20 sm:px-10 sm:py-10">
                      <Quote
                        aria-hidden
                        className="absolute -right-3 -top-3 h-24 w-24 rotate-180 text-white/5 sm:h-32 sm:w-32"
                      />
                      <Quote aria-hidden className="mb-4 h-8 w-8 fill-accent text-accent" />
                      <p className="relative font-heading text-lg font-semibold italic leading-relaxed sm:text-xl">
                        {quote}
                      </p>
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sticky sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            {/* Quick Facts */}
            <div className="reveal relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5"
              />
              <h3 className="relative mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                <span className="h-px w-6 bg-accent" />
                Quick Facts
              </h3>
              <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-white/10">
                {about.quickFacts.map((stat) => {
                  const Icon = resolveIcon(stat.icon);
                  return (
                    <div
                      key={stat.label}
                      className="group flex flex-col gap-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 lg:flex-row lg:items-center lg:gap-4 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-3.5 lg:hover:bg-transparent"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading text-xl font-extrabold leading-tight">
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/65">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campus image with location overlay */}
            <div className="reveal group relative h-56 overflow-hidden rounded-2xl shadow-md sm:h-64 lg:h-52">
              <Image
                src={about.campusImage}
                alt={about.campusLocation}
                fill
                sizes="(min-width: 1024px) 340px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                {about.campusLocation}
              </div>
            </div>

            {/* CTA */}
            <div className="reveal rounded-2xl border border-primary/10 bg-white p-6 text-center shadow-sm">
              <h4 className="font-heading text-lg font-bold text-primary">{about.ctaTitle}</h4>
              <p className="mt-1 mb-5 text-sm text-muted-foreground">{about.ctaSubtitle}</p>
              <Button
                variant="highlight"
                size="cta"
                className="w-full"
                nativeButton={false}
                render={<Link href={about.ctaButtonLink} />}
              >
                {about.ctaButtonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
