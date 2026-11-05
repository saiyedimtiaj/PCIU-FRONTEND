import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Handshake,
  Lightbulb,
  MessageCircle,
  Trophy,
} from "lucide-react";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { getClubs } from "@/lib/api/clubs";
import ClubsBrowser from "./_ui/ClubsBrowser";
import ClubsHero from "./_ui/ClubsHero";

export const metadata: Metadata = {
  title: "Clubs & Forums | Port City International University",
  description:
    "Discover the student clubs and forums at Port City International University — technology, culture, debate, sports and more.",
  alternates: { canonical: "/clubs" },
};

const BENEFITS = [
  {
    icon: Lightbulb,
    title: "Build real skills",
    text: "Turn classroom theory into hands-on projects, workshops and competitions.",
  },
  {
    icon: Handshake,
    title: "Grow your network",
    text: "Meet students, alumni and mentors who share your interests across departments.",
  },
  {
    icon: Trophy,
    title: "Lead and compete",
    text: "Organise events, take on leadership roles and represent PCIU beyond campus.",
  },
  {
    icon: Compass,
    title: "Find your passion",
    text: "Explore technology, service, culture and more — and discover what drives you.",
  },
] as const;

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <div className="min-h-screen bg-background">
      <ClubsHero clubs={clubs} />

      {/* Pulled up so the filter toolbar overlaps the hero's lower edge. */}
      <main className="relative z-10 container mx-auto -mt-16 px-4 pb-16 md:-mt-20 md:px-8 md:pb-24">
        {clubs === null || clubs.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
            {clubs === null ? (
              <EmptyState
                title="Clubs couldn't be loaded"
                description="Please try again in a moment."
              />
            ) : (
              <EmptyState
                title="No clubs yet"
                description="Clubs and forums will appear here soon."
              />
            )}
          </div>
        ) : (
          <ClubsBrowser clubs={clubs} />
        )}

        <section aria-labelledby="why-heading" className="mt-16 md:mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Why join a club
            </p>
            <h2
              id="why-heading"
              className="font-heading text-2xl font-bold text-foreground md:text-3xl"
            >
              More than a classroom
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Clubs are where ideas turn into projects, classmates turn into
              teams, and students turn into leaders.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="reveal group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative isolate mt-16 overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:mt-20">
          <HeroBackdrop />

          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-black/20">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading text-xl font-bold md:text-2xl">
                  Want to join or start a club?
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
                  Reach out to the university and we&apos;ll connect you with
                  the right people to get involved.
                </p>
              </div>
            </div>
            <Button
              variant="highlight"
              size="cta"
              render={<Link href="/contacts" />}
              nativeButton={false}
            >
              Get in touch
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
