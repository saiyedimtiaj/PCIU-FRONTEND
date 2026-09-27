import type { Metadata } from "next";
import type { SectionNavItem } from "@/components/shared/SectionShell";
import AcademicsHero from "./_ui/AcademicsHero";
import AcademicsNav from "./_ui/AcademicsNav";

const NAV_ITEMS: SectionNavItem[] = [
  { id: "exam-schedule", label: "Exam Schedule", icon: "calendar" },
  { id: "class-schedule", label: "Class Schedule", icon: "clock" },
  { id: "result-grading", label: "Rules & Grading System", icon: "award" },
  {
    id: "examination-policies",
    label: "Examination Policies",
    icon: "shield",
  },
  { id: "academic-results", label: "Academic Results", icon: "file-text" },
  {
    id: "certification-verification",
    label: "Certificate Verification",
    icon: "check-circle",
  },
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
      <AcademicsHero items={NAV_ITEMS} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <AcademicsNav items={NAV_ITEMS} />
          <div className="lg:col-span-3 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
