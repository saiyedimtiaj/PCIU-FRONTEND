import { ClipboardCheck } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function AdmissionTestSection({
  content,
}: {
  content: AdmissionPageContent["admissionTest"];
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
          <ClipboardCheck aria-hidden="true" className="size-6" />
        </span>
        <div className="pt-0.5">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Your next step
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Admission Test
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Everything you need to know to prepare, arrive, and complete your
            admission test with confidence.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-br from-primary/[0.06] via-background to-secondary/[0.08] p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-10 size-36 rounded-full bg-primary/[0.04]"
        />
        <p className="relative max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
          {content.intro}
        </p>
      </div>

      <section aria-labelledby="admission-test-tracks">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Choose your track
          </p>
          <h3
            id="admission-test-tracks"
            className="mt-1 font-heading text-xl font-bold text-foreground"
          >
            Test subjects
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {content.tracks.map((track, index) => (
            <InfoCard
              key={track.title}
              className="h-full overflow-hidden border-border/70 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 font-heading text-sm font-bold text-primary">
                  0{index + 1}
                </span>
                <h4 className="pt-1 font-heading font-semibold leading-5 text-foreground">
                  {track.title}
                </h4>
              </div>
              <BulletList items={track.subjects} />
              <p className="mt-5 rounded-lg bg-muted/70 px-3 py-2.5 text-xs font-semibold leading-5 text-foreground/80">
                {track.footer}
              </p>
            </InfoCard>
          ))}
        </div>
      </section>

      <InfoCard
        title="Test Day Guidelines"
        className="border-primary/10 bg-primary/[0.025]"
      >
        <p className="mb-4 text-sm leading-6 text-muted-foreground">
          Keep these essentials in mind on the day of your test.
        </p>
        <BulletList items={content.guidelines} />
      </InfoCard>

      <InfoCard title="How to Get the Admit Card">
        <ol className="space-y-4">
          {content.admitCardSteps.map((step, index) => (
            <li key={step.step} className="flex gap-3.5">
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {step.step}
                {index < content.admitCardSteps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-8 h-5 w-px -translate-x-1/2 bg-border"
                  />
                )}
              </span>
              <p className="pt-1 text-sm leading-6 text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </InfoCard>

      <InfoCard className="border border-secondary/20 bg-secondary/5">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 font-heading text-sm font-bold text-secondary">
            i
          </span>
          <p className="text-sm leading-6 text-foreground/80">{content.note}</p>
        </div>
      </InfoCard>
    </div>
  );
}
