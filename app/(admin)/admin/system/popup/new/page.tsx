import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Popup | Admin | Port City International University",
};

export default function NewPopupPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="popup" cancelHref="/admin/system/popup" />
    </div>
  );
}
