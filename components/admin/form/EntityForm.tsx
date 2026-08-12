"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import PageHeader from "@/components/admin/PageHeader";
import { FormField } from "./FormField";
import { FieldArrayInput } from "./FieldArray";
import type { EntitySchema } from "./form-types";

export interface EntityFormProps {
  schema: EntitySchema;
  /** Where Cancel navigates back to. Defaults to /admin. */
  cancelHref?: string;
}

export default function EntityForm({ schema, cancelHref = "/admin" }: EntityFormProps) {
  const router = useRouter();
  const toast = useToastManager();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    // Entity schemas are dynamic (schema-driven, one zod shape per entity file),
    // so the resolver can't statically infer FieldValues — cast is intentional.
    resolver: zodResolver(schema.zodSchema as z.ZodType<FieldValues, FieldValues>),
    defaultValues: schema.defaultValues as FieldValues,
  });

  async function onSubmit(values: FieldValues) {
    setSubmitting(true);
    // Design-only: no backend to persist against yet. Simulate a save.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    toast.add({
      type: "success",
      title: `${schema.title} created`,
      description: `${(values.name ?? values.title ?? "The new record") as string} would be saved here once persistence exists.`,
    });
    // Land back on the listing (the expected CMS flow) rather than
    // resetting in place, when the caller gave us somewhere to go.
    if (cancelHref) {
      router.push(cancelHref);
    } else {
      reset(schema.defaultValues as FieldValues);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <PageHeader title={`Add ${schema.title}`} description={schema.description} icon={schema.icon} />

      <div className="space-y-6">
        {schema.sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="space-y-5">
              <div>
                <h3 className="font-heading font-semibold text-foreground">{section.title}</h3>
                {section.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {section.fields.map((field) =>
                  field.type === "json-list" ? (
                    <div
                      key={field.name}
                      className={field.colSpan === 2 ? "sm:col-span-2 space-y-2" : "space-y-2"}
                    >
                      <p className="text-sm font-medium text-foreground">{field.label}</p>
                      {field.helper && (
                        <p className="text-xs text-muted-foreground">{field.helper}</p>
                      )}
                      <FieldArrayInput
                        control={control}
                        register={register}
                        name={field.name}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ) : (
                    <FormField
                      key={field.name}
                      field={field}
                      control={control}
                      register={register}
                      error={errors[field.name]?.message as string | undefined}
                    />
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 z-30 -mx-6 mt-8 flex items-center justify-between gap-3 border-t border-border bg-card px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_-4px_hsl(0_0%_0%/0.08)]">
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
          Save {schema.title}
        </Button>
      </div>
    </form>
  );
}
