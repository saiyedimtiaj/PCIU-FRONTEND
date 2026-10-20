import Image from "next/image";
import { CalendarDays, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid md:grid-cols-2">
        <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-linear-to-br from-primary/5 via-muted to-accent/15 p-5 sm:min-h-80 md:min-h-[380px]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${advertisement.semesterName} admission advertisement`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-3"
            />
          ) : (
            <div
              role="img"
              aria-label="No advertisement image available"
              className="flex min-h-56 w-full flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-card/70 px-6 text-center sm:min-h-72"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Megaphone aria-hidden="true" className="size-7" />
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

        <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={advertisement.isActive ? "success" : "muted"}>
              <span
                aria-hidden="true"
                className={`mr-1.5 size-1.5 rounded-full ${
                  advertisement.isActive ? "bg-success" : "bg-muted-foreground"
                }`}
              />
              {advertisement.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Admission circular
            </span>
          </div>

          <h3 className="mt-5 font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl">
            {advertisement.semesterName}
          </h3>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-primary">
              <CalendarDays aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Admission year
              </p>
              <p className="mt-0.5 text-lg font-semibold text-foreground">
                {advertisement.year}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Explore the latest admission information for this semester at Port
            City International University.
          </p>
        </div>
      </div>
    </article>
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
      <div className="grid overflow-hidden rounded-2xl border border-border md:grid-cols-2">
        <div className="min-h-64 animate-pulse bg-muted sm:min-h-80 md:min-h-[380px]" />
        <div className="space-y-5 p-6 sm:p-8">
          <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </section>
  );
}
