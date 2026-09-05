import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Menu Item | Admin | Port City International University",
};

export default async function EditMenusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("menus")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="menus" recordId={id} cancelHref="/admin/content/menus" />
    </div>
  );
}
