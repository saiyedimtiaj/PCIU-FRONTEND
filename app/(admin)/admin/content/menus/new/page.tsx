import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Menu Item | Admin | Port City International University",
};

export default function NewMenuItemPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="menus" cancelHref="/admin/content/menus" />
    </div>
  );
}
