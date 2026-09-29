import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { HomeEvent } from "@/types/home";
import {
  formatEventDateTime,
  formatEventPublishedDate,
  getEventSummary,
} from "@/lib/event-format";

export default function EventCard({
  event,
  compact = false,
}: {
  event: HomeEvent;
  compact?: boolean;
}) {
  const summary = getEventSummary(event.description);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        compact
          ? "border-l-4 border-primary hover:border-accent"
          : "border border-primary/10"
      } ${compact ? "flex min-h-32" : "flex flex-col"}`}
    >
      {event.coverImageUrl ? (
        compact ? (
          <div className="relative w-28 shrink-0 overflow-hidden bg-muted sm:w-32">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              sizes="128px"
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="h-full w-full object-contain"
            />
          </div>
        )
      ) : (
        <div
          className={`flex items-center justify-center bg-primary/5 text-primary/50 ${
            compact ? "min-h-28 w-28 shrink-0 sm:w-32" : "aspect-video w-full"
          }`}
        >
          <CalendarDays aria-hidden="true" className="h-8 w-8" />
        </div>
      )}
      <div
        className={`min-w-0 flex-1 ${compact ? "p-3 sm:p-4" : "p-4 sm:p-5"}`}
      >
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {(event.badgeLabel || event.category) && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent ">
              {event.badgeLabel ?? event.category}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            Published: {formatEventPublishedDate(event.createdAt)}
          </span>
        </div>
        <h3 className="line-clamp-2 font-heading text-sm font-semibold text-primary transition-colors group-hover:text-accent sm:text-base">
          {event.title}
        </h3>
        {!compact && summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>
        )}
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {formatEventDateTime(event.startDateTime, event.allDay)}
            </span>
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
