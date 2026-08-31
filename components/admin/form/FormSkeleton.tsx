import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { EntitySchema } from "./form-types";

export default function FormSkeleton({ schema }: { schema: EntitySchema }) {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading {schema.title.toLowerCase()}…</span>

      <div className="mb-6 flex items-start gap-4">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="space-y-2 pt-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
      </div>

      {schema.sections.map((section) => (
        <Card key={section.title} className="overflow-hidden">
          <CardHeader className="gap-3 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.colSpan === 2 ? "sm:col-span-2 space-y-2" : "space-y-2"
                  }
                >
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton
                    className={
                      field.type === "textarea" || field.type === "richtext"
                        ? "h-24 w-full rounded-lg"
                        : field.type === "switch" || field.type === "checkbox"
                          ? "h-6 w-11 rounded-full"
                          : "h-11 w-full rounded-lg"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
    </div>
  );
}
