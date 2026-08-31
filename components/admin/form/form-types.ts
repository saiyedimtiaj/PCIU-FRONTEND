import type { LucideIcon } from "lucide-react";
import type { z } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "password"
  | "textarea"
  | "richtext"
  | "number"
  | "decimal"
  | "select"
  | "enum"
  | "switch"
  | "checkbox"
  | "radio"
  | "date"
  | "datetime"
  | "time"
  | "image"
  | "file"
  | "json-list"
  | "relation";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDescriptor {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helper?: string;
  required?: boolean;
  colSpan?: 1 | 2;
  options?: FieldOption[];
  relationTo?: string;
  immutableOnEdit?: boolean;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FieldDescriptor[];
}

export interface EntitySchema<T extends z.ZodTypeAny = z.ZodTypeAny> {
  slug: string;
  title: string;
  pluralTitle?: string;
  description: string;
  icon: LucideIcon;
  group: string;
  sections: FormSection[];
  zodSchema: T;
  defaultValues: Partial<z.infer<T>>;
}
