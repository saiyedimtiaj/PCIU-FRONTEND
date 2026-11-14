import { Award, CircleCheck, ClipboardList, Percent } from "lucide-react";
import type { AdmissionPageContent } from "@/types/admission";

function parseBenefit(benefit: string) {
  const match = /(\d+)%/.exec(benefit);
  if (!match) return null;
  const rest = benefit.replace(match[0], "").replace(/^\s*up to\s*/i, "");
  return {
    percent: match[1],
    upTo: /^\s*up to/i.test(benefit),
    detail: rest.trim(),
  };
}

export default function ScholarshipSection({
  content,
}: {
  content: AdmissionPageContent["scholarship"];
}) {
  const maxWaiver = Math.max(
    0,
    ...content.scholarships.map((s) =>
      Number(parseBenefit(s.benefit)?.percent ?? 0),
    ),
  );

  return (
    <section aria-labelledby="scholarship-title" className="space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Award aria-hidden="true" className="size-3.5" />
          Financial support
        </div>
        <h2
          id="scholarship-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Scholarship & Financial Assistance
        </h2>
      </header>

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/95 to-accent p-6 text-white shadow-lg sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-sm leading-7 text-white/90 sm:text-base">
            {content.intro}
          </p>
          <dl className="grid grid-cols-2 gap-3 md:w-64">
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm ring-1 ring-white/15">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                Programs
              </dt>
              <dd className="mt-1 font-heading text-3xl font-bold tabular-nums">
                {content.scholarships.length}
              </dd>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm ring-1 ring-white/15">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                Up to
              </dt>
              <dd className="mt-1 font-heading text-3xl font-bold tabular-nums text-highlight">
                {maxWaiver}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {content.scholarships.map((s) => {
          const benefit = parseBenefit(s.benefit);
          return (
            <article
              key={s.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl sm:p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-primary/12"
                >
                  {s.icon}
                </span>
                {benefit && (
                  <div className="text-right">
                    {benefit.upTo && (
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Up to
                      </p>
                    )}
                    <p className="font-heading text-3xl font-bold leading-none tabular-nums text-primary">
                      {benefit.percent}
                      <span className="text-lg">%</span>
                    </p>
                  </div>
                )}
              </div>

              <h3 className="mt-4 font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                {s.name}
              </h3>

              <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                <CircleCheck
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-primary/70"
                />
                <span>
                  <span className="sr-only">Eligibility: </span>
                  {s.eligibility}
                </span>
              </div>

              <div className="mt-auto pt-4">
                <p className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-semibold text-primary">
                  <Percent aria-hidden="true" className="size-3.5" />
                  {benefit?.detail || s.benefit}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <section
        aria-labelledby="scholarship-apply-title"
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ClipboardList aria-hidden="true" className="size-5" />
          </span>
          <h3
            id="scholarship-apply-title"
            className="font-heading text-lg font-bold text-foreground sm:text-xl"
          >
            How to Apply for Scholarship
          </h3>
        </div>

        <ol className="relative space-y-4">
          {content.howToApply.map((step, i) => (
            <li key={step} className="relative flex gap-4">
              {i < content.howToApply.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-9 -bottom-4 w-px bg-border"
                />
              )}
              <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-sm font-bold tabular-nums text-primary">
                {i + 1}
              </span>
              <p className="flex-1 rounded-xl border border-transparent bg-muted/40 px-4 py-3 text-sm leading-6 text-foreground/85 transition duration-200 hover:translate-x-1 hover:border-primary/20 hover:bg-primary/5">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
