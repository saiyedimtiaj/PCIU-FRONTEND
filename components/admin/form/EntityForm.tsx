"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToastManager } from "@/components/ui/toast";
import PageHeader from "@/components/admin/PageHeader";
import { FormField } from "./FormField";
import { FieldArrayInput, LinkListInput } from "./FieldArray";
import type { EntitySchema } from "./form-types";
import { isConnected } from "@/services/endpoints";
import { useCreateEntity, useUpdateEntity } from "@/features/entity";
import { cn } from "@/lib/utils";

export interface EntityFormProps {
  schema: EntitySchema;
  cancelHref?: string;
  mode?: "create" | "edit";
  initialValues?: FieldValues;
  recordId?: string;
}

export default function EntityForm({
  schema,
  cancelHref = "/admin",
  mode = "create",
  initialValues,
  recordId,
}: EntityFormProps) {
  const router = useRouter();
  const toast = useToastManager();
  const isEdit = mode === "edit";
  const connected = isConnected(schema.slug);
  const [fauxSaving, setFauxSaving] = useState(false);

  const createEntity = useCreateEntity(schema.slug);
  const updateEntity = useUpdateEntity(schema.slug);
  const submitting = createEntity.isPending || updateEntity.isPending || fauxSaving;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema.zodSchema as z.ZodType<FieldValues, FieldValues>),
    defaultValues: { ...schema.defaultValues, ...initialValues } as FieldValues,
  });

  const errorCount = Object.keys(errors).length;
  const sections = schema.sections;
  const sectionErrorCounts = useMemo(
    () =>
      sections.map(
        (section) => section.fields.filter((f) => !!errors[f.name]).length,
      ),
    [sections, errors],
  );

  async function onSubmit(values: FieldValues) {
    const label = (values.name ?? values.title ?? "The record") as string;

    if (!connected) {
      setFauxSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFauxSaving(false);
      toast.add({
        type: "info",
        title: `${schema.title} not saved`,
        description: `${label} can't be saved yet — this section isn't connected to the backend.`,
      });
      return;
    }

    try {
      if (isEdit) {
        if (!recordId) throw new Error("Missing record id for this update.");
        await updateEntity.mutateAsync({ id: recordId, values });
      } else {
        await createEntity.mutateAsync(values);
      }

      toast.add({
        type: "success",
        title: isEdit ? `${schema.title} updated` : `${schema.title} created`,
        description: `${label} has been saved.`,
      });

      if (cancelHref) {
        router.push(cancelHref);
        router.refresh();
      } else {
        reset(schema.defaultValues as FieldValues);
      }
    } catch (err) {
      toast.add({
        type: "error",
        title: isEdit
          ? `Could not update this ${schema.title.toLowerCase()}`
          : `Could not create this ${schema.title.toLowerCase()}`,
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex min-h-[calc(100vh-3.5rem-3rem)] flex-col"
    >
      <PageHeader
        title={isEdit ? `Edit ${schema.title}` : `Add ${schema.title}`}
        description={schema.description}
        icon={schema.icon}
      />

      <div className="flex-1 space-y-6">
        {sections.map((section, i) => (
          <Card key={section.title} className="overflow-hidden">
            <CardHeader className="gap-0 pb-4">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-foreground">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </div>
                {sectionErrorCounts[i] > 0 && (
                  <Badge variant="destructive" className="ml-auto shrink-0">
                    {sectionErrorCounts[i]} to fix
                  </Badge>
                )}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {section.fields.map((field) =>
                  field.type === "json-list" || field.type === "link-list" ? (
                    <div
                      key={field.name}
                      className={cn(
                        "space-y-2",
                        field.colSpan === 2 && "sm:col-span-2",
                      )}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        {field.label}
                        {field.required && <span className="text-destructive">*</span>}
                      </span>
                      {field.helper && (
                        <p className="text-xs text-muted-foreground">{field.helper}</p>
                      )}
                      {field.type === "link-list" ? (
                        <LinkListInput
                          control={control}
                          register={register}
                          name={field.name}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <FieldArrayInput
                          control={control}
                          register={register}
                          name={field.name}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ) : (
                    <FormField
                      key={field.name}
                      field={field}
                      control={control}
                      register={register}
                      mode={mode}
                      error={errors[field.name]?.message as string | undefined}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 z-30 -mx-6 mt-6 border-t border-border bg-card/95 px-6 py-3 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-xs">
            {errorCount > 0 ? (
              <span className="flex items-center gap-1.5 font-medium text-destructive">
                <AlertCircle className="size-3.5" />
                {errorCount} field{errorCount > 1 ? "s" : ""} need attention
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-highlight" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Check className="size-3.5" />
                All changes saved
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="admin"
              onClick={() => router.push(cancelHref)}
            >
              <ArrowLeft className="size-4" />
              Cancel
            </Button>
            <Button type="submit" variant="highlight" size="admin" loading={submitting}>
              {isEdit ? "Save changes" : `Save ${schema.title}`}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
