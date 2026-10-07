import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import BulkRoutineForm from "@/components/admin/routine-bulk/BulkRoutineForm";

export const metadata: Metadata = {
  title: "Bulk Add Exam Routines | Admin | Port City International University",
};

export default function BulkExamRoutinePage() {
  return (
    <div className="w-full p-6">
      <PageHeader
        title="Bulk Add Exam Routines"
        description="Add several exam routine rows for one exam at once. Department narrows course and batch; building narrows room; batch narrows section."
        icon={CalendarCheck}
      />
      <BulkRoutineForm kind="exam" />
    </div>
  );
}
