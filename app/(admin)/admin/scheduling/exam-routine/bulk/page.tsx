import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import RequirePermission from "@/components/admin/RequirePermission";
import BulkRoutineForm from "@/components/admin/routine-bulk/BulkRoutineForm";

export const metadata: Metadata = {
  title: "Bulk Add Exam Routines | Admin | Port City International University",
};

export default function BulkExamRoutinePage() {
  return (
    <div className="w-full px-4 pt-6">
      <PageHeader
        title="Bulk Add Exam Routines"
        description="Add several exam routine rows for one exam at once. Department narrows course and batch; building narrows room; batch narrows section."
        icon={CalendarCheck}
      />
      <RequirePermission slug="exam-routine" action="create" label="exam routines">
        <BulkRoutineForm kind="exam" />
      </RequirePermission>
    </div>
  );
}
