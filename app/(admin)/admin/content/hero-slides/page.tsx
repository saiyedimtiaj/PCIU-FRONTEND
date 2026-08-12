import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Hero Slides | Admin | Port City International University",
};

export default function HeroSlidesListPage() {
  return <EntityListClient slug="hero-slides" />;
}
