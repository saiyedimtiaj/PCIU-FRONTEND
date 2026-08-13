"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, X, SlidersHorizontal } from "lucide-react";
import { getEntitySchema } from "@/lib/admin/entities";
import { groupRouteSegment, pluralize } from "@/components/admin/nav-groups";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { AlertDialog, Alert } from "@/components/shared/Aleart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import type { FieldDescriptor } from "@/components/admin/form/form-types";
import { generateSampleRows, type SampleRow } from "./sample-data";
import { deriveColumns } from "./columns";

export interface EntityListClientProps {
  /** Entity slug, e.g. "teacher". Resolved to its EntitySchema client-side —
   * never pass the schema itself across the server/client boundary. */
  slug: string;
}

const PAGE_SIZE = 10;
// More than this many option-backed fields (enum/select/relation-with-options)
// and the filter bar stops rendering every one inline — the rest collapse
// behind "More filters" so a 6+ field schema doesn't produce a wall of
// dropdowns above the table.
const MAX_INLINE_OPTION_FILTERS = 2;

// Prefer a field that's unambiguously "the" status flag before falling back
// to the first loose match — otherwise entities whose first is_*/status-like
// switch isn't the semantic status field (e.g. teacher.is_study_leave,
// notices.is_home) get a filter that's mislabeled about what it does.
function pickStatusField(fields: FieldDescriptor[]): FieldDescriptor | undefined {
  const switches = fields.filter((f) => f.type === "switch");
  const exact = switches.find((f) => /^(is_active|status|active)$/i.test(f.name));
  if (exact) return exact;
  return switches.find((f) => /^(is_|status|active|published)/i.test(f.name));
}

function isOptionField(field: FieldDescriptor): boolean {
  return (
    (field.type === "enum" || field.type === "select" || field.type === "relation") &&
    !!field.options &&
    field.options.length > 0
  );
}

// base-ui's <Select.Value> only resolves a value to its label via this
// `items` list — without it, a pre-selected value (as every filter's "all"
// default is) renders as the raw value string instead of a label until the
// user manually reopens and reselects it. See FormField.tsx for the same fix
// applied to the entity form's own selects.
function selectItems(field: FieldDescriptor, allLabel: string) {
  return [{ label: allLabel, value: "all" }, ...(field.options ?? [])];
}

export default function EntityListClient({ slug }: EntityListClientProps) {
  const schema = getEntitySchema(slug);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [optionFilters, setOptionFilters] = useState<Record<string, string>>({});
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sort, setSort] = useState<{ by?: string; order: "asc" | "desc" }>({ order: "asc" });
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<SampleRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const allFields = useMemo(() => schema?.sections.flatMap((s) => s.fields) ?? [], [schema]);
  const statusField = useMemo(() => pickStatusField(allFields), [allFields]);
  const optionFields = useMemo(() => allFields.filter(isOptionField), [allFields]);
  const dateField = useMemo(() => allFields.find((f) => f.type === "date"), [allFields]);

  const visibleOptionFields = optionFields.slice(0, MAX_INLINE_OPTION_FILTERS);
  const hiddenOptionFields = optionFields.slice(MAX_INLINE_OPTION_FILTERS);
  const hasMoreFilters = hiddenOptionFields.length > 0 || !!dateField;

  const rows = useMemo(() => (schema ? generateSampleRows(schema) : []), [schema]);
  const columns = useMemo(
    () => (schema ? deriveColumns(schema, { onDelete: setDeleteTarget }) : []),
    [schema]
  );

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    Object.values(optionFilters).filter((v) => v && v !== "all").length +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const filtered = useMemo(() => {
    let result = rows;
    if (statusField && statusFilter !== "all") {
      result = result.filter((row) => Boolean(row[statusField.name]) === (statusFilter === "active"));
    }
    for (const field of optionFields) {
      const want = optionFilters[field.name];
      if (want && want !== "all") {
        result = result.filter((row) => row[field.name] === want);
      }
    }
    if (dateField && (dateFrom || dateTo)) {
      result = result.filter((row) => {
        const value = row[dateField.name];
        if (typeof value !== "string") return false;
        if (dateFrom && value < dateFrom) return false;
        if (dateTo && value > dateTo) return false;
        return true;
      });
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
  }, [rows, statusField, statusFilter, optionFields, optionFilters, dateField, dateFrom, dateTo, query, sort]);

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

  function updateOptionFilter(fieldName: string, value: string) {
    setOptionFilters((prev) => ({ ...prev, [fieldName]: value }));
    setPage(1);
  }

  function clearAllFilters() {
    setQuery("");
    setStatusFilter("all");
    setOptionFilters({});
    setDateFrom("");
    setDateTo("");
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

  const hasAnyFilter = activeFilterCount > 0 || query.trim().length > 0;

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

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder={`Search ${pluralTitle.toLowerCase()}...`}
              className="pl-9"
            />
          </div>

          {visibleOptionFields.map((field) => (
            <Select
              key={field.name}
              items={selectItems(field, `All ${field.label}`)}
              value={optionFilters[field.name] ?? "all"}
              onValueChange={(value) => updateOptionFilter(field.name, value ?? "all")}
            >
              <SelectTrigger className="w-auto min-w-40">
                <SelectValue placeholder={field.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {field.label}</SelectItem>
                {field.options!.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {hasMoreFilters && (
            <Button
              type="button"
              variant="outline"
              size="admin"
              onClick={() => setShowMoreFilters((v) => !v)}
              aria-pressed={showMoreFilters}
            >
              <SlidersHorizontal className="size-4" />
              More filters
            </Button>
          )}

          {hasAnyFilter && (
            <Button type="button" variant="ghost" size="admin" onClick={clearAllFilters}>
              <X className="size-4" />
              Clear all
            </Button>
          )}

          {statusField && (
            <Tabs
              value={statusFilter}
              onValueChange={(value) => updateStatusFilter(value as typeof statusFilter)}
              variant="pill"
              className="ml-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active" tone="success">Active</TabsTrigger>
                <TabsTrigger value="inactive" tone="warning">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {showMoreFilters && hasMoreFilters && (
          <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/20 p-3">
            {hiddenOptionFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label className="text-xs">{field.label}</Label>
                <Select
                  items={selectItems(field, `All ${field.label}`)}
                  value={optionFilters[field.name] ?? "all"}
                  onValueChange={(value) => updateOptionFilter(field.name, value ?? "all")}
                >
                  <SelectTrigger className="w-auto min-w-40">
                    <SelectValue placeholder={field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {field.label}</SelectItem>
                    {field.options!.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {dateField && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="date-from" className="text-xs">
                    {dateField.label} from
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setPage(1);
                    }}
                    className="w-auto"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date-to" className="text-xs">
                    {dateField.label} to
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setPage(1);
                    }}
                    className="w-auto"
                  />
                </div>
              </>
            )}
          </div>
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
          hasAnyFilter ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No {pluralTitle.toLowerCase()} match the current filters.
              </p>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="size-4" />
                Clear all filters
              </Button>
            </div>
          ) : undefined
        }
      />

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
