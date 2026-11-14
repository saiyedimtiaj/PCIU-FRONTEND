import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Expand,
  GraduationCap,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveUploadUrl } from "@/lib/upload-url";
import {
  getAdmissionAdvertisement,
  type AdmissionAdvertisementData,
} from "@/lib/api/admission";

export default async function AdmissionAdvertisement() {
  const result = await getAdmissionAdvertisement();

  return (
    <section
      aria-labelledby="admission-advertisement-title"
      className="space-y-5"
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-primary">
          <Megaphone aria-hidden="true" className="size-3.5" />
          Latest update
        </div>
        <h2
          id="admission-advertisement-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Admission Advertisement
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Latest admission circulars and advertisements from PCIU.
        </p>
      </header>

      {result.status === "error" ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8"
        >
          <h3 className="font-semibold text-foreground">
            Admission information is temporarily unavailable
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please try again later. We are unable to load the latest
            advertisement right now.
          </p>
        </div>
      ) : result.status === "empty" ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10"
        >
          <Megaphone
            aria-hidden="true"
            className="mx-auto size-9 text-primary/60"
          />
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            No advertisement available
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            There is no admission advertisement available at the moment. Please
            check back soon.
          </p>
        </div>
      ) : (
        <AdvertisementCard advertisement={result.data} />
      )}
    </section>
  );
}

function AdvertisementCard({
  advertisement,
}: {
  advertisement: AdmissionAdvertisementData;
}) {
  const imageSrc = resolveUploadUrl(advertisement.imageUrl);

  return (
    <article className="group/card overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:border-primary/20 hover:shadow-xl">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        {/* Poster */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-muted to-accent/20 p-4 sm:p-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--primary) 25%, transparent) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
          {imageSrc ? (
            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${advertisement.semesterName} advertisement in full size`}
              className="group/poster relative block aspect-4/5 overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:aspect-3/4 md:aspect-auto md:h-full md:min-h-105"
            >
              <Image
                src={imageSrc}
                alt={`${advertisement.semesterName} admission advertisement`}
                fill
                preload
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-2 transition-transform duration-500 group-hover/poster:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-sm font-semibold text-white opacity-0 transition duration-300 group-hover/poster:opacity-100 group-focus-visible/poster:opacity-100 max-md:opacity-100">
                <Expand aria-hidden="true" className="size-4" />
                View full size
              </span>
            </a>
          ) : (
            <div
              role="img"
              aria-label="No advertisement image available"
              className="relative flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-card/80 px-6 text-center sm:min-h-80 md:h-full md:min-h-105"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover/card:scale-110 group-hover/card:rotate-6">
                <Megaphone aria-hidden="true" className="size-8" />
              </span>
              <span className="mt-4 font-heading text-lg font-semibold text-primary">
                PCIU Admissions
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                Advertisement image coming soon
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-6 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={advertisement.isActive ? "success" : "muted"}>
              <span
                aria-hidden="true"
                className={`relative mr-1.5 flex size-1.5 rounded-full ${
                  advertisement.isActive ? "bg-success" : "bg-muted-foreground"
                }`}
              >
                {advertisement.isActive && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-success motion-reduce:hidden" />
                )}
              </span>
              {advertisement.isActive ? "Admission open" : "Inactive"}
            </Badge>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Admission circular
            </span>
          </div>

          <div>
            <h3 className="font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl">
              {advertisement.semesterName}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Explore the latest admission information for this semester at Port
              City International University.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <InfoTile icon={GraduationCap} label="Semester">
              {advertisement.semesterName.split(" ")[0]}
            </InfoTile>
            <InfoTile icon={CalendarDays} label="Year">
              {advertisement.year}
            </InfoTile>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="default"
              size="cta"
              nativeButton={false}
              render={<Link href="/admission/apply" />}
              className="group/btn shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Sparkles aria-hidden="true" className="size-4" />
              Apply now
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/btn:translate-x-1"
              />
            </Button>
            <Button
              variant="outlinePrimary"
              size="cta"
              nativeButton={false}
              render={<Link href="/admission?section=admission-schedule" />}
              className="transition hover:-translate-y-0.5"
            >
              <CalendarDays aria-hidden="true" className="size-4" />
              View schedule
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoTile({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="group/tile flex min-w-0 items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:shadow-md sm:p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-primary transition-colors group-hover/tile:bg-primary group-hover/tile:text-primary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="truncate text-base font-semibold tabular-nums text-foreground sm:text-lg">
          {children}
        </dd>
      </div>
    </div>
  );
}

export function AdmissionAdvertisementSkeleton() {
  return (
    <section
      aria-label="Loading admission advertisement"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="h-6 w-36 animate-pulse rounded-full bg-muted" />
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="h-5 w-full max-w-lg animate-pulse rounded bg-muted" />
      <div className="grid overflow-hidden rounded-3xl border border-border md:grid-cols-[1.1fr_1fr]">
        <div className="aspect-4/5 animate-pulse bg-muted sm:aspect-3/4 md:aspect-auto md:min-h-105" />
        <div className="space-y-5 p-6 sm:p-8">
          <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-18 animate-pulse rounded-xl bg-muted" />
            <div className="h-18 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </section>
  );
}
