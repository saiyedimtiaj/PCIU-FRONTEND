"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { FacultyWorkspaceProfile } from "./faculty-profile-data";

// Array-valued sections of the profile that behave as repeatable rows
// (Add/Edit/Delete via FacultySectionList). Every section is an array of
// objects.
export type RowSectionKey = "education" | "publications" | "experience" | "awards" | "memberships";

type RowOf<K extends RowSectionKey> = FacultyWorkspaceProfile[K][number];

export interface FacultyProfileContextValue {
  profile: FacultyWorkspaceProfile;
  /** Patch top-level scalar fields (name, email, bio, social links, ...). */
  updateProfile: (patch: Partial<FacultyWorkspaceProfile>) => void;
  getRows: <K extends RowSectionKey>(section: K) => RowOf<K>[];
  addRow: <K extends RowSectionKey>(section: K, row: RowOf<K>) => void;
  updateRow: <K extends RowSectionKey>(section: K, index: number, row: RowOf<K>) => void;
  removeRow: (section: RowSectionKey, index: number) => void;
}

const FacultyProfileContext = createContext<FacultyProfileContextValue | null>(null);

/**
 * Holds the faculty profile being edited across the admin's per-teacher
 * preview workspace (`/admin/faculty/[id]/*`) — an in-memory, non-persisted
 * store, since that workspace has no admin-side API to write these
 * sub-resources against (the live endpoints are session-scoped to "the
 * signed-in teacher", not addressable by an admin for an arbitrary
 * teacher id).
 *
 * The teacher-facing portal (`/faculty-portal/*`) does NOT use this
 * provider for row data any more — FacultySectionList reads/writes
 * through features/teacher-profile's query hooks instead, which are
 * backed by the real API and address rows by id rather than array
 * position. This provider still supplies FacultyShell with a `profile`
 * for the sidebar identity block on both mount points (see
 * FacultyPortalDataProvider for how the live path adapts that).
 */
export function FacultyProfileProvider({
  initialProfile,
  children,
}: {
  initialProfile: FacultyWorkspaceProfile;
  children: ReactNode;
}) {
  const [profile, setProfile] = useState(initialProfile);

  const updateProfile = useCallback((patch: Partial<FacultyWorkspaceProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const getRows = useCallback(
    <K extends RowSectionKey>(section: K): RowOf<K>[] => {
      return profile[section] as unknown as RowOf<K>[];
    },
    [profile]
  );

  const addRow = useCallback(<K extends RowSectionKey>(section: K, row: RowOf<K>) => {
    setProfile((prev) => {
      const list = prev[section] as unknown[];
      return { ...prev, [section]: [...list, row] };
    });
  }, []);

  const updateRow = useCallback(<K extends RowSectionKey>(section: K, index: number, row: RowOf<K>) => {
    setProfile((prev) => {
      const list = [...(prev[section] as unknown[])];
      list[index] = row;
      return { ...prev, [section]: list };
    });
  }, []);

  const removeRow = useCallback((section: RowSectionKey, index: number) => {
    setProfile((prev) => {
      const list = (prev[section] as unknown[]).filter((_, i) => i !== index);
      return { ...prev, [section]: list };
    });
  }, []);

  const value = useMemo(
    () => ({ profile, updateProfile, getRows, addRow, updateRow, removeRow }),
    [profile, updateProfile, getRows, addRow, updateRow, removeRow]
  );

  return <FacultyProfileContext.Provider value={value}>{children}</FacultyProfileContext.Provider>;
}

export function useFacultyProfile() {
  const ctx = useContext(FacultyProfileContext);
  if (!ctx) {
    throw new Error("useFacultyProfile must be used within a FacultyProfileProvider");
  }
  return ctx;
}
