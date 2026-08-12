import type { Metadata } from "next";
import FacultyTable from "./_ui/FacultyTable";
import profiles from "@/content/faculty-directory/profiles.json";
import type { FacultyProfile } from "@/types/faculty-directory";

export const metadata: Metadata = {
  title: "Faculty | Admin | Port City International University",
};

export default function AdminFacultyPage() {
  return (
    <div className="w-full p-6 space-y-6">
      <p className="text-sm text-muted-foreground">Manage the public faculty directory.</p>
      <FacultyTable profiles={profiles as FacultyProfile[]} />
    </div>
  );
}
