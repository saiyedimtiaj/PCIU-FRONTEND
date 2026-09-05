"use server";

import { publicFetch } from "@/lib/server-fetch";
import type { AcademicFaculty } from "@/types/academics";

export async function getFaculties(): Promise<AcademicFaculty[] | undefined> {
  try {
    const res = await publicFetch.get("/home/faculties", {
      next: { tags: ["faculties"] },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (error) {
    console.error("[Actions: getFaculties] Failed to fetch faculties:", error);
  }

  return undefined;
}
