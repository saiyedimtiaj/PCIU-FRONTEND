import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Setting | Admin | Port City International University",
};

export default function NewSettingPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="setting" cancelHref="/admin/system/setting" />
    </div>
  );
}
