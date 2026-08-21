import SectionShell from "@/components/shared/SectionShell";
import pageData from "@/content/academics/page.json";
import AcademicResultsSection from "../_ui/AcademicResultsSection";
import type { AcademicsPageContent } from "@/types/academics";
import { NAV_ITEMS } from "../layout";

export default function AcademicResultsPage() {
  const content = pageData as AcademicsPageContent;

  return (
    <SectionShell
      title="Academic Menu"
      items={NAV_ITEMS}
      activeId="academic-results"
      basePath="/academics"
      routingMode="path"
    >
      <AcademicResultsSection content={content.academicResults} />
    </SectionShell>
  );
}
