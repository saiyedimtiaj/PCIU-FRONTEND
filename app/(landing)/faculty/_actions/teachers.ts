"use server";

import { publicFetch } from "@/lib/server-fetch";
import type { TeacherDetails } from "@/types/teacher";

export async function getTeacherById(
  id: string,
): Promise<TeacherDetails | null> {
  try {
    const res = await publicFetch.get(`/teachers/${id}`, {
      next: { tags: ["teacher", id], revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch teacher ${id}: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data as TeacherDetails;
  } catch (error) {
    console.error(`Error fetching teacher ${id}:`, error);
    return null;
  }
}
