"use server";

import { publicFetch } from "@/lib/server-fetch";
import type { FacultyDetail } from "@/types/academics";

export async function getFacultyDetails(
  slug: string,
): Promise<FacultyDetail | null> {
  try {
    const res = await publicFetch.get(`/faculties/slug/${slug}`, {
      next: {
        tags: ["faculties", `faculties-${slug}`],
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data as FacultyDetail;
  } catch {
    return null;
  }
}
