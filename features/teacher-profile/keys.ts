import type { FacultySection } from "@/app/(faculty)/profile-mapping";

export const teacherProfileKeys = {
  all: ["teacher-profile"] as const,
  profile: () => [...teacherProfileKeys.all, "me"] as const,
  section: (section: FacultySection) =>
    [...teacherProfileKeys.all, "section", section] as const,
};
