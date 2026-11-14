import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Developer | Admin | Port City International University",
};

export default function NewDeveloperPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="developers" cancelHref="/admin/content/developers" />
    </div>
  );
}
