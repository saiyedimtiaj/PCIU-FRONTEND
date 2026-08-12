import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add User | Admin | Port City International University",
};

export default function NewUserPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="user" cancelHref="/admin/people/user" />
    </div>
  );
}
