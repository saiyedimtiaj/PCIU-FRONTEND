import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Globe,
  ListOrdered,
  MonitorSmartphone,
} from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdmissionPageContent } from "@/types/admission";

export default function OnlineAdmissionSection({
  content,
}: {
  content: AdmissionPageContent["onlineAdmission"];
}) {
  const note = content.note.replace(/^Note:\s*/i, "");

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
          <Globe aria-hidden="true" className="size-6" />
        </span>
        <div className="pt-0.5">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Apply from anywhere
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Online Admission
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Submit your application, upload documents, and track your status
            without visiting the campus.
          </p>
        </div>
      </header>

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/95 to-accent p-5 text-primary-foreground shadow-lg shadow-primary/15 sm:p-7">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20 sm:flex"
            >
              <MonitorSmartphone className="size-6" />
            </span>
            <p className="max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              {content.intro}
            </p>
          </div>
          <Button
            variant="highlight"
            size="cta"
            className="shrink-0 gap-2 self-start px-5 shadow-md md:self-center"
            render={<Link href="/admission/apply" />}
            nativeButton={false}
          >
            Apply online now
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>

      <section
        aria-labelledby="online-steps-heading"
        className="space-y-4 sm:space-y-5"
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Step by step
            </p>
            <h3
              id="online-steps-heading"
              className="mt-1 flex items-center gap-2 font-heading text-xl font-bold text-foreground"
            >
              <ListOrdered
                aria-hidden="true"
                className="size-5 shrink-0 text-primary"
              />
              <span>Online application steps</span>
            </h3>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {content.steps.length} steps
          </span>
        </div>

        <InfoCard className="rounded-2xl border-border/80 shadow-sm [&_[data-slot=card-content]]:p-4 sm:[&_[data-slot=card-content]]:p-6">
          <ol>
            {content.steps.map((step, index) => {
              const isLast = index === content.steps.length - 1;
              return (
                <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute left-4.5 top-10 bottom-1 w-px bg-linear-to-b from-primary/40 to-border"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold shadow-md",
                      isLast
                        ? "bg-highlight text-highlight-foreground shadow-highlight/25"
                        : "bg-primary text-primary-foreground shadow-primary/20",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1.5 text-sm leading-6 text-foreground/80">
                    {step}
                  </p>
                </li>
              );
            })}
          </ol>
        </InfoCard>
      </section>

      <aside
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-highlight/30 border-l-4 border-l-highlight bg-highlight/6 p-4 sm:gap-4 sm:p-5"
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-highlight text-highlight-foreground shadow-md shadow-highlight/25 sm:size-10"
        >
          <Clock3 className="size-4 stroke-[2.25] sm:size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            After you submit online
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{note}</p>
        </div>
      </aside>
    </div>
  );
}
