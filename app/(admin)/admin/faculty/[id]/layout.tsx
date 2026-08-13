import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import profiles from "@/content/faculty-directory/profiles.json";
import type { FacultyProfile as DirectoryProfile } from "@/types/faculty-directory";
import { buildWorkspaceProfile } from "@/components/faculty/faculty-profile-data";
import { FacultyProfileProvider } from "@/components/faculty/FacultyProfileProvider";
import FacultyWorkspaceNav from "./_ui/FacultyWorkspaceNav";

const PROFILES = profiles as DirectoryProfile[];

export const dynamicParams = false;

export function generateStaticParams() {
  return PROFILES.map((p) => ({ id: p.id }));
}


export default async function FacultyWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const directory = PROFILES.find((p) => p.id === id);
  if (!directory) notFound();

  const profile = buildWorkspaceProfile(directory);

  return (
    <FacultyProfileProvider initialProfile={profile}>

      <div className="w-full space-y-4 pt-6 px-6">
        <FacultyWorkspaceNav teacherId={id} />
      </div>
      {children}
    </FacultyProfileProvider>
  );
}
