import SectionShell from "@/components/shared/SectionShell";
import pageData from "@/content/academics/page.json";
import ExaminationPoliciesSection from "../_ui/ExaminationPoliciesSection";
import type { AcademicsPageContent } from "@/types/academics";
import { NAV_ITEMS } from "../layout";

export default function ExaminationPoliciesPage() {
  const content = pageData as AcademicsPageContent;

  return (
    <SectionShell
      title="Academic Menu"
      items={NAV_ITEMS}
      activeId="examination-policies"
      basePath="/academics"
      routingMode="path"
    >
      <ExaminationPoliciesSection content={content.examinationPolicies} />
    </SectionShell>
  );
}
