import SectionShell from "@/components/shared/SectionShell";
import pageData from "@/content/academics/page.json";
import ExamScheduleSection from "../_ui/ExamScheduleSection";
import type { AcademicsPageContent } from "@/types/academics";
import { NAV_ITEMS } from "../layout";

export default async function ExamSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string }>;
}) {
  const content = pageData as AcademicsPageContent;
  const { examId } = await searchParams;

  return (
    <SectionShell
      title="Academic Menu"
      items={NAV_ITEMS}
      activeId="exam-schedule"
      basePath="/academics"
      routingMode="path"
    >
      <ExamScheduleSection content={content.examSchedule} examId={examId} />
    </SectionShell>
  );
}
