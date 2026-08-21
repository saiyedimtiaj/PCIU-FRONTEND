import SectionShell from "@/components/shared/SectionShell";
import pageData from "@/content/academics/page.json";
import ClassScheduleSection from "../_ui/ClassScheduleSection";
import type { AcademicsPageContent } from "@/types/academics";
import { NAV_ITEMS } from "../layout";

export default function ClassSchedulePage() {
  const content = pageData as AcademicsPageContent;

  return (
    <SectionShell
      title="Academic Menu"
      items={NAV_ITEMS}
      activeId="class-schedule"
      basePath="/academics"
      routingMode="path"
    >
      <ClassScheduleSection content={content.classSchedule} />
    </SectionShell>
  );
}
