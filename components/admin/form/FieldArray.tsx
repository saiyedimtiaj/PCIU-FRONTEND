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
