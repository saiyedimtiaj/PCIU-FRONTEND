import type { Metadata } from "next";
import PagesTable from "./_ui/PagesTable";

export const metadata: Metadata = {
  title: "Pages | Admin | Port City International University",
};

export default function AdminPagesPage() {
  return (
    <div className="w-full p-6 space-y-6">
      <p className="text-sm text-muted-foreground">All public pages and their content sections.</p>
      <PagesTable />
    </div>
  );
}
