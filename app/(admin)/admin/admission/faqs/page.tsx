import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "FAQs | Admin | Port City International University",
};

export default function FaqsListPage() {
  return <EntityListClient slug="faqs" />;
}
