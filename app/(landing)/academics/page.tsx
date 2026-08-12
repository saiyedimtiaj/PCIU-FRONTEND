import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import SectionShell, { type SectionNavItem } from "@/components/shared/SectionShell";
import { ACADEMICS_SECTION_IDS, type AcademicsPageContent, type AcademicsSectionId } from "@/types/academics";
import pageData from "@/content/academics/page.json";
import ExamScheduleSection from "./_ui/ExamScheduleSection";
import ClassScheduleSection from "./_ui/ClassScheduleSection";
import ResultGradingSection from "./_ui/ResultGradingSection";
import ExaminationPoliciesSection from "./_ui/ExaminationPoliciesSection";
import AcademicResultsSection from "./_ui/AcademicResultsSection";
import CertificationVerificationSection from "./_ui/CertificationVerificationSection";

const content = pageData as AcademicsPageContent;

const NAV_ITEMS: SectionNavItem[] = [
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

export default async function AcademicsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const active: AcademicsSectionId = ACADEMICS_SECTION_IDS.includes(section as AcademicsSectionId)
    ? (section as AcademicsSectionId)
    : "exam-schedule";

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
        <SectionShell
          title="Academic Menu"
          items={NAV_ITEMS}
          activeId={active}
          basePath="/academics"
        >
          {active === "exam-schedule" && <ExamScheduleSection content={content.examSchedule} />}
          {active === "class-schedule" && <ClassScheduleSection content={content.classSchedule} />}
          {active === "result-grading" && <ResultGradingSection content={content.resultGrading} />}
          {active === "examination-policies" && (
            <ExaminationPoliciesSection content={content.examinationPolicies} />
          )}
          {active === "academic-results" && (
            <AcademicResultsSection content={content.academicResults} />
          )}
          {active === "certification-verification" && <CertificationVerificationSection />}
        </SectionShell>
      </div>
    </div>
  );
}
