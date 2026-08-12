import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Class Routines | Admin | Port City International University",
};

export default function ClassRoutineListPage() {
  return <EntityListClient slug="class-routine" />;
}
