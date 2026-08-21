import pageData from "@/content/academics/page.json";
import AcademicResultsSection from "../_ui/AcademicResultsSection";
import type { AcademicsPageContent } from "@/types/academics";

const content = pageData as AcademicsPageContent;

export default function AcademicResultsPage() {
  return <AcademicResultsSection content={content.academicResults} />;
}
