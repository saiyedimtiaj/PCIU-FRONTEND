"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyProfileAction, listSectionAction } from "@/app/(faculty)/profile-actions";
import type { FacultySection, FacultyPortalProfile, SectionRow } from "@/app/(faculty)/profile-mapping";
import { teacherProfileKeys } from "./keys";

export function useMyProfile() {
  return useQuery({
    queryKey: teacherProfileKeys.profile(),
    queryFn: async (): Promise<FacultyPortalProfile> => {
      const result = await getMyProfileAction();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useTeacherSection(section: FacultySection) {
  return useQuery({
    queryKey: teacherProfileKeys.section(section),
    queryFn: async (): Promise<SectionRow[]> => {
      const result = await listSectionAction(section);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}
