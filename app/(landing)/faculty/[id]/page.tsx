import { getTeacherById } from "@/app/(landing)/faculty/_actions/teachers";
import TeacherTemplate from "./_ui/TeacherTemplate";
import { Metadata } from "next";
import EmptyState from "@/components/shared/EmptyState";

// No profiles are built ahead of time; each one is rendered on its first
// visit and then served from cache (refreshed every 60s by the teacher fetch).
export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const teacher = await getTeacherById(id);

  if (!teacher) {
    return { title: "Faculty Not Found" };
  }

  return {
    title: `${teacher.name} - ${teacher.department.name} | PCIU`,
    description: teacher.shortBio || teacher.designation,
  };
}

export default async function FacultyDetailsPage({ params }: Props) {
  const { id } = await params;
  const teacher = await getTeacherById(id);

  if (!teacher) {
    return (
      <EmptyState
        title="No teacher found!"
        description="The teacher you are looking for does not exist or has been removed."
      />
    );
  }

  return <TeacherTemplate teacher={teacher} />;
}
