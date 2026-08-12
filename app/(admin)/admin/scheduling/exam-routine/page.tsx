import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Exam Routines | Admin | Port City International University",
};

export default function ExamRoutineListPage() {
  return <EntityListClient slug="exam-routine" />;
}
