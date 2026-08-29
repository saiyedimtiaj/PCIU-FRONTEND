"use client";

import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";
import EntityForm from "./EntityForm";

export interface EntityFormClientProps {
  slug: string;
  cancelHref?: string;
  /** A sample row's __id (see sample-data.ts). When present the form opens
   * in edit mode, pre-filled from that row — resolved here, client-side,
   * rather than passed in as a prop, for the same reason `slug` is a
   * string: the row is regenerated from the (server-only-safe) schema, so
   * no schema/row object ever needs to cross the server/client boundary. */
  recordId?: string;
}

/**
 * Resolves an entity slug to its EntitySchema client-side and renders the
 * form. Route `page.tsx` files stay server components and pass only this
 * slug string — the zod schema + LucideIcon inside EntitySchema can't
 * cross the server/client boundary as props.
 */
export default function EntityFormClient({ slug, cancelHref, recordId }: EntityFormClientProps) {
  const schema = getEntitySchema(slug);

  if (!schema) {
    return (
      <p className="text-sm text-muted-foreground">
        No form is registered for &quot;{slug}&quot; yet.
      </p>
    );
  }

  if (!recordId) {
    return <EntityForm schema={schema} cancelHref={cancelHref} />;
  }

  const row = generateSampleRows(schema).find((r) => r.__id === recordId);
  if (!row) {
    return (
      <p className="text-sm text-muted-foreground">
        No {schema.title.toLowerCase()} was found for &quot;{recordId}&quot;.
      </p>
    );
  }

  // __id (the internal row key) rides along harmlessly here — RHF's
  // defaultValues and the zod resolver only ever read the keys the schema
  // actually declares, so there's no need to strip it back out.
  return <EntityForm schema={schema} cancelHref={cancelHref} mode="edit" initialValues={row} />;
}
