import type { Metadata } from "next";
import PermissionsMatrix from "./_ui/PermissionsMatrix";

export const metadata: Metadata = {
  title: "Permissions | Admin | Port City International University",
};

export default function PermissionsPage() {
  return <PermissionsMatrix />;
}
