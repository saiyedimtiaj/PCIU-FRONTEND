import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Popup | Admin | Port City International University",
};

export default function PopupPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="popup" recordId="1" cancelHref="/admin" />
    </div>
  );
}
