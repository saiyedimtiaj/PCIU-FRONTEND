import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import BulkRoutineForm from "@/components/admin/routine-bulk/BulkRoutineForm";

export const metadata: Metadata = {
  title: "Bulk Add Class Routines | Admin | Port City International University",
};

export default function BulkClassRoutinePage() {
  return (
    <div className="w-full p-6">
      <PageHeader
        title="Bulk Add Class Routines"
        description="Add several class routine rows at once. Department narrows course, teacher and batch; building narrows room; batch narrows section."
        icon={CalendarClock}
      />
      <BulkRoutineForm kind="class" />
    </div>
  );
}
