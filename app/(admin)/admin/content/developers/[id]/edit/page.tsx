import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Developer | Admin | Port City International University",
};

export default async function EditDeveloperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("developers")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="developers" recordId={id} cancelHref="/admin/content/developers" />
    </div>
  );
}
