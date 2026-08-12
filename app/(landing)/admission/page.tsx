import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import {
  Megaphone,
  CalendarDays,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import SectionShell, { type SectionNavItem } from "@/components/shared/SectionShell";
import { ADMISSION_SECTION_IDS, type AdmissionPageContent, type AdmissionSectionId } from "@/types/admission";
import pageData from "@/content/admission/page.json";
import UnderConstruction from "./_ui/UnderConstruction";
import RequirementSection from "./_ui/RequirementSection";
import AdmissionTestSection from "./_ui/AdmissionTestSection";
import DirectAdmissionSection from "./_ui/DirectAdmissionSection";
import DocumentsRequiredSection from "./_ui/DocumentsRequiredSection";
import PaymentPolicySection from "./_ui/PaymentPolicySection";
import OnlineAdmissionSection from "./_ui/OnlineAdmissionSection";
import TuitionFeesSection from "./_ui/TuitionFeesSection";
import ScholarshipSection from "./_ui/ScholarshipSection";
import AdmissionContactSection from "./_ui/AdmissionContactSection";

const content = pageData as AdmissionPageContent;

const NAV_ITEMS: SectionNavItem[] = [
  { id: "admission-advertisement", label: "Admission Advertisement", icon: "alert-circle" },
  { id: "requirement", label: "Admission Requirement", icon: "check-circle" },
  { id: "admission-schedule", label: "Admission Schedule", icon: "calendar" },
  { id: "admission-test", label: "Admission Test", icon: "file-text" },
  { id: "direct-admission", label: "Direct Admission", icon: "graduation-cap" },
  { id: "documents-required", label: "Documents Required", icon: "book-open" },
  { id: "payment-policy", label: "Payment Policy", icon: "trending-up" },
  { id: "online-admission", label: "Online Admission", icon: "globe" },
  { id: "tuition-fees", label: "Tuition & Others Fees", icon: "award" },
  { id: "faq", label: "FAQ", icon: "alert-circle" },
  { id: "admission-test-result", label: "Admission Test Result", icon: "check-circle" },
  { id: "scholarship", label: "Scholarship & Financial Assistance", icon: "trophy" },
  { id: "admission-contact", label: "Admission Contact", icon: "phone" },
];

export const metadata: Metadata = {
  title: "Admission | Port City International University",
  description: "Everything you need to know about joining Port City International University.",
};

export default async function AdmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const active: AdmissionSectionId = ADMISSION_SECTION_IDS.includes(section as AdmissionSectionId)
    ? (section as AdmissionSectionId)
    : "admission-advertisement";

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-linear-to-br from-primary via-primary/95 to-accent py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
            <GraduationCap className="size-3.5" />
            Admissions 2025
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Admission <span className="text-highlight">Information</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Everything you need to know about joining Port City International University.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <SectionShell
          title="Admission Menu"
          items={NAV_ITEMS}
          activeId={active}
          basePath="/admission"
        >
          {active === "admission-advertisement" && (
            <UnderConstruction
              icon={Megaphone}
              title="Admission Advertisement"
              subtitle="Latest admission circulars and advertisements from PCIU."
            />
          )}
          {active === "requirement" && <RequirementSection content={content.requirement} />}
          {active === "admission-schedule" && (
            <UnderConstruction
              icon={CalendarDays}
              title="Admission Schedule"
              subtitle="Admission timeline and important dates for each semester."
            />
          )}
          {active === "admission-test" && <AdmissionTestSection content={content.admissionTest} />}
          {active === "direct-admission" && (
            <DirectAdmissionSection content={content.directAdmission} />
          )}
          {active === "documents-required" && (
            <DocumentsRequiredSection content={content.documentsRequired} />
          )}
          {active === "payment-policy" && <PaymentPolicySection content={content.paymentPolicy} />}
          {active === "online-admission" && (
            <OnlineAdmissionSection content={content.onlineAdmission} />
          )}
          {active === "tuition-fees" && <TuitionFeesSection content={content.tuitionFees} />}
          {active === "faq" && (
            <UnderConstruction
              icon={HelpCircle}
              title="Frequently Asked Questions"
              subtitle="Common questions and answers about admission at PCIU."
            />
          )}
          {active === "admission-test-result" && (
            <UnderConstruction
              icon={BarChart3}
              title="Admission Test Result"
              subtitle="Check your admission test results here."
            />
          )}
          {active === "scholarship" && <ScholarshipSection content={content.scholarship} />}
          {active === "admission-contact" && (
            <AdmissionContactSection content={content.admissionContact} />
          )}
        </SectionShell>
      </div>
    </div>
  );
}
