import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DepartmentTemplate from "./_ui/DepartmentTemplate";
import type { DepartmentContent } from "@/types/department";

import english from "@/content/departments/english.json";
import law from "@/content/departments/law.json";
import journalism from "@/content/departments/journalism.json";
import cse from "@/content/departments/cse.json";
import eee from "@/content/departments/eee.json";
import civil from "@/content/departments/civil.json";
import textile from "@/content/departments/textile.json";
import fashion from "@/content/departments/fashion.json";
import bba from "@/content/departments/bba.json";

const DEPARTMENTS: Record<string, DepartmentContent> = {
  english: english as DepartmentContent,
  law: law as DepartmentContent,
  journalism: journalism as DepartmentContent,
  cse: cse as DepartmentContent,
  eee: eee as DepartmentContent,
  civil: civil as DepartmentContent,
  textile: textile as DepartmentContent,
  fashion: fashion as DepartmentContent,
  bba: bba as DepartmentContent,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(DEPARTMENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const department = DEPARTMENTS[slug];
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
  const department = DEPARTMENTS[slug];
  if (!department) notFound();

  return <DepartmentTemplate content={department} />;
}
