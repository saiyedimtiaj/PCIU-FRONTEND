import type { Metadata } from "next";
import EmptyState from "@/components/shared/EmptyState";
import { getClubs } from "@/lib/api/clubs";
import ClubsBrowser from "./_ui/ClubsBrowser";
import ClubsHero from "./_ui/ClubsHero";

export const metadata: Metadata = {
  title: "Clubs & Forums | Port City International University",
  description:
    "Discover the student clubs and forums at Port City International University — technology, culture, debate, sports and more.",
  alternates: { canonical: "/clubs" },
};

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-muted/30 to-background">
      <ClubsHero clubs={clubs} />

      {/* Pulled up so the filter toolbar overlaps the hero's lower edge. */}
      <main className="relative z-10 container mx-auto -mt-16 px-4 pb-20 md:-mt-20 md:px-8 md:pb-28">
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
      </main>
    </div>
  );
}
