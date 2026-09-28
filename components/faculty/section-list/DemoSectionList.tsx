"use client";

import { useFacultyProfile, type RowSectionKey } from "@/components/faculty/FacultyProfileProvider";
import SectionListView, { type Row } from "./SectionListView";

/**
 * The admin's per-teacher preview workspace (/admin/faculty/[id]/*) isn't
 * wired to the live /teachers/admin/info/* endpoints (unlike /admin/people/*,
 * which is) — see AGENTS.md's Faculty portal section. This keeps that
 * workspace on FacultyProfileProvider's in-memory demo state, adapting its
 * index-addressed rows to the id-shaped interface SectionListView expects
 * by synthesising `id = String(index)`.
 */
export default function DemoSectionList({ section }: { section: RowSectionKey }) {
  const { getRows, addRow, updateRow, removeRow } = useFacultyProfile();
  const rawRows = getRows(section) as unknown as Record<string, string>[];
  const rows: Row[] = rawRows.map((row, index) => ({ id: String(index), ...row }));

  return (
    <SectionListView
      section={section}
      rows={rows}
      onCreate={(values) => {
        addRow(section, values as never);
      }}
      onUpdate={(id, values) => {
        updateRow(section, Number(id), values as never);
      }}
      onDelete={(id) => {
        removeRow(section, Number(id));
      }}
    />
  );
}
