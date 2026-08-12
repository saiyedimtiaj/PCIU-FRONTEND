import { Pencil, Trash2 } from "lucide-react";
import type { EntitySchema, FieldDescriptor, FieldType } from "@/components/admin/form/form-types";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SampleRow } from "./sample-data";

// Field types that never make good table columns — long-form content,
// secrets, or structures that don't compress into a single cell.
const EXCLUDED_TYPES: readonly FieldType[] = ["textarea", "richtext", "password", "file", "json-list"];

const PRIMARY_NAME_PATTERN = /^(name|title|slug|label|heading)$/i;

// Priority order for filling the remaining (non-primary) column slots.
const TYPE_PRIORITY: readonly FieldType[] = [
  "relation",
  "enum",
  "select",
  "radio",
  "date",
  "datetime",
  "number",
  "decimal",
  "switch",
  "email",
  "tel",
  "text",
];

const HIDE_BELOW_BY_INDEX: readonly ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"];
const MAX_DATA_COLUMNS = 5;

function pickPrimaryField(fields: FieldDescriptor[]): FieldDescriptor {
  const byName = fields.find((f) => PRIMARY_NAME_PATTERN.test(f.name));
  if (byName) return byName;
  const firstText = fields.find((f) => f.type === "text");
  if (firstText) return firstText;
  return fields[0];
}

function initials(value: string): string {
  return value.trim().charAt(0).toUpperCase() || "?";
}

function PrimaryCell({ value, subtitle }: { value: string; subtitle?: string }) {
  return (
    <div>
      <p className="font-medium text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function FieldCell({ field, value }: { field: FieldDescriptor; value: unknown }) {
  switch (field.type) {
    case "switch":
    case "checkbox":
      return (
        <Badge variant={value ? "success" : "warning"}>{value ? "Active" : "Inactive"}</Badge>
      );
    case "enum":
    case "select":
    case "radio":
      return <Badge variant="secondary">{String(value ?? "—")}</Badge>;
    case "relation":
      return <span className="text-sm text-muted-foreground">{String(value ?? "—")}</span>;
    case "number":
    case "decimal":
      return <span className="text-sm tabular-nums text-foreground">{String(value ?? "—")}</span>;
    case "image":
      return (
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
          {initials(String(value || "?"))}
        </div>
      );
    case "url":
    case "email":
      return (
        <span className="block max-w-[16ch] truncate text-sm text-muted-foreground" title={String(value ?? "")}>
          {String(value ?? "—")}
        </span>
      );
    default:
      return <span className="text-sm text-foreground">{String(value ?? "—")}</span>;
  }
}

export interface DeriveColumnsActions {
  onEdit: (row: SampleRow) => void;
  onDelete: (row: SampleRow) => void;
}

/**
 * Derives a DataTable column set from an entity's field descriptors. This
 * is a heuristic, not a per-entity hand-picked layout — see
 * components/admin/list/EntityListClient.tsx for where it's consumed, and
 * the plan doc for the priority rules this encodes.
 */
export function deriveColumns(
  schema: EntitySchema,
  actions: DeriveColumnsActions
): DataTableColumn<SampleRow>[] {
  const allFields = schema.sections.flatMap((s) => s.fields);
  const eligible = allFields.filter((f) => !EXCLUDED_TYPES.includes(f.type));

  const primary = pickPrimaryField(eligible.length > 0 ? eligible : allFields);
  const remaining = eligible.filter((f) => f.name !== primary.name);

  // Secondary subtitle under the primary column: the slug field if the
  // primary isn't already the slug, else the second text field.
  const subtitleField =
    primary.name !== "slug"
      ? remaining.find((f) => f.name === "slug")
      : remaining.find((f) => f.type === "text");

  const rankOf = (f: FieldDescriptor) => {
    const idx = TYPE_PRIORITY.indexOf(f.type);
    return idx === -1 ? TYPE_PRIORITY.length : idx;
  };
  const extra = remaining
    .filter((f) => f.name !== subtitleField?.name)
    .slice()
    .sort((a, b) => rankOf(a) - rankOf(b))
    .slice(0, MAX_DATA_COLUMNS - 1);

  const columns: DataTableColumn<SampleRow>[] = [
    {
      key: primary.name,
      header: primary.label,
      sortField: primary.name,
      cell: (row) => (
        <PrimaryCell
          value={String(row[primary.name] ?? "—")}
          subtitle={subtitleField ? String(row[subtitleField.name] ?? "") : undefined}
        />
      ),
      skeletonWidth: "w-40",
    },
  ];

  extra.forEach((field, i) => {
    const hideBelow = HIDE_BELOW_BY_INDEX[i];
    columns.push({
      key: field.name,
      header: field.label,
      hideBelow,
      sortField: ["text", "date", "datetime", "number", "decimal"].includes(field.type)
        ? field.name
        : undefined,
      align: field.type === "number" || field.type === "decimal" ? "right" : "left",
      cell: (row) => <FieldCell field={field} value={row[field.name]} />,
    });
  });

  columns.push({
    key: "actions",
    header: "",
    align: "right",
    cell: (row) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => actions.onEdit(row)}
          aria-label={`Edit ${schema.title.toLowerCase()}`}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => actions.onDelete(row)}
          aria-label={`Delete ${schema.title.toLowerCase()}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  });

  return columns;
}
