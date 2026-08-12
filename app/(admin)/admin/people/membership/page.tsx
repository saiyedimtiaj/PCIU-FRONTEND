import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Membership Entries | Admin | Port City International University",
};

export default function MembershipListPage() {
  return <EntityListClient slug="membership" />;
}
