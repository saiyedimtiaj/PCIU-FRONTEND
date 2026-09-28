import type { Metadata } from "next";
import { getLiveClassTimeSlots } from "@/lib/academics/live";
import { getMyRoutines } from "@/lib/academics/my-routines";
import TeacherClassRoutine from "./_ui/TeacherClassRoutine";

export const metadata: Metadata = {
  title: "Class Routine | Faculty Portal | Port City International University",
};

export default async function FacultyPortalClassRoutinePage() {
  const [{ teacherName, classRoutines }, timeSlots] = await Promise.all([
    getMyRoutines(),
    getLiveClassTimeSlots(),
  ]);

  return (
    <div className="w-full p-6">
      <TeacherClassRoutine
        routines={classRoutines}
        timeSlots={timeSlots}
        teacherName={teacherName ?? ""}
        error={
          teacherName === null
            ? "Couldn't load your profile, so your routine can't be shown. Please try again."
            : undefined
        }
      />
    </div>
  );
}
