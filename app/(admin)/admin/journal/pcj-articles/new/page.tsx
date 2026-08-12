import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add PCJ Article | Admin | Port City International University",
};

export default function NewPCJArticlePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="pcj-articles" cancelHref="/admin/journal/pcj-articles" />
    </div>
  );
}
