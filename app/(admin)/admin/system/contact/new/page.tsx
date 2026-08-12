import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Contact | Admin | Port City International University",
};

export default function NewContactPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="contact" cancelHref="/admin/system/contact" />
    </div>
  );
}
