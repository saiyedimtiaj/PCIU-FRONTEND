import type { ReactNode } from "react";
import {
  BookOpen,
  CircleCheck,
  ClipboardCheck,
  GraduationCap,
  Info,
  Layers,
  ScrollText,
} from "lucide-react";
import { iconMap } from "@/lib/icons";
import type { AdmissionPageContent } from "@/types/admission";

export default function RequirementSection({
  content,
}: {
  content: AdmissionPageContent["requirement"];
}) {
  const minGpa = /GPA\s*(\d+(?:\.\d+)?)/i.exec(
    content.bachelor.flatMap((g) => g.items).join(" "),
  )?.[1];

  return (
    <section aria-labelledby="requirement-title" className="space-y-10">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <ClipboardCheck aria-hidden="true" className="size-3.5" />
          Your path to PCIU
        </div>
        <h2
          id="requirement-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Admission Requirements
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          Review the general eligibility criteria and any additional
          requirements for your intended program.
        </p>
      </header>

      {/* Intro + at-a-glance stats */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/95 to-accent p-5 text-white shadow-lg sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative space-y-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20"
            >
              <Info className="size-5" />
            </span>
            <div>
              <h3 className="font-heading font-semibold">Before you apply</h3>
              <p className="mt-1 text-sm leading-6 text-white/85">
                {content.intro}
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {minGpa && <Stat label="Minimum GPA">{minGpa}</Stat>}
            <Stat label="Study areas">{content.bachelor.length}</Stat>
            <Stat label="Master's programs">
              {content.programSpecific.length}
            </Stat>
          </dl>
        </div>
      </div>

      {/* Bachelor's */}
      <div className="space-y-5">
        <SubHeading
          id="bachelor-requirements-heading"
          eyebrow="Undergraduate"
          icon={BookOpen}
          count={`${content.bachelor.length} study areas`}
        >
          Bachelor&apos;s Degree Requirements
        </SubHeading>

        <div className="grid gap-4 md:grid-cols-2">
          {content.bachelor.map((group) => {
            const Icon = iconMap[group.icon];
            return (
              <article
                key={group.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="flex items-center gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Icon className="size-6 stroke-[1.8]" />
                  </span>
                  <h4 className="min-w-0 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
                    {group.title}
                  </h4>
                </div>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-muted/40 p-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-0.5 shrink-0 rounded-md bg-card px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-border">
                        {/O-Level|A-Level/i.test(item) ? "O/A Level" : "SSC/HSC"}
                      </span>
                      <span className="min-w-0 flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      {/* Master's general */}
      <div className="space-y-5">
        <SubHeading
          id="masters-requirements-heading"
          eyebrow="Postgraduate"
          icon={GraduationCap}
        >
          Master&apos;s Degree General Requirements
        </SubHeading>

        <ul className="grid gap-3 md:grid-cols-3">
          {content.mastersGeneral.map((item, i) => (
            <li
              key={item}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full bg-success/15 text-success transition-colors group-hover:bg-success group-hover:text-white"
                >
                  <CircleCheck className="size-4" />
                </span>
                <span className="font-heading text-2xl font-bold tabular-nums text-primary/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Program-specific */}
      <div className="space-y-5">
        <SubHeading
          id="program-specific-requirements-heading"
          eyebrow="Additional eligibility"
          icon={Layers}
          count={`${content.programSpecific.length} programs`}
        >
          Program-specific Requirements
        </SubHeading>

        <ol className="grid gap-3 md:grid-cols-2">
          {content.programSpecific.map((entry, index) => (
            <li
              key={entry.program}
              className="group flex gap-3 rounded-2xl border border-l-4 border-border border-l-primary/30 bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:border-l-primary hover:shadow-lg sm:gap-4 sm:p-5"
            >
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold tabular-nums text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="font-heading text-sm font-semibold leading-6 text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
                  {entry.program}
                </h4>
                <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <ScrollText
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-primary/60"
                  />
                  <span>
                    <span className="sr-only">Required: </span>
                    {entry.req}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SubHeading({
  id,
  eyebrow,
  icon: Icon,
  count,
  children,
}: {
  id: string;
  eyebrow: string;
  icon: typeof BookOpen;
  count?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        >
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
          <h3
            id={id}
            className="font-heading text-lg font-bold leading-snug text-foreground sm:text-xl"
          >
            {children}
          </h3>
        </div>
      </div>
      {count && (
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      )}
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 text-center ring-1 ring-white/15 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/15 sm:p-4">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-white/70 sm:text-[11px]">
        {label}
      </dt>
      <dd className="mt-1 font-heading text-2xl font-bold tabular-nums sm:text-3xl">
        {children}
      </dd>
    </div>
  );
}
