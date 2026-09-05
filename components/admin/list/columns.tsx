import Link from "next/link";
import { Pencil, Trash2, UserX } from "lucide-react";
import type { EntitySchema, FieldDescriptor, FieldType } from "@/components/admin/form/form-types";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { groupRouteSegment } from "@/components/admin/nav-groups";
import { formatSampleDate, formatTimeOfDay, type SampleRow } from "./sample-data";

const EXCLUDED_TYPES: readonly FieldType[] = ["textarea", "richtext", "password", "file", "json-list"];

const PRIMARY_NAME_PATTERN = /^(name|title|slug|label|heading)$/i;

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
      {subtitle && (
        <p className="max-w-xs truncate text-xs text-muted-foreground" title={subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function optionLabel(field: FieldDescriptor, value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  // Relation/enum ids come back from the API as numbers while `options`
  // values are always strings, so a strict === never matched and every
  // such cell fell through to the raw value.
  const key = String(value);
  const match = field.options?.find((o) => o.value === key);
  return match?.label ?? key;
}

/**
 * Relation fields (`faculty_id`, `chairman_id`, ...) ship a hand-authored
 * `options` list as a placeholder — there's no admin UI to manage every
 * related table, and those ids drift out of sync with the real database
 * (e.g. faculty id 1 in the placeholder list vs. id 4 for the same faculty
 * once real rows exist). The API itself already resolves the relation and
 * includes it as a sibling key on the row — `faculty_id` pairs with a
 * `faculty` object, `teacher_id` with `teacher`, etc. — so that's tried
 * first and is always accurate; the placeholder list is only a fallback
 * for rows the join hasn't populated (or for design-only sample data).
 */
function joinedName(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;
  const label = obj.name ?? obj.title ?? obj.designation;
  return typeof label === "string" && label ? label : undefined;
}

function relationLabel(field: FieldDescriptor, row: SampleRow): string {
  const joinedKey = field.name.replace(/_id$/, "");

  const direct = joinedName(row[joinedKey]);
  if (direct) return direct;

  // Some rows only reach the related row through another join — a teacher
  // has no top-level `faculty`, it hangs off `department.faculty`. Checking
  // one level in keeps the column accurate without teaching the table about
  // any specific entity.
  for (const value of Object.values(row)) {
    if (!value || typeof value !== "object") continue;
    const nested = joinedName((value as Record<string, unknown>)[joinedKey]);
    if (nested) return nested;
  }

  return optionLabel(field, row[field.name]);
}

function FieldCell({ field, value, row }: { field: FieldDescriptor; value: unknown; row: SampleRow }) {
  switch (field.type) {
    case "switch":
    case "checkbox":
      return (
        <Badge variant={value ? "success" : "warning"}>{value ? "Active" : "Inactive"}</Badge>
      );
    case "enum":
    case "select":
    case "radio":
      return <Badge variant="secondary">{optionLabel(field, value)}</Badge>;
    case "relation":
      return <span className="text-sm text-muted-foreground">{relationLabel(field, row)}</span>;
    case "date":
    case "datetime":
      return (
        <span className="text-sm tabular-nums text-foreground">
          {typeof value === "string" && value ? formatSampleDate(value) : "—"}
        </span>
      );
    case "time":
      return (
        <span className="text-sm tabular-nums text-foreground">
          {typeof value === "string" && value ? formatTimeOfDay(value) : "—"}
        </span>
      );
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
  onDelete: (row: SampleRow) => void;
  /** Hidden when the resource exposes no DELETE route (e.g. teachers). */
  canDelete?: boolean;
  /**
   * When set (see `EndpointConfig.deactivateField`), the row action is a
   * "deactivate" icon instead of delete — still calls `onDelete`, which
   * the caller wires to a PATCH instead of a DELETE for these resources.
   */
  deactivateMode?: boolean;
}

export function deriveColumns(
  schema: EntitySchema,
  actions: DeriveColumnsActions
): DataTableColumn<SampleRow>[] {
  const allFields = schema.sections.flatMap((s) => s.fields);
  const eligible = allFields.filter((f) => !EXCLUDED_TYPES.includes(f.type));

  const primary = pickPrimaryField(eligible.length > 0 ? eligible : allFields);
  const remaining = eligible.filter((f) => f.name !== primary.name);

  // A slug reads naturally as the subtitle under a name/title. When there
  // isn't one, fall back to the entity's own long-text field (a textarea/
  // richtext "value" or "description") rather than dropping it from the
  // table entirely — those are excluded from the general column list
  // because a full paragraph doesn't fit a column, but a single truncated
  // line under the primary field does.
  const longTextField = allFields.find((f) => f.type === "textarea" || f.type === "richtext");
  const subtitleField =
    primary.name !== "slug"
      ? (remaining.find((f) => f.name === "slug") ?? longTextField)
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
      cell: (row) => <FieldCell field={field} value={row[field.name]} row={row} />,
    });
  });

  const basePath = `/admin/${groupRouteSegment(schema.group)}/${schema.slug}`;

  columns.push({
    key: "actions",
    header: "",
    align: "right",
    cell: (row) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={`${basePath}/${row.__id}/edit`} />}
          nativeButton={false}
          aria-label={`Edit ${schema.title.toLowerCase()}`}
        >
          <Pencil className="size-4" />
        </Button>
        {actions.deactivateMode ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-warning-foreground hover:bg-warning-light"
            onClick={() => actions.onDelete(row)}
            aria-label={`Deactivate ${schema.title.toLowerCase()}`}
          >
            <UserX className="size-4" />
          </Button>
        ) : (
          actions.canDelete !== false && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => actions.onDelete(row)}
              aria-label={`Delete ${schema.title.toLowerCase()}`}
            >
              <Trash2 className="size-4" />
            </Button>
          )
        )}
      </div>
    ),
  });

  return columns;
}
