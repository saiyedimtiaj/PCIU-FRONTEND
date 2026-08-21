import pageData from "@/content/academics/page.json";
import ResultGradingSection from "../_ui/ResultGradingSection";
import type { AcademicsPageContent } from "@/types/academics";

const content = pageData as AcademicsPageContent;

export default function ResultGradingPage() {
  return <ResultGradingSection content={content.resultGrading} />;
}
