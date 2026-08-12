import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Contacts | Admin | Port City International University",
};

export default function ContactListPage() {
  return <EntityListClient slug="contact" />;
}
