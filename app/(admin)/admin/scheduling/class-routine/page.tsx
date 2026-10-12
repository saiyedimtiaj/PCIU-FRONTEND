import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Class Routines | Admin | Port City International University",
};

export default function ClassRoutineListPage() {
  return (
    <EntityListClient
      slug="class-routine"
      extraActions={
        <Button
          variant="outlineSecondary"
          size="admin"
          render={<Link href="/admin/scheduling/class-routine/bulk" />}
          nativeButton={false}
        >
          <Layers className="size-4" />
          Bulk Add
        </Button>
      }
    />
  );
}
