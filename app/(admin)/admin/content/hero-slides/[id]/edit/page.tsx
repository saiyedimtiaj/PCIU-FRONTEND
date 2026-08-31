import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Hero Slide | Admin | Port City International University",
};

export default async function EditHeroSlidesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("hero-slides")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="hero-slides" recordId={id} cancelHref="/admin/content/hero-slides" />
    </div>
  );
}
