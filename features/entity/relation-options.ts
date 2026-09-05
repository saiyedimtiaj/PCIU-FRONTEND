"use client";

import { useMemo } from "react";
import { isConnected } from "@/services/endpoints";
import type { FieldOption } from "@/components/admin/form/form-types";
import { useEntityList } from "./queries";

/**
 * Live label for a related row. Falls back through the fields most entities
 * actually use for their display name; `time-slot` has neither, so its
 * start/end time is composed instead.
 */
function rowLabel(row: Record<string, unknown>): string | null {
  const name = row.name ?? row.title ?? row.designation;
  if (typeof name === "string" && name) return name;

  const { start_time, end_time } = row as { start_time?: unknown; end_time?: unknown };
  if (typeof start_time === "string" && typeof end_time === "string") {
    return `${start_time} – ${end_time}`;
  }

  return null;
}

/**
 * Live options for a `relation` field's dropdown, replacing the hardcoded
 * placeholder list that shipped before any of these entities had a real
 * backend. `relationTo` names a registered entity slug (e.g. "department");
 * unconnected slugs (still on sample data) or ones missing a schema fall
 * back to the field's own `options`, unchanged.
 */
export function useRelationOptions(
  relationTo: string | undefined,
  fallback: FieldOption[] | undefined,
): { options: FieldOption[]; isLoading: boolean } {
  const live = !!relationTo && isConnected(relationTo);

  const { data, isLoading } = useEntityList(relationTo ?? "", undefined, {
    enabled: live,
  });

  const options = useMemo<FieldOption[]>(() => {
    if (!live) return fallback ?? [];
    return (data ?? [])
      .map((row) => {
        const label = rowLabel(row);
        return label ? { label, value: String(row.id ?? row.__id) } : null;
      })
      .filter((o): o is FieldOption => o !== null);
  }, [live, data, fallback]);

  return { options, isLoading: live && isLoading };
}
