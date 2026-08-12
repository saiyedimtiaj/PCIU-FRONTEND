import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Users | Admin | Port City International University",
};

export default function UserListPage() {
  return <EntityListClient slug="user" />;
}
