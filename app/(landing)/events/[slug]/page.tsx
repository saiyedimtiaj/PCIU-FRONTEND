import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, ExternalLink, MapPin } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getEventBySlug } from "@/lib/api/events";
import {
  formatEventDateTime,
  formatEventPublishedDate,
  getEventSummary,
} from "@/lib/event-format";
import EventCarousel from "./_ui/EventCarousel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug);
  return event ? { title: `${event.title} | PCIU Events` } : {};
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();

  const images = (event.multipleImage ?? []).filter(Boolean);
  if (images.length === 0 && event.coverImageUrl)
    images.push(event.coverImageUrl);
  const description = getEventSummary(event.description);

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb
        items={[{ label: "Events", href: "/events" }, { label: event.title }]}
      />
      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/events"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All events
        </Link>
        <article className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
          <EventCarousel images={images} title={event.title} />
          <div className="p-5 sm:p-8 lg:p-10">
            {(event.badgeLabel || event.category) && (
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                {event.badgeLabel ?? event.category}
              </p>
            )}
            <h1 className="font-heading text-2xl font-bold leading-tight text-primary sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Published: {formatEventPublishedDate(event.createdAt)}
            </p>
            <div className="mt-6 grid gap-3 border-y border-primary/10 py-5 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-start gap-2">
                <Clock3
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                />
                <span>
                  <strong className="font-semibold text-primary">
                    Starts:
                  </strong>{" "}
                  {formatEventDateTime(event.startDateTime, event.allDay)}
                </span>
              </p>
              {event.endDateTime && (
                <p className="flex items-start gap-2">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  />
                  <span>
                    <strong className="font-semibold text-primary">
                      Ends:
                    </strong>{" "}
                    {formatEventDateTime(event.endDateTime, event.allDay)}
                  </span>
                </p>
              )}
              {event.location && (
                <p className="flex items-start gap-2">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  />
                  <span>
                    <strong className="font-semibold text-primary">
                      Location:
                    </strong>{" "}
                    {event.location}
                  </span>
                </p>
              )}
              {event.category && (
                <p>
                  <strong className="font-semibold text-primary">
                    Category:
                  </strong>{" "}
                  {event.category}
                </p>
              )}
            </div>
            {description && (
              <p className="mt-6 whitespace-pre-line text-base leading-8 text-muted-foreground">
                {description}
              </p>
            )}
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Event website{" "}
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
