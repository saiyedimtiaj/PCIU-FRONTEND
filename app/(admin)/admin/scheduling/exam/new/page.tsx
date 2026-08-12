import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Exam | Admin | Port City International University",
};

export default function NewExamPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="exam" cancelHref="/admin/scheduling/exam" />
    </div>
  );
}
