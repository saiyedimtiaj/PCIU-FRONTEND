"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";
import { isConnected, getEndpoint } from "@/services/endpoints";
import { useEntityById } from "@/features/entity";
import { Alert } from "@/components/shared/Aleart";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import EntityForm from "./EntityForm";
import FormSkeleton from "./FormSkeleton";

export interface EntityFormClientProps {
  slug: string;
  cancelHref?: string;
  recordId?: string;
}

export default function EntityFormClient({ slug, cancelHref, recordId }: EntityFormClientProps) {
  const schema = getEntitySchema(slug);
  const connected = isConnected(slug);

  const {
    data: record,
    isLoading,
    isError,
    error,
  } = useEntityById(slug, recordId, { enabled: connected && !!recordId });

  if (!schema) {
    return (
      <EmptyState
        variant="icon"
        icon={<FileQuestion className="size-6" />}
        title="Form not available"
        description={`No form is registered for "${slug}" yet.`}
      />
    );
  }

  if (!recordId) {
    const createOverwrites = getEndpoint(slug)?.createOverwrites;
    return (
      <div className="space-y-4">
        {createOverwrites && (
          <Alert
            variant="warning"
            message={`${schema.title} only ever keeps one record. Saving this replaces the existing one — it does not add a second.`}
          />
        )}
        <EntityForm schema={schema} cancelHref={cancelHref} />
      </div>
    );
  }

  const notFound = (
    <EmptyState
      title={`This ${schema.title.toLowerCase()} doesn't exist`}
      description={`Nothing was found for "${recordId}". It may have been deleted.`}
      action={
        cancelHref ? (
          <Button variant="outline" size="admin" render={<Link href={cancelHref} />} nativeButton={false}>
            Back to list
          </Button>
        ) : undefined
      }
    />
  );

  if (!connected) {
    const row = generateSampleRows(schema).find((r) => r.__id === recordId);
    if (!row) return notFound;

    return (
      <div className="space-y-4">
        <Alert
          variant="info"
          message={`${schema.title} isn't connected to the backend yet — changes here won't be saved.`}
        />
        <EntityForm schema={schema} cancelHref={cancelHref} mode="edit" initialValues={row} />
      </div>
    );
  }

  if (isLoading) return <FormSkeleton schema={schema} />;

  if (isError) {
    return (
      <Alert
        variant="error"
        message={
          error instanceof Error
            ? `Could not load this ${schema.title.toLowerCase()}: ${error.message}`
            : `Could not load this ${schema.title.toLowerCase()}.`
        }
      />
    );
  }

  if (!record) return notFound;

  return (
    <EntityForm
      schema={schema}
      cancelHref={cancelHref}
      mode="edit"
      recordId={recordId}
      initialValues={record}
    />
  );
}
