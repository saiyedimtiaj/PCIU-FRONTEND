import { Suspense } from "react";
import { UserRound } from "lucide-react";

import { getKeyPersons } from "@/lib/api/home";
import KeyPersonsCarousel from "./KeyPersonsCarousel";

const HEADING_ID = "key-persons-heading";

export default function Keyperson() {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="relative isolate overflow-hidden bg-primary px-4 py-6 text-white sm:py-8 md:px-8 md:py-8"
    >
      <SectionBackdrop />

      {/* The section is visual-first with no on-screen title; this keeps it
          named in the document outline. */}
      <h2 id={HEADING_ID} className="sr-only">
        Key Persons
      </h2>

      <div className="container mx-auto px-0 sm:px-6 lg:px-8">
        <Suspense fallback={<KeyPersonsSkeleton />}>
          <KeyPersonsContent />
        </Suspense>
      </div>
    </section>
  );
}

/** Decorative layers on the navy section: soft waves and dot grids. */
function SectionBackdrop() {
  const dots =
    "absolute bg-[radial-gradient(rgba(255,255,255,0.35)_1.5px,transparent_1.5px)] bg-size-[14px_14px]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-linear-to-br from-[#0B1A6E] via-primary to-[#0A1450]" />

      {/* Flowing waves */}
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0 120 C300 40 520 220 820 150 C1100 85 1260 160 1440 110 V0 H0 Z"
          fill="var(--secondary)"
          opacity="0.18"
        />
        <path
          d="M0 420 C260 360 520 520 860 450 C1130 395 1300 470 1440 430 V600 H0 Z"
          fill="var(--secondary)"
          opacity="0.22"
        />
        <path
          d="M0 500 C320 450 600 580 940 520 C1180 478 1340 530 1440 510 V600 H0 Z"
          fill="#081046"
          opacity="0.55"
        />
      </svg>

      {/* Dot grids */}
      <div className={`${dots} left-6 top-10 h-16 w-20 sm:left-12`} />
      <div className={`${dots} right-6 top-10 h-16 w-20 sm:right-12`} />

      {/* Soft glows as plain radial gradients — same look as blurred blobs
          without the per-frame filter cost. */}
      <div className="absolute inset-0 bg-[radial-gradient(40rem_28rem_at_100%_0%,rgba(56,89,230,0.28),transparent_70%),radial-gradient(40rem_28rem_at_0%_100%,rgba(56,89,230,0.2),transparent_70%)]" />
    </div>
  );
}

async function KeyPersonsContent() {
  const { persons, error } = await getKeyPersons();

  if (persons.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 py-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white/70">
          <UserRound className="size-6" aria-hidden />
        </span>
        <p className="text-sm text-white/75 sm:text-base">
          {error
            ? "We couldn't load our key persons right now. Please check back shortly."
            : "Key person profiles will be published here soon."}
        </p>
      </div>
    );
  }

  return <KeyPersonsCarousel persons={persons} />;
}

/** Mirrors the carousel's layout so streaming in causes no shift. */
function KeyPersonsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading key persons"
      className="mx-auto flex max-w-5xl flex-col items-center gap-6"
    >
      <div className="relative mt-10 w-full rounded-3xl bg-white/10 md:mt-8">
        <div className="grid grid-cols-1 items-center gap-7 px-5 pb-9 sm:px-8 md:grid-cols-[220px_1fr] md:gap-10 md:py-8 lg:grid-cols-[240px_1fr] lg:gap-12 lg:px-12">
          <div className="mx-auto -mt-10 aspect-4/5 w-full max-w-52 animate-pulse rounded-[20px] bg-white/15 md:-my-14 md:max-w-none" />
          <div className="space-y-3.5">
            <div className="h-7 w-2/3 animate-pulse rounded bg-white/15" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
      <div className="h-10 w-48 animate-pulse rounded-full bg-white/10" />
      <span className="sr-only">Loading key persons…</span>
    </div>
  );
}
