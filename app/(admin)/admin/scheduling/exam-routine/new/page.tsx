import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Exam Routine | Admin | Port City International University",
};

export default function NewExamRoutinePage() {
  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="exam-routine" cancelHref="/admin/scheduling/exam-routine" />
    </div>
  );
}
