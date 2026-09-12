"use client";

import { useToastManager } from "@/components/ui/toast";
import {
  useTeacherSection,
  useCreateSectionRow,
  useUpdateSectionRow,
  useDeleteSectionRow,
} from "@/features/teacher-profile";
import type { FacultySection } from "@/app/(faculty)/profile-mapping";
import SectionListView from "./SectionListView";


export default function LiveSectionList({ section }: { section: FacultySection }) {
  const toast = useToastManager();
  const { data: rows = [], isLoading, error, refetch } = useTeacherSection(section);
  const createRow = useCreateSectionRow(section);
  const updateRow = useUpdateSectionRow(section);
  const deleteRow = useDeleteSectionRow(section);

  function reportError(err: unknown) {
    toast.add({
      type: "error",
      title: "Something went wrong",
      description: err instanceof Error ? err.message : "Please try again.",
    });
  }

  return (
    <SectionListView
      section={section}
      rows={rows}
      isLoading={isLoading}
      error={error instanceof Error ? error.message : null}
      onRetry={() => refetch()}
      isSaving={createRow.isPending || updateRow.isPending}
      isDeleting={deleteRow.isPending}
      onCreate={async (values) => {
        try {
          await createRow.mutateAsync(values);
        } catch (err) {
          reportError(err);
        }
      }}
      onUpdate={async (id, values) => {
        try {
          await updateRow.mutateAsync({ id, values });
        } catch (err) {
          reportError(err);
        }
      }}
      onDelete={async (id) => {
        try {
          await deleteRow.mutateAsync(id);
        } catch (err) {
          reportError(err);
        }
      }}
    />
  );
}
