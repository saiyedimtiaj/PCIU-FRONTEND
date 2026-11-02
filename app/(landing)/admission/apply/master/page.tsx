import type { Metadata } from "next";
import { getPrograms } from "@/lib/api/home";
import { getActiveAdmissionCycle, isCycleOpen } from "@/lib/api/admission-apply";
import ApplyFormShell from "../_ui/ApplyFormShell";
import ApplicationsClosed from "../_ui/ApplicationsClosed";
import MasterApplicationForm from "./_ui/MasterApplicationForm";

export const metadata: Metadata = {
  title: "Apply for Master's Program | Port City International University",
  description: "Submit your online application for a Master's program at Port City International University.",
};

export default async function ApplyMasterPage() {
  const [programs, cycle] = await Promise.all([getPrograms(), getActiveAdmissionCycle()]);
  const graduatePrograms = programs.filter((program) => program.programType === "GRADUATE");

  return (
    <ApplyFormShell
      levelLabel="Master's"
      title="Apply for"
      highlight="Master's Program"
      description="Fill in the three sections below and submit your graduate application. It takes about ten minutes."
      sections={[
        { id: "program", label: "Program Selection" },
        { id: "personal", label: "Personal Information" },
        { id: "education", label: "Educational Qualifications" },
      ]}
      checklist={[
        "Keep your SSC, HSC and Bachelor's certificates nearby",
        "Use an active mobile number (+8801XXXXXXXXX)",
        "Use an email address you check regularly",
      ]}
      helpPhone="+880 1881-075020"
    >
      {cycle && isCycleOpen(cycle) ? (
        <MasterApplicationForm programs={graduatePrograms} cycle={cycle} />
      ) : (
        <ApplicationsClosed />
      )}
    </ApplyFormShell>
  );
}
