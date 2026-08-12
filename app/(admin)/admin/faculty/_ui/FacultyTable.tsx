"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable";
import { AlertDialog } from "@/components/shared/Aleart";
import type { FacultyProfile } from "@/types/faculty-directory";

export default function FacultyTable({ profiles }: { profiles: FacultyProfile[] }) {
  const [deleteTarget, setDeleteTarget] = useState<FacultyProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns: DataTableColumn<FacultyProfile>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
            {row.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/g, "")[0]}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{row.name}</p>
            <p className="text-xs text-muted-foreground truncate">{row.designation}</p>
          </div>
        </div>
      ),
      skeletonWidth: "w-40",
    },
    {
      key: "faculty",
      header: "Faculty",
      cell: (row) => <span className="text-sm text-muted-foreground">{row.faculty}</span>,
      hideBelow: "lg",
    },
    {
      key: "department",
      header: "Department",
      cell: (row) => <span className="text-sm text-muted-foreground">{row.department}</span>,
      hideBelow: "sm",
    },
    {
      key: "teachingAreas",
      header: "Teaching Areas",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.teachingAreas.slice(0, 2).map((area) => (
            <Badge key={area} variant="secondary">
              {area}
            </Badge>
          ))}
        </div>
      ),
      hideBelow: "xl",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Edit faculty member">
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete faculty member"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  async function confirmDelete() {
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="highlight" size="sm">
          <Plus className="size-4" />
          Add Faculty Member
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={profiles}
        rowKey={(row) => row.id}
        entityLabel="faculty members"
        pagination={{ page: 1, totalPages: 1, total: profiles.length, limit: profiles.length }}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={`Remove "${deleteTarget?.name ?? ""}"?`}
        description="This is a design preview — no content is actually persisted or deleted yet."
        confirmLabel="Remove"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
