"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { FacultyWorkspaceProfile } from "./faculty-profile-data";

// Array-valued sections of the profile that behave as repeatable rows
// (Add/Edit/Delete via FacultySectionList). "conferences" is normalized to
// {name: string}[] at this boundary even though FacultyWorkspaceProfile
// stores it as string[] — every other section is already an array of
// objects, and giving conferences the same {name} shape lets one generic
// list component serve all six sections without a special case.
export type RowSectionKey = "education" | "publications" | "experience" | "awards" | "memberships" | "conferences";

type RowOf<K extends RowSectionKey> = K extends "conferences"
  ? { name: string }
  : FacultyWorkspaceProfile[K][number];

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
 * Holds the faculty profile being edited across the portal's separate
 * routes (Dashboard, My Profile, Education, Publications, ...) — form state
 * can no longer live in one page component once each section is its own
 * page, so this context is the shared in-memory store both the admin
 * per-teacher workspace and the faculty portal mount around their routes.
 * Design-only: nothing here writes to a backend, it just keeps edits alive
 * while navigating between sections in the same session.
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
      if (section === "conferences") {
        return profile.conferences.map((name) => ({ name })) as RowOf<K>[];
      }
      return profile[section] as unknown as RowOf<K>[];
    },
    [profile]
  );

  const addRow = useCallback(<K extends RowSectionKey>(section: K, row: RowOf<K>) => {
    setProfile((prev) => {
      if (section === "conferences") {
        return { ...prev, conferences: [...prev.conferences, (row as { name: string }).name] };
      }
      const list = prev[section] as unknown[];
      return { ...prev, [section]: [...list, row] };
    });
  }, []);

  const updateRow = useCallback(<K extends RowSectionKey>(section: K, index: number, row: RowOf<K>) => {
    setProfile((prev) => {
      if (section === "conferences") {
        const next = [...prev.conferences];
        next[index] = (row as { name: string }).name;
        return { ...prev, conferences: next };
      }
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
