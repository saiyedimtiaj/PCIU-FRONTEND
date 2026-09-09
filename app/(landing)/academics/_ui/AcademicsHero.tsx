"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { GraduationCap } from "lucide-react";
import type { SectionNavItem } from "@/components/shared/SectionShell";

/**
 * Overrides for segments where the hero title reads better than the sidebar
 * nav label verbatim (e.g. "Exam Routine" rather than "Exam Schedule").
 * Any segment not listed here just falls back to its nav item's own label.
 */
const HERO_TITLE_OVERRIDES: Record<string, string> = {
  "exam-schedule": "Exam Routine",
  "class-schedule": "Class Routine",
};

/**
 * Client component so it can read the active route segment via
 * useSelectedLayoutSegment() — the hero title swaps to the active section's
 * name instead of the generic "Academics" once a section is selected.
 */
export default function AcademicsHero({ items }: { items: SectionNavItem[] }) {
  const segment = useSelectedLayoutSegment();
  const activeItem = items.find((item) => item.id === segment);
  const title = (segment && HERO_TITLE_OVERRIDES[segment]) ?? activeItem?.label ?? "Academics";

  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
          <GraduationCap className="size-3.5" />
          Academic Information
        </span>
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
          {title}
        </h1>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
          Explore schedules, grading policies, examination rules, and academic
          results at Port City International University.
        </p>
      </div>
    </section>
  );
}
