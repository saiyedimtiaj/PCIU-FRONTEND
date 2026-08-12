import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Hero Slide | Admin | Port City International University",
};

export default function NewHeroSlidePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="hero-slides" cancelHref="/admin" />
    </div>
  );
}
