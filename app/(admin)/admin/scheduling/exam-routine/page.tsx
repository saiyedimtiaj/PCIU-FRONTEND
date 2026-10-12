import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Exam Routines | Admin | Port City International University",
};

export default function ExamRoutineListPage() {
  return (
    <EntityListClient
      slug="exam-routine"
      extraActions={
        <Button
          variant="outlineSecondary"
          size="admin"
          render={<Link href="/admin/scheduling/exam-routine/bulk" />}
          nativeButton={false}
        >
          <Layers className="size-4" />
          Bulk Add
        </Button>
      }
    />
  );
}
