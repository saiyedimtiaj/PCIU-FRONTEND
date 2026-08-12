"use client";

import { getEntitySchema } from "@/lib/admin/entities";
import EntityForm from "./EntityForm";

export interface EntityFormClientProps {
  slug: string;
  cancelHref?: string;
}

/**
 * Resolves an entity slug to its EntitySchema client-side and renders the
 * form. Route `page.tsx` files stay server components and pass only this
 * slug string — the zod schema + LucideIcon inside EntitySchema can't
 * cross the server/client boundary as props.
 */
export default function EntityFormClient({ slug, cancelHref }: EntityFormClientProps) {
  const schema = getEntitySchema(slug);

  if (!schema) {
    return (
      <p className="text-sm text-muted-foreground">
        No form is registered for &quot;{slug}&quot; yet.
      </p>
    );
  }

  return <EntityForm schema={schema} cancelHref={cancelHref} />;
}
