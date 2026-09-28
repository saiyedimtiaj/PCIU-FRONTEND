"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { FacultyWorkspaceProfile } from "./faculty-profile-data";


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
