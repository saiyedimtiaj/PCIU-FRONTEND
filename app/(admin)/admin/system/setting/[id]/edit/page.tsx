import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Setting | Admin | Port City International University",
};

export default async function EditSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("setting")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="setting" recordId={id} cancelHref="/admin/system/setting" />
    </div>
  );
}
