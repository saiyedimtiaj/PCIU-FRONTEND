"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { getEntitySchema } from "@/lib/admin/entities";
import { groupRouteSegment, pluralize } from "@/components/admin/nav-groups";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { AlertDialog, Alert } from "@/components/shared/Aleart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSampleRows, type SampleRow } from "./sample-data";
import { deriveColumns } from "./columns";

export interface EntityListClientProps {
  /** Entity slug, e.g. "teacher". Resolved to its EntitySchema client-side —
   * never pass the schema itself across the server/client boundary. */
  slug: string;
}

const PAGE_SIZE = 10;

export default function EntityListClient({ slug }: EntityListClientProps) {
  const schema = getEntitySchema(slug);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sort, setSort] = useState<{ by?: string; order: "asc" | "desc" }>({ order: "asc" });
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<SampleRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SampleRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const allFields = useMemo(() => schema?.sections.flatMap((s) => s.fields) ?? [], [schema]);
  const statusField = useMemo(
    () => allFields.find((f) => f.type === "switch" && /^(is_|status|active|published)/i.test(f.name)),
    [allFields]
  );

  const rows = useMemo(() => (schema ? generateSampleRows(schema) : []), [schema]);
  const columns = useMemo(
    () =>
      schema
        ? deriveColumns(schema, { onEdit: setEditTarget, onDelete: setDeleteTarget })
        : [],
    [schema]
  );

  const filtered = useMemo(() => {
    let result = rows;
    if (statusField && statusFilter !== "all") {
      result = result.filter((row) => Boolean(row[statusField.name]) === (statusFilter === "active"));
    }
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((row) =>
        Object.values(row).some((v) => typeof v === "string" && v.toLowerCase().includes(q))
      );
    }
    if (sort.by) {
      const field = sort.by;
      result = [...result].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av ?? "").localeCompare(String(bv ?? ""));
        return sort.order === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [rows, statusField, statusFilter, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (!schema) {
    return (
      <div className="w-full p-6">
        <p className="text-sm text-muted-foreground">No listing is registered for &quot;{slug}&quot; yet.</p>
      </div>
    );
  }

  const basePath = `/admin/${groupRouteSegment(schema.group)}/${schema.slug}`;
  const pluralTitle = schema.pluralTitle ?? pluralize(schema.title);
  const entityTitle = schema.title;

  function handleSort(field: string) {
    setSort((s) => (s.by === field ? { by: field, order: s.order === "asc" ? "desc" : "asc" } : { by: field, order: "asc" }));
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateStatusFilter(value: "all" | "active" | "inactive") {
    setStatusFilter(value);
    setPage(1);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    // Design-only: no backend to persist this against yet.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeleting(false);
    setNotice(`This ${entityTitle.toLowerCase()} would be removed here once content persistence exists.`);
    setDeleteTarget(null);
  }

  const primaryField = allFields.find((f) => /^(name|title)$/i.test(f.name)) ?? allFields[0];

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title={pluralTitle}
        description={schema.description}
        icon={schema.icon}
        actions={
          <Button variant="highlight" size="admin" render={<Link href={`${basePath}/new`} />} nativeButton={false}>
            <Plus className="size-4" />
            Add {schema.title}
          </Button>
        }
      />

      {notice && (
        <Alert variant="info" message={notice} dismissible onDismiss={() => setNotice(null)} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder={`Search ${pluralTitle.toLowerCase()}...`}
            className="pl-9"
          />
        </div>
        {statusField && (
          <Tabs
            value={statusFilter}
            onValueChange={(value) => updateStatusFilter(value as typeof statusFilter)}
            variant="pill"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active" tone="success">Active</TabsTrigger>
              <TabsTrigger value="inactive" tone="warning">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      <DataTable
        columns={columns}
        data={pageRows}
        rowKey={(row) => row.__id}
        entityLabel={pluralTitle.toLowerCase()}
        sortBy={sort.by}
        sortOrder={sort.order}
        onSort={handleSort}
        pagination={{ page: currentPage, totalPages, total: filtered.length, limit: PAGE_SIZE }}
        onPageChange={setPage}
        emptyState={
          query ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-muted-foreground">No {pluralTitle.toLowerCase()} match &quot;{query}&quot;.</p>
              <Button variant="outline" size="sm" onClick={() => updateQuery("")}>
                <X className="size-4" />
                Clear search
              </Button>
            </div>
          ) : undefined
        }
      />

      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={editTarget ? `Edit ${schema.title}` : ""}
        description="Editing is not wired up yet — this preview shows the intended layout."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => setEditTarget(null)}>Save Changes</Button>
          </>
        }
      >
        {editTarget && primaryField && (
          <p className="text-sm text-muted-foreground">
            {String(editTarget[primaryField.name] ?? "")}
          </p>
        )}
      </Modal>

      <AlertDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={`Delete this ${schema.title.toLowerCase()}?`}
        description="This is a design preview — no content is actually persisted or deleted yet."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
