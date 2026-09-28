import { getTeacherById } from "@/actions/teachers";
import { notFound } from "next/navigation";
import TeacherTemplate from "./_ui/TeacherTemplate";
import { Metadata } from "next";

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
    notFound();
  }

  return <TeacherTemplate teacher={teacher} />;
}
