import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit User | Admin | Port City International University",
};

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("user")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="user" recordId={id} cancelHref="/admin/people/user" />
    </div>
  );
}
