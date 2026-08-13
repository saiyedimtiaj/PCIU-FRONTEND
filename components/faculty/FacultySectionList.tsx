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
import { useFacultyProfile, type RowSectionKey } from "./FacultyProfileProvider";
import { FACULTY_SECTION_CONFIG, type SectionFieldDescriptor } from "./faculty-section-config";

export interface FacultySectionListProps {
  /** Looked up in FACULTY_SECTION_CONFIG for title/description/icon/fields —
   * callers pass only this key string (never the icon or fields directly)
   * so server page.tsx files stay plain server components; a LucideIcon
   * can't cross the server/client boundary as a prop. */
  section: RowSectionKey;
}

type Row = Record<string, string>;

function emptyRow(fields: SectionFieldDescriptor[]): Row {
  return Object.fromEntries(fields.map((f) => [f.name, ""]));
}

export default function FacultySectionList({ section }: FacultySectionListProps) {
  const { title, description, icon, itemLabel, pluralLabel, fields } = FACULTY_SECTION_CONFIG[section];
  const { getRows, addRow, updateRow, removeRow } = useFacultyProfile();
  const rows = getRows(section) as unknown as Row[];
  const primary = fields[0]?.name;

  const [query, setQuery] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Row>(emptyRow(fields));
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => Object.values(row).some((v) => v.toLowerCase().includes(q)));
  }, [rows, query]);

  // Map filtered rows back to their real index in the unfiltered array, so
  // edit/delete always act on the right row even while a search is active.
  const indexed = filtered.map((row) => ({ row, index: rows.indexOf(row) }));

  function openAdd() {
    setEditIndex(-1);
    setEditValues(emptyRow(fields));
  }

  function openEdit(index: number) {
    setEditIndex(index);
    setEditValues({ ...rows[index] });
  }

  function closeEditModal() {
    setEditIndex(null);
  }

  function saveEdit() {
    if (editIndex === null) return;
    if (editIndex === -1) {
      addRow(section, editValues as never);
      setNotice(`${itemLabel} added.`);
    } else {
      updateRow(section, editIndex, editValues as never);
      setNotice(`${itemLabel} updated.`);
    }
    setEditIndex(null);
  }

  async function confirmDelete() {
    if (deleteIndex === null) return;
    setDeleting(true);
    // Design-only: no backend to persist this against yet.
    await new Promise((resolve) => setTimeout(resolve, 500));
    removeRow(section, deleteIndex);
    setDeleting(false);
    setNotice(`${itemLabel} removed.`);
    setDeleteIndex(null);
  }

  const columns: DataTableColumn<{ row: Row; index: number }>[] = [
    ...fields
      .filter((f) => !f.multiline)
      .map((field, i): DataTableColumn<{ row: Row; index: number }> => ({
        key: field.name,
        header: field.label,
        hideBelow: i === 0 ? undefined : (["sm", "md", "lg", "xl"] as const)[Math.min(i - 1, 3)],
        cell: ({ row }) =>
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
      cell: ({ index }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(index)} aria-label={`Edit ${itemLabel.toLowerCase()}`}>
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteIndex(index)}
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
          <Button variant="highlight" size="admin" onClick={openAdd}>
            <Plus className="size-4" />
            Add {itemLabel}
          </Button>
        }
      />

      {notice && <Alert variant="success" message={notice} dismissible onDismiss={() => setNotice(null)} />}

      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${pluralLabel.toLowerCase()}...`}
          className="pl-9"
        />
      </div>

      <DataTable
        columns={columns}
        data={indexed}
        rowKey={({ index }) => index}
        entityLabel={pluralLabel.toLowerCase()}
        mobileCard={({ row, index }) => (
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
              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(index)} aria-label={`Edit ${itemLabel.toLowerCase()}`}>
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteIndex(index)}
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
        open={editIndex !== null}
        onClose={closeEditModal}
        title={editIndex === -1 ? `Add ${itemLabel}` : `Edit ${itemLabel}`}
        footer={
          <>
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button variant="highlight" onClick={saveEdit}>
              Save
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
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
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
        title={`Remove this ${itemLabel.toLowerCase()}?`}
        description="This is a design preview — no content is actually persisted or deleted yet."
        confirmLabel="Remove"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
