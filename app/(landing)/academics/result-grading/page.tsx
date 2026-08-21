import SectionShell from "@/components/shared/SectionShell";
import pageData from "@/content/academics/page.json";
import ResultGradingSection from "../_ui/ResultGradingSection";
import type { AcademicsPageContent } from "@/types/academics";
import { NAV_ITEMS } from "../layout";

export default function ResultGradingPage() {
  const content = pageData as AcademicsPageContent;

  return (
    <SectionShell
      title="Academic Menu"
      items={NAV_ITEMS}
      activeId="result-grading"
      basePath="/academics"
      routingMode="path"
    >
      <ResultGradingSection content={content.resultGrading} />
    </SectionShell>
  );
}
