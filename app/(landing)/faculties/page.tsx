import { redirect } from "next/navigation";
import { getFaculties } from "@/app/(landing)/department/_actions/faculties";

export default async function FacultiesIndexPage() {
  const faculties = await getFaculties();
  const firstSlug =
    faculties?.[0]?.slug || "faculty-of-science-and-engineering";
  redirect(`/faculties/${firstSlug}`);
}
