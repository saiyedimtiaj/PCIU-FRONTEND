import type { Metadata } from "next";
import FacultyDirectory from "./_ui/FacultyDirectory";
import profiles from "@/content/faculty-directory/profiles.json";
import type { FacultyProfile } from "@/types/faculty-directory";

export const metadata: Metadata = {
  title: "Our Faculty | Port City International University",
  description:
    "Meet the distinguished faculty members of Port City International University across all departments.",
};

export default async function FacultyPage({
  searchParams,
}: {
  searchParams: Promise<{ faculty?: string }>;
}) {
  const params = await searchParams;
  const initialFaculty = params.faculty ?? "all";

  return (
    <div className="min-h-screen bg-background">
      <FacultyDirectory
        profiles={profiles as FacultyProfile[]}
        initialFaculty={initialFaculty}
      />
    </div>
  );
}
