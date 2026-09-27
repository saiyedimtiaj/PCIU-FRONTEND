import type { Metadata } from "next";
import { getMyRoutines } from "@/lib/academics/my-routines";
import TeacherExamRoutine from "./_ui/TeacherExamRoutine";

export const metadata: Metadata = {
  title: "Exam Routine | Faculty Portal | Port City International University",
};

export default async function FacultyPortalExamRoutinePage() {
  const { teacherName, examRoutines } = await getMyRoutines();

  return (
    <div className="w-full p-6">
      <TeacherExamRoutine
        routines={examRoutines}
        teacherName={teacherName ?? ""}
        error={
          teacherName === null
            ? "Couldn't load your profile, so your exam routine can't be shown. Please try again."
            : undefined
        }
      />
    </div>
  );
}
