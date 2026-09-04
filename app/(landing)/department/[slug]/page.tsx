import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DepartmentTemplate from "./_ui/DepartmentTemplate";
import { getDepartmentBySlug } from "@/actions/departments";
import { getFaculties } from "@/actions/faculties";

export const dynamicParams = true;

export async function generateStaticParams() {
  const faculties = await getFaculties();
  if (!faculties) return [];
  
  const slugs: { slug: string }[] = [];
  faculties.forEach((f) => {
    f.departments.forEach((d) => {
      slugs.push({ slug: d.slug });
    });
  });

  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);
  
  if (!department) return {};
  
  return {
    title: `${department.hero.title} | Port City International University`,
    description: department.hero.subtitle,
  };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);
  
  if (!department) notFound();

  return <DepartmentTemplate content={department} />;
}
