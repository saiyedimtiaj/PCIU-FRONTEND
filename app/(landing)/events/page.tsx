import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getEvents } from "@/lib/api/events";
import EventsDirectory from "./_ui/EventsDirectory";

export const metadata: Metadata = {
  title: "All Events | Port City International University",
  description:
    "Explore upcoming and past events at Port City International University.",
};

export default async function EventsPage() {
  const result = await getEvents();

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-r from-primary via-primary/90 to-accent/80 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            All Events
          </h1>
        </div>
      </section>
      <Breadcrumb items={[{ label: "Events" }]} />
      <main className="container mx-auto px-4 py-10 sm:px-6 sm:py-12">
        <EventsDirectory {...result} />
      </main>
    </div>
  );
}
