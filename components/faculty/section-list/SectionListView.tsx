"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { AlertDialog, Alert } from "@/components/shared/Aleart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { RowSectionKey } from "@/components/faculty/FacultyProfileProvider";
import { FACULTY_SECTION_CONFIG, type SectionFieldDescriptor } from "@/components/faculty/faculty-section-config";

/** A row always carries a stable string `id` — every other value is a
 * plain string, matching how the modal form already works. Row identity
 * moved from array index (fragile once a search filter is active, and
 * meaningless once a section is backed by a real API) to this id. */
export type Row = { id: string } & Record<string, string>;

function emptyRow(fields: SectionFieldDescriptor[]): Row {
  return { id: "new", ...Object.fromEntries(fields.map((f) => [f.name, ""])) };
}

export interface SectionListViewProps {
  section: RowSectionKey;
  rows: Row[];
  isLoading?: boolean;
  /** Error message from the data source, or null when there is none. */
  error?: string | null;
  onRetry?: () => void;
  onCreate: (values: Record<string, string>) => Promise<void> | void;
  onUpdate: (id: string, values: Record<string, string>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  isSaving?: boolean;
  isDeleting?: boolean;
}


export default function SectionListView({
  section,
  rows,
  isLoading = false,
  error = null,
  onRetry,
  onCreate,
  onUpdate,
  onDelete,
  isSaving = false,
  isDeleting = false,
}: SectionListViewProps) {
  const { title, description, icon, itemLabel, pluralLabel, fields } = FACULTY_SECTION_CONFIG[section];
  const primary = fields[0]?.name;

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Row>(emptyRow(fields));
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      Object.entries(row).some(([key, v]) => key !== "id" && v.toLowerCase().includes(q))
    );
  }, [rows, query]);

  function openAdd() {
    setEditingId("new");
    setEditValues(emptyRow(fields));
  }

  function openEdit(row: Row) {
    setEditingId(row.id);
    setEditValues({ ...row });
  }

  function closeEditModal() {
    setEditingId(null);
  }

  async function saveEdit() {
    if (editingId === null) return;
    const { id: _id, ...values } = editValues;
    void _id;
    if (editingId === "new") {
      await onCreate(values);
      setNotice(`${itemLabel} added.`);
    } else {
      await onUpdate(editingId, values);
      setNotice(`${itemLabel} updated.`);
    }
    setEditingId(null);
  }

  async function confirmDelete() {
    if (deletingId === null) return;
    await onDelete(deletingId);
    setNotice(`${itemLabel} removed.`);
    setDeletingId(null);
  }

  const columns: DataTableColumn<Row>[] = [
    ...fields
      .filter((f) => !f.multiline)
      .map((field, i): DataTableColumn<Row> => ({
        key: field.name,
        header: field.label,
        hideBelow: i === 0 ? undefined : (["sm", "md", "lg", "xl"] as const)[Math.min(i - 1, 3)],
        cell: (row) =>
          field.name === primary ? (
            <p className="font-medium text-foreground">{row[field.name] || "—"}</p>
          ) : (
            <span className="text-sm text-muted-foreground">{row[field.name] || "—"}</span>
          ),
      })),
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)} aria-label={`Edit ${itemLabel.toLowerCase()}`}>
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeletingId(row.id)}
            aria-label={`Delete ${itemLabel.toLowerCase()}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={title}
        description={description}
        icon={icon}
        actions={
          <Button variant="highlight" size="admin" onClick={openAdd} disabled={isLoading}>
            <Plus className="size-4" />
            Add {itemLabel}
          </Button>
        }
      />

      {error && (
        <Alert
          variant="error"
          message={error}
          action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
        />
      )}

      {notice && <Alert variant="success" message={notice} dismissible onDismiss={() => setNotice(null)} />}

      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${pluralLabel.toLowerCase()}...`}
          className="pl-9"
          disabled={isLoading}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        skeletonRows={4}
        entityLabel={pluralLabel.toLowerCase()}
        mobileCard={(row) => (
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{row[primary] || "—"}</p>
              {fields.slice(1).map((f) =>
                row[f.name] ? (
                  <p key={f.name} className="text-xs text-muted-foreground truncate">
                    {f.label}: {row[f.name]}
                  </p>
                ) : null
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)} aria-label={`Edit ${itemLabel.toLowerCase()}`}>
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setDeletingId(row.id)}
                aria-label={`Delete ${itemLabel.toLowerCase()}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        )}
        emptyState={
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {query ? `No ${pluralLabel.toLowerCase()} match "${query}".` : `No ${pluralLabel.toLowerCase()} added yet.`}
            </p>
            {query ? (
              <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                <X className="size-4" />
                Clear search
              </Button>
            ) : (
              <Button variant="highlight" size="admin" onClick={openAdd}>
                <Plus className="size-4" />
                Add {itemLabel}
              </Button>
            )}
          </div>
        }
      />

      <Modal
        open={editingId !== null}
        onClose={closeEditModal}
        title={editingId === "new" ? `Add ${itemLabel}` : `Edit ${itemLabel}`}
        loading={isSaving}
        footer={
          <>
            <Button variant="outline" onClick={closeEditModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="highlight" onClick={saveEdit} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 p-1.5">
          {fields.map((field) => (
            <div key={field.name} className={field.colSpan === 2 ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  id={field.name}
                  value={editValues[field.name] ?? ""}
                  onChange={(e) => setEditValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <Input
                  id={field.name}
                  value={editValues[field.name] ?? ""}
                  onChange={(e) => setEditValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      </Modal>

      <AlertDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title={`Remove this ${itemLabel.toLowerCase()}?`}
        description={`This will permanently remove this ${itemLabel.toLowerCase()} from your public profile.`}
        confirmLabel="Remove"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
