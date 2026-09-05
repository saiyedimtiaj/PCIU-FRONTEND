"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMyProfileAction,
  createSectionAction,
  updateSectionAction,
  deleteSectionAction,
} from "@/app/(faculty)/profile-actions";
import type { FacultySection, FacultyPortalProfile, SectionRow } from "@/app/(faculty)/profile-mapping";
import { teacherProfileKeys } from "./keys";

function useInvalidateSection(section: FacultySection) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: teacherProfileKeys.section(section) });
    // A new/edited/removed row changes the dashboard's per-section counts,
    // which read from the profile query — invalidate that too.
    queryClient.invalidateQueries({ queryKey: teacherProfileKeys.profile() });
  };
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      values: Partial<FacultyPortalProfile> & { image?: File },
    ): Promise<FacultyPortalProfile> => {
      const result = await updateMyProfileAction(values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherProfileKeys.profile() });
    },
  });
}

export function useCreateSectionRow(section: FacultySection) {
  const invalidate = useInvalidateSection(section);

  return useMutation({
    mutationFn: async (values: Record<string, string>): Promise<SectionRow> => {
      const result = await createSectionAction(section, values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateSectionRow(section: FacultySection) {
  const invalidate = useInvalidateSection(section);

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Record<string, string>;
    }): Promise<SectionRow> => {
      const result = await updateSectionAction(section, id, values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteSectionRow(section: FacultySection) {
  const invalidate = useInvalidateSection(section);

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await deleteSectionAction(section, id);
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
}
