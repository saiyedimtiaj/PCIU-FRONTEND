import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { getSportsTeams } from "@/lib/api/sports";
import SportsHero from "./_ui/SportsHero";
import TeamCard from "./_ui/TeamCard";

export const metadata: Metadata = {
  title: "PCIU Sports Teams | Port City International University",
  description:
    "Meet the sports teams of Port City International University competing in inter-university tournaments.",
  alternates: { canonical: "/sports" },
};

export default async function SportsPage() {
  const teams = await getSportsTeams();

  return (
    <div className="min-h-screen bg-background">
      <SportsHero teams={teams} />

      {/* Pulled up so the first row of cards overlaps the hero's lower edge. */}
      <main className="relative z-10 container mx-auto -mt-16 px-4 pb-16 md:-mt-20 md:px-8 md:pb-24">
        <section aria-labelledby="teams-heading">
          <h2 id="teams-heading" className="sr-only">
            Our teams
          </h2>
          {teams === null || teams.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
              {teams === null ? (
                <EmptyState
                  title="Teams couldn't be loaded"
                  description="Please try again in a moment."
                />
              ) : (
                <EmptyState
                  title="No teams yet"
                  description="Our sports teams will appear here soon."
                />
              )}
            </div>
          ) : (
            // Flex-wrap rather than grid so a short last row (or a single
            // team) sits centred instead of hugging the left edge.
            <ul className="flex flex-wrap justify-center gap-6">
              {teams.map((team, index) => (
                <li
                  key={team.id}
                  className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]"
                >
                  {/* The first row is above the fold on desktop — load it eagerly. */}
                  <TeamCard team={team} eager={index < 3} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="relative isolate mt-16 overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:mt-20">
          <HeroBackdrop />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-black/20">
                <Trophy className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-heading text-xl font-bold md:text-2xl">
                  Want to represent PCIU?
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
                  Get in touch with the university to find out about team trials
                  and how to get involved.
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
