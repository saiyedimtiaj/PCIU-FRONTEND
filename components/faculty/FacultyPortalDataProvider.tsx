"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMyProfile } from "@/features/teacher-profile";
import type { FacultyPortalProfile } from "@/app/(faculty)/profile-mapping";

/**
 * Live replacement for FacultyProfileProvider on the teacher-facing portal
 * (`/faculty-portal/*`). Unlike that provider, this holds no local state of
 * its own — TanStack Query's cache is the single source of truth, and
 * mutations (in FacultyProfileForm, and the section-list live path) simply
 * invalidate the query rather than writing through a context setter. This
 * is what lets FacultySectionList move from index-addressed rows to
 * id-addressed ones: each section owns its own query/mutation lifecycle
 * instead of sharing one big in-memory profile object.
 */
export interface FacultyPortalDataValue {
  profile: FacultyPortalProfile | undefined;
  isLoading: boolean;
  error: string | null;
  /** The signed-in user's name, always available even before the profile
   * query resolves — used for the sidebar identity block. */
  displayName: string;
}

const FacultyPortalDataContext = createContext<FacultyPortalDataValue | null>(null);

export function FacultyPortalDataProvider({
  fallbackName,
  children,
}: {
  fallbackName: string;
  children: ReactNode;
}) {
  const { data, isLoading, error } = useMyProfile();

  const value: FacultyPortalDataValue = {
    profile: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    displayName: data?.name || fallbackName,
  };

  return (
    <FacultyPortalDataContext.Provider value={value}>{children}</FacultyPortalDataContext.Provider>
  );
}

export function useFacultyPortalData(): FacultyPortalDataValue {
  const ctx = useContext(FacultyPortalDataContext);
  if (!ctx) {
    throw new Error("useFacultyPortalData must be used within a FacultyPortalDataProvider");
  }
  return ctx;
}
