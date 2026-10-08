"use client";

import { useFieldArray, type Control, type UseFormRegister, type FieldValues } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FieldArrayInputProps {
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  name: string;
  placeholder?: string;
  /** `stat-list` only: suggested icon names, offered via a datalist. */
  suggestions?: string[];
}

export function FieldArrayInput({ control, register, name, placeholder }: FieldArrayInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div className="space-y-2">
      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">No entries yet.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            {...register(`${name}.${index}` as never)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-destructive hover:bg-destructive/10"
            onClick={() => remove(index)}
            aria-label="Remove entry"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("" as never)}
      >
        <Plus className="size-4" />
        Add entry
      </Button>
    </div>
  );
}

/**
 * Like FieldArrayInput but for a `{ url, title }` pair per row — the API
 * shape for `quick_link` (department) rather than a flat string. A plain
 * FieldArrayInput here would only ever capture a title and silently drop
 * the URL, so this renders two inputs per row instead of one.
 */
export function LinkListInput({ control, register, name, placeholder }: FieldArrayInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div className="space-y-2">
      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">No entries yet.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            {...register(`${name}.${index}.title` as never)}
            placeholder={placeholder ?? "Title"}
            className="flex-1"
          />
          <Input
            {...register(`${name}.${index}.url` as never)}
            placeholder="https://..."
            className="flex-[1.5]"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-destructive hover:bg-destructive/10"
            onClick={() => remove(index)}
            aria-label="Remove entry"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ title: "", url: "" } as never)}
      >
        <Plus className="size-4" />
        Add entry
      </Button>
    </div>
  );
}

/**
 * A `{ icon, value, label }` row per entry — the API shape for stat
 * blocks such as the About page's `quickFacts`. The icon is free text (a
 * lucide name like "GraduationCap") with `suggestions` offered through a
 * datalist, so a saved name outside the suggestion list is never dropped.
 */
export function StatListInput({ control, register, name, suggestions = [] }: FieldArrayInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });
  const listId = `${name}-icons`;

  return (
    <div className="space-y-2">
      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">No entries yet.</p>
      )}
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((icon) => (
            <option key={icon} value={icon} />
          ))}
        </datalist>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_1fr_1.5fr_auto]">
          <Input
            {...register(`${name}.${index}.icon` as never)}
            list={suggestions.length > 0 ? listId : undefined}
            placeholder="Icon (e.g. Users)"
            className="col-span-2 sm:col-span-1"
          />
          <Input {...register(`${name}.${index}.value` as never)} placeholder="Value (e.g. 5,000+)" />
          <Input
            {...register(`${name}.${index}.label` as never)}
            placeholder="Label (e.g. Students Enrolled)"
            className="col-start-1 sm:col-start-auto"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="row-start-2 col-start-2 shrink-0 self-center text-destructive hover:bg-destructive/10 sm:row-start-auto sm:col-start-auto"
            onClick={() => remove(index)}
            aria-label="Remove entry"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ icon: "", value: "", label: "" } as never)}
      >
        <Plus className="size-4" />
        Add entry
      </Button>
    </div>
  );
}
