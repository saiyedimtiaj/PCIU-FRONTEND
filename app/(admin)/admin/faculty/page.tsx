import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/admin/PageHeader";
import FacultyTable from "./_ui/FacultyTable";
import profiles from "@/content/faculty-directory/profiles.json";
import type { FacultyProfile } from "@/types/faculty-directory";

export const metadata: Metadata = {
  title: "Faculty | Admin | Port City International University",
};

export default function AdminFacultyPage() {
  return (
    <div className="w-full p-6 space-y-6">
      <PageHeader
        title="Faculty Directory"
        description="Manage the public faculty directory. Click a name to open their full profile workspace."
        icon={GraduationCap}
        actions={
          <Button variant="highlight" size="admin" render={<Link href="/admin/people/teacher/new" />} nativeButton={false}>
            <Plus className="size-4" />
            Add Faculty Member
          </Button>
        }
      />
      <FacultyTable profiles={profiles as FacultyProfile[]} />
    </div>
  );
}
