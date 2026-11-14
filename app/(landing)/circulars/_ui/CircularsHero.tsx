import { Suspense, type ReactNode } from "react";
import { BriefcaseBusiness, FileText, Gavel, Megaphone } from "lucide-react";
import { HeroBackdrop, HeroBreadcrumb } from "@/components/shared/HeroBackdrop";
import { getCirculars, type CircularsResult } from "@/lib/api/circulars";
import { cn } from "@/lib/utils";

/**
 * Banner, breadcrumb and section intro in one block. The stats are fetched
 * separately and streamed in, so the title paints before the API answers.
 * The page pulls the filter toolbar up over the bottom padding.
 */
export default function CircularsHero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <HeroBackdrop />

      <div className="container mx-auto px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-28">
        <HeroBreadcrumb items={[{ label: "Circulars" }]} />

        <div className="mt-8 grid items-center gap-8 md:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
              <span className="flex size-6 items-center justify-center rounded-md bg-accent/15">
                <Megaphone aria-hidden className="size-3.5" />
              </span>
              Official announcements
            </span>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
              University <span className="text-accent">Circulars</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              Job openings, tenders and official notices from across the university — explore the
              latest opportunities in one place.
            </p>
          </div>

          <Suspense fallback={<StatsSkeleton />}>
            <HeroStats />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function HeroStats() {
  // Same 60s-cached endpoint the results use; the unfiltered call is deduped.
  const [all, jobs, tenders] = await Promise.all([
    getCirculars(),
    getCirculars({ type: "JOB" }),
    getCirculars({ type: "TENDER" }),
  ]);
  if (!all.ok) return null;

  const count = (r: CircularsResult) => (r.ok ? r.pagination.totalCirculars : null);

  return (
    <dl className="grid grid-cols-3 gap-2 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-2 backdrop-blur-sm lg:w-md">
      <Stat featured icon={<FileText className="size-4.5" />} label="Total" value={count(all)} />
      <Stat icon={<BriefcaseBusiness className="size-4.5" />} label="Jobs" value={count(jobs)} />
      <Stat icon={<Gavel className="size-4.5" />} label="Tenders" value={count(tenders)} />
    </dl>
  );
}

function Stat({
  icon,
  label,
  value,
  featured = false,
}: {
  icon: ReactNode;
  label: string;
  value: number | null;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl px-3 py-3.5 sm:px-4",
        featured ? "bg-accent text-accent-foreground" : "bg-primary-foreground/5",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          featured ? "bg-accent-foreground/10" : "bg-accent/15 text-accent",
        )}
      >
        {icon}
      </span>
      {/* dt must precede dd in the markup; flip them visually. */}
      <div className="flex flex-col-reverse leading-tight">
        <dt className={cn("text-xs", featured ? "opacity-75" : "text-primary-foreground/70")}>
          {label}
        </dt>
        <dd className="font-heading text-2xl font-bold tabular-nums md:text-3xl">{value ?? "—"}</dd>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div
      aria-hidden
      className="grid grid-cols-3 gap-2 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-2 lg:w-md"
    >
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-30 animate-pulse rounded-xl bg-primary-foreground/10" />
      ))}
    </div>
  );
}
