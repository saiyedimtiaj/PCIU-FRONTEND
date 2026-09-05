import pageData from "@/content/academics/page.json";
import ExaminationPoliciesSection from "../_ui/ExaminationPoliciesSection";
import type { AcademicsPageContent } from "@/types/academics";

const content = pageData as AcademicsPageContent;

export default function ExaminationPoliciesPage() {
  return (
    <ExaminationPoliciesSection content={content.examinationPolicies} />
  );
}
