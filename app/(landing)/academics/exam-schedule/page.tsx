import { Suspense } from "react";
import pageData from "@/content/academics/page.json";
import ExamScheduleSection from "../_ui/ExamScheduleSection";
import type { AcademicsPageContent } from "@/types/academics";
import { Skeleton } from "@/components/ui/skeleton";
import { getLiveExams, getLiveExamRoutines } from "@/lib/academics/live";

const content = pageData as AcademicsPageContent;

export default function ExamSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-100 w-full" />
        </div>
      }
    >
      <ExamScheduleData searchParams={searchParams} />
    </Suspense>
  );
}

async function ExamScheduleData({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string }>;
}) {
  const [exams, routines] = await Promise.all([
    getLiveExams(),
    getLiveExamRoutines(),
  ]);

  return (
    <ExamScheduleSection
      content={{
        exams,
        routines,
        guidelines: content.examSchedule.guidelines,
      }}
      searchParams={searchParams}
    />
  );
}
