import pageData from "@/content/academics/page.json";
import ClassScheduleSection from "../_ui/ClassScheduleSection";
import type { AcademicsPageContent } from "@/types/academics";

const content = pageData as AcademicsPageContent;

export default function ClassSchedulePage() {
  return <ClassScheduleSection content={content.classSchedule} />;
}
