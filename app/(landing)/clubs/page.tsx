import type { Metadata } from "next";
import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import EmptyState from "@/components/shared/EmptyState";
import { getClubs } from "@/lib/api/clubs";
import ClubCard from "./_ui/ClubCard";

export const metadata: Metadata = {
  title: "Clubs & Forums | Port City International University",
  description:
    "Discover the student clubs and forums at Port City International University — technology, culture, debate, sports and more.",
};

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="Clubs & Forums"
        subtitle="Find your people. Student-run clubs and forums where PCIU students learn, lead and create together beyond the classroom."
        variant="blobs"
      />
      <Breadcrumb items={[{ label: "Clubs & Forums" }]} />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        {clubs === null ? (
          <EmptyState title="Clubs couldn't be loaded" description="Please try again in a moment." />
        ) : clubs.length === 0 ? (
          <EmptyState title="No clubs yet" description="Clubs and forums will appear here soon." />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
