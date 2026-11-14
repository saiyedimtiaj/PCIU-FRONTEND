import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { CoverImage } from "@/components/shared/FallbackImage";
import { cn } from "@/lib/utils";
import type { ClubActivity } from "@/types/clubs";

const COVER_FALLBACK = (
  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary via-primary-glow to-secondary">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[18px_18px] text-white opacity-15" />
    <span className="relative flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/25">
      <Sparkles className="size-7" aria-hidden />
    </span>
  </div>
);

/** "20 Sep 2026" (pre-formatted on the server) → calendar-tile parts. */
function dateParts(date: string) {
  const m = /^(\d{1,2}) (\w{3}) (\d{4})$/.exec(date);
  return m ? { day: m[1], month: m[2], year: m[3] } : null;
}

export default function ActivityCard({ activity, featured = false }: { activity: ClubActivity; featured?: boolean }) {
  const parts = activity.date ? dateParts(activity.date) : null;

  return (
    <article
      className={cn(
        "reveal group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10",
        featured && "sm:col-span-2 md:flex-row",
      )}
    >
      <div className={cn("relative aspect-video overflow-hidden bg-muted", featured && "md:aspect-auto md:min-h-72 md:w-[55%]")}>
        <CoverImage
          src={activity.coverImage}
          alt={activity.title}
          sizes={featured ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          fallback={COVER_FALLBACK}
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {featured && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
              Featured
            </span>
          )}
          {activity.type && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary capitalize shadow-sm backdrop-blur">
              {activity.type}
            </span>
          )}
        </div>
      </div>

      <div className={cn("flex flex-1 gap-4 p-5", featured && "md:p-7")}>
        {parts ? (
          <time
            className="flex h-fit w-14 shrink-0 flex-col items-center overflow-hidden rounded-xl border border-border text-center"
          >
            <span className="w-full bg-primary py-0.5 text-[0.65rem] font-bold tracking-wider text-primary-foreground uppercase">
              {parts.month}
            </span>
            <span className="pt-1 font-heading text-xl leading-none font-bold text-foreground">{parts.day}</span>
            <span className="pb-1 text-[0.65rem] text-muted-foreground tabular-nums">{parts.year}</span>
          </time>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          {!parts && activity.date && <p className="mb-1 text-xs font-medium text-muted-foreground">{activity.date}</p>}
          <h3
            className={cn(
              "font-heading leading-snug font-semibold text-foreground transition-colors group-hover:text-primary",
              featured ? "text-xl md:text-2xl" : "text-base",
            )}
          >
            {activity.title}
          </h3>
          {activity.location && (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-accent" aria-hidden />
              <span className="truncate">{activity.location}</span>
            </p>
          )}
          {activity.description && (
            <p
              className={cn(
                "mt-3 text-sm leading-relaxed text-muted-foreground",
                featured ? "line-clamp-6" : "line-clamp-3",
              )}
            >
              {activity.description}
            </p>
          )}
          {activity.url && (
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-1.5 pt-5 text-sm font-semibold text-primary"
            >
              <span className="underline-offset-4 hover:underline">Learn more</span>
              <span className="sr-only"> about {activity.title}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight className="size-3.5" aria-hidden />
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
