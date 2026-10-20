import type { Metadata } from "next";
import { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import SectionShell, {
  type SectionNavItem,
} from "@/components/shared/SectionShell";
import {
  ADMISSION_SECTION_IDS,
  type AdmissionPageContent,
  type AdmissionSectionId,
} from "@/types/admission";
import pageData from "@/content/admission/page.json";
import AdmissionAdvertisement, {
  AdmissionAdvertisementSkeleton,
} from "./_ui/AdmissionAdvertisement";
import AdmissionSchedule, {
  AdmissionScheduleSkeleton,
} from "./_ui/AdmissionSchedule";
import AdmissionTestResult, {
  AdmissionTestResultSkeleton,
} from "./_ui/AdmissionTestResult";
import FAQ, { FAQSkeleton } from "./_ui/FAQ";
import RequirementSection from "./_ui/RequirementSection";
import AdmissionTestSection from "./_ui/AdmissionTestSection";
import DirectAdmissionSection from "./_ui/DirectAdmissionSection";
import DocumentsRequiredSection from "./_ui/DocumentsRequiredSection";
import PaymentPolicySection from "./_ui/PaymentPolicySection";
import OnlineAdmissionSection from "./_ui/OnlineAdmissionSection";
import TuitionFeesSection, {
  TuitionFeesSectionSkeleton,
} from "./_ui/TuitionFeesSection";
import ScholarshipSection from "./_ui/ScholarshipSection";
import AdmissionContactSection from "./_ui/AdmissionContactSection";

const content = pageData as AdmissionPageContent;

const NAV_ITEMS: SectionNavItem[] = [
  {
    id: "admission-advertisement",
    label: "Admission Advertisement",
    icon: "alert-circle",
  },
  { id: "requirement", label: "Admission Requirement", icon: "check-circle" },
  { id: "admission-schedule", label: "Admission Schedule", icon: "calendar" },
  { id: "admission-test", label: "Admission Test", icon: "file-text" },
  { id: "direct-admission", label: "Direct Admission", icon: "graduation-cap" },
  { id: "documents-required", label: "Documents Required", icon: "book-open" },
  { id: "payment-policy", label: "Payment Policy", icon: "trending-up" },
  { id: "online-admission", label: "Online Admission", icon: "globe" },
  { id: "tuition-fees", label: "Tuition & Others Fees", icon: "award" },
  { id: "faq", label: "FAQ", icon: "alert-circle" },
  {
    id: "admission-test-result",
    label: "Admission Test Result",
    icon: "check-circle",
  },
  {
    id: "scholarship",
    label: "Scholarship & Financial Assistance",
    icon: "trophy",
  },
  { id: "admission-contact", label: "Admission Contact", icon: "phone" },
];

export const metadata: Metadata = {
  title: "Admission | Port City International University",
  description:
    "Everything you need to know about joining Port City International University.",
};

export default async function AdmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const active: AdmissionSectionId =
    ADMISSION_SECTION_IDS.find((id) => id === section) ??
    "admission-advertisement";

  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--primary-glow),var(--primary)_70%)] py-6 sm:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-secondary/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 size-64 rounded-full bg-highlight/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-highlight/60 to-transparent" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            <GraduationCap
              aria-hidden="true"
              className="size-3.5 text-highlight"
            />
            Admissions
          </span>
          <h1 className="mb-3 font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            Admission <span className="text-highlight">Information</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/75 sm:text-base">
            Everything you need to know about joining Port City International
            University.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 md:px-8 py-12">
        <SectionShell
          title="Admission Menu"
          items={NAV_ITEMS}
          activeId={active}
          basePath="/admission"
        >
          {active === "admission-advertisement" && (
            <Suspense fallback={<AdmissionAdvertisementSkeleton />}>
              <AdmissionAdvertisement />
            </Suspense>
          )}
          {active === "requirement" && (
            <RequirementSection content={content.requirement} />
          )}
          {active === "admission-schedule" && (
            <Suspense fallback={<AdmissionScheduleSkeleton />}>
              <AdmissionSchedule />
            </Suspense>
          )}
          {active === "admission-test" && (
            <AdmissionTestSection content={content.admissionTest} />
          )}
          {active === "direct-admission" && (
            <DirectAdmissionSection content={content.directAdmission} />
          )}
          {active === "documents-required" && (
            <DocumentsRequiredSection content={content.documentsRequired} />
          )}
          {active === "payment-policy" && (
            <PaymentPolicySection content={content.paymentPolicy} />
          )}
          {active === "online-admission" && (
            <OnlineAdmissionSection content={content.onlineAdmission} />
          )}
          {active === "tuition-fees" && (
            <Suspense fallback={<TuitionFeesSectionSkeleton />}>
              <TuitionFeesSection content={content.tuitionFees} />
            </Suspense>
          )}
          {active === "faq" && (
            <Suspense fallback={<FAQSkeleton />}>
              <FAQ />
            </Suspense>
          )}
          {active === "admission-test-result" && (
            <Suspense fallback={<AdmissionTestResultSkeleton />}>
              <AdmissionTestResult />
            </Suspense>
          )}
          {active === "scholarship" && (
            <ScholarshipSection content={content.scholarship} />
          )}
          {active === "admission-contact" && (
            <AdmissionContactSection content={content.admissionContact} />
          )}
        </SectionShell>
      </div>
    </div>
  );
}
