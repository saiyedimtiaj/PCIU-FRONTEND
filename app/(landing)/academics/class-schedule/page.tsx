import { Suspense } from "react";
import ClassScheduleSection from "../_ui/ClassScheduleSection";
import { Skeleton } from "@/components/ui/skeleton";
import { getLiveClassRoutines, getLiveClassTimeSlots } from "@/lib/academics/live";

export default function ClassSchedulePage() {
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
      <ClassScheduleData />
    </Suspense>
  );
}

async function ClassScheduleData() {
  const [routines, timeSlots] = await Promise.all([
    getLiveClassRoutines(),
    getLiveClassTimeSlots(),
  ]);

  return <ClassScheduleSection content={{ routines, timeSlots }} />;
}
