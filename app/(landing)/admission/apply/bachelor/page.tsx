import type { Metadata } from "next";
import { getPrograms } from "@/lib/api/home";
import { getActiveAdmissionCycle, isCycleOpen } from "@/lib/api/admission-apply";
import ApplyFormShell from "../_ui/ApplyFormShell";
import ApplicationsClosed from "../_ui/ApplicationsClosed";
import BachelorApplicationForm from "./_ui/BachelorApplicationForm";

export const metadata: Metadata = {
  title: "Apply for Bachelor's Program | Port City International University",
  description: "Submit your online application for a Bachelor's program at Port City International University.",
};

export default async function ApplyBachelorPage() {
  const [programs, cycle] = await Promise.all([getPrograms(), getActiveAdmissionCycle()]);
  const undergraduatePrograms = programs.filter((program) => program.programType === "UNDERGRADUATE");

  return (
    <ApplyFormShell
      levelLabel="Bachelor's"
      title="Apply for"
      highlight="Bachelor's Program"
      description="Fill in the three sections below and submit your undergraduate application. It takes about ten minutes."
      sections={[
        { id: "program", label: "Program Selection" },
        { id: "personal", label: "Personal Information" },
        { id: "education", label: "Educational Qualifications" },
      ]}
      checklist={[
        "Keep your SSC and HSC certificates nearby",
        "Use an active mobile number (+8801XXXXXXXXX)",
        "Use an email address you check regularly",
      ]}
      helpPhone="+880 1881-075020"
    >
      {cycle && isCycleOpen(cycle) ? (
        <BachelorApplicationForm programs={undergraduatePrograms} cycle={cycle} />
      ) : (
        <ApplicationsClosed />
      )}
    </ApplyFormShell>
  );
}
