import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  GraduationCap,
  Info,
  ListOrdered,
  ShieldCheck,
  Timer,
  Zap,
} from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { cn } from "@/lib/utils";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

const ICON_TONES = {
  primary: "bg-primary text-primary-foreground shadow-primary/20",
  highlight: "bg-highlight text-highlight-foreground shadow-highlight/25",
} as const;

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "No admission test" },
  { icon: Timer, label: "Seat secured immediately" },
] as const;

// Phone numbers and email addresses inside the note become tappable links.
const CONTACT_PATTERN = /(\+?880[\d-]{8,}|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function LinkifiedNote({ text }: { text: string }) {
  return text.split(CONTACT_PATTERN).map((part, index) => {
    if (index % 2 === 0) return part;
    const href = part.includes("@")
      ? `mailto:${part}`
      : `tel:${part.replace(/-/g, "")}`;
    return (
      <a
        key={part}
        href={href}
        className="font-semibold text-primary underline-offset-4 hover:underline"
      >
        {part}
      </a>
    );
  });
}

function EligibilityCard({
  icon: Icon,
  tone = "primary",
  eyebrow,
  title,
  items,
}: {
  icon: LucideIcon;
  tone?: keyof typeof ICON_TONES;
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <InfoCard className="h-full rounded-2xl border-border/80 shadow-sm [&_[data-slot=card-content]]:p-4 sm:[&_[data-slot=card-content]]:p-6 motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/20 motion-safe:hover:shadow-lg">
      <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md sm:size-12",
            ICON_TONES[tone],
          )}
        >
          <Icon className="size-5 stroke-2 sm:size-[22px]" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
          <h4 className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base">
            {title}
          </h4>
        </div>
      </div>
      <BulletList items={items} />
    </InfoCard>
  );
}

export default function DirectAdmissionSection({
  content,
}: {
  content: AdmissionPageContent["directAdmission"];
}) {
  const note = content.note.replace(/^Note:\s*/i, "");

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
          <Zap aria-hidden="true" className="size-6" />
        </span>
        <div className="pt-0.5">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Fast-track entry
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Direct Admission
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Meet the academic criteria below and join PCIU without sitting the
            admission test.
          </p>
        </div>
      </header>

      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-br from-primary/[0.06] via-background to-secondary/[0.08] p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-10 size-36 rounded-full bg-primary/[0.04]"
        />
        <p className="relative max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
          {content.intro}
        </p>
        <ul className="relative mt-4 flex flex-wrap gap-2">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-card px-3 py-1 text-xs font-semibold text-primary shadow-xs"
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <section
        aria-labelledby="direct-eligibility-heading"
        className="space-y-4 sm:space-y-5"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Who qualifies
          </p>
          <h3
            id="direct-eligibility-heading"
            className="mt-1 font-heading text-xl font-bold text-foreground"
          >
            Eligibility for direct admission
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 ">
          <EligibilityCard
            icon={BookOpen}
            eyebrow="Undergraduate"
            title="Bachelor's programs"
            items={content.undergraduateEligibility}
          />
          <EligibilityCard
            icon={Award}
            tone="highlight"
            eyebrow="Postgraduate"
            title="Master's programs"
            items={content.mastersEligibility}
          />
        </div>
      </section>

      <section
        aria-labelledby="direct-process-heading"
        className="space-y-4 sm:space-y-5"
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Step by step
            </p>
            <h3
              id="direct-process-heading"
              className="mt-1 flex items-center gap-2 font-heading text-xl font-bold text-foreground"
            >
              <ListOrdered
                aria-hidden="true"
                className="size-5 shrink-0 text-primary"
              />
              <span>Direct admission process</span>
            </h3>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {content.process.length} steps
          </span>
        </div>

        <ol className="relative">
          {content.process.map((step, index) => {
            const isLast = index === content.process.length - 1;
            return (
              <li
                key={step.step}
                className="relative flex gap-4 pb-4 last:pb-0 sm:gap-5"
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[19px] top-10 bottom-0 w-px bg-linear-to-b from-primary/40 to-border sm:left-[21px] sm:top-11"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={
                    isLast
                      ? "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight text-highlight-foreground font-heading text-sm font-bold shadow-md ring-4 ring-background sm:size-11"
                      : "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-sm font-bold shadow-md shadow-primary/15 ring-4 ring-background sm:size-11"
                  }
                >
                  {isLast ? (
                    <GraduationCap className="size-5" />
                  ) : (
                    String(step.step).padStart(2, "0")
                  )}
                </span>
                <InfoCard className="flex-1  rounded-2xl border-border/80 shadow-sm [&_[data-slot=card-content]]:p-4 sm:[&_[data-slot=card-content]]:px-5 motion-safe:transition motion-safe:duration-200 motion-safe:hover:border-primary/20 motion-safe:hover:shadow-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Step {step.step}
                  </p>
                  <h4 className="mt-0.5 font-heading text-sm font-semibold text-foreground sm:text-base">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.desc}
                  </p>
                </InfoCard>
              </li>
            );
          })}
        </ol>
      </section>

      <aside className="flex items-start gap-3 rounded-2xl border border-highlight/30 border-l-4 border-l-highlight bg-highlight/[0.06] p-4 sm:gap-4 sm:p-5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-highlight text-highlight-foreground shadow-md shadow-highlight/25 sm:size-10"
        >
          <Info className="size-4 stroke-[2.25] sm:size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Good to know
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            <LinkifiedNote text={note} />
          </p>
        </div>
      </aside>
    </div>
  );
}
