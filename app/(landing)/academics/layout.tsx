import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import type { SectionNavItem } from "@/components/shared/SectionShell";
export const NAV_ITEMS: SectionNavItem[] = [
  { id: "exam-schedule", label: "Exam Schedule", icon: "calendar" },
  { id: "class-schedule", label: "Class Schedule", icon: "clock" },
  { id: "result-grading", label: "Rules & Grading System", icon: "award" },
  { id: "examination-policies", label: "Examination Policies", icon: "shield" },
  { id: "academic-results", label: "Academic Results", icon: "file-text" },
  { id: "certification-verification", label: "Certificate Verification", icon: "check-circle" },
];

export const metadata: Metadata = {
  title: "Academics | Port City International University",
  description:
    "Explore schedules, grading policies, examination rules, and academic results at Port City International University.",
};

export default function AcademicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
            <GraduationCap className="size-3.5" />
            Academic Information
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
            Academics
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Explore schedules, grading policies, examination rules, and academic results at Port
            City International University.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  );
}
