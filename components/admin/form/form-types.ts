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
  /** Grid span within a 2-column section. Defaults to 1. */
  colSpan?: 1 | 2;
  /** Options for "select", "enum", and "radio" fields. */
  options?: FieldOption[];
  /** Table name a "relation" field points to — rendered as a labelled placeholder select. */
  relationTo?: string;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FieldDescriptor[];
}

export interface EntitySchema<T extends z.ZodTypeAny = z.ZodTypeAny> {
  /** URL-safe identifier, also the route segment, e.g. "teacher". */
  slug: string;
  /** Human title, e.g. "Teacher". */
  title: string;
  /**
   * Plural form for listing headings, e.g. "Teachers". Falls back to
   * naive `${title}s` when omitted — set this explicitly wherever that
   * naive form would be wrong (title already plural, irregular plural, ...).
   */
  pluralTitle?: string;
  /** One-line description shown under the page heading. */
  description: string;
  icon: LucideIcon;
  /** Sidebar/route group this entity belongs to, e.g. "People". */
  group: string;
  sections: FormSection[];
  zodSchema: T;
  defaultValues: Partial<z.infer<T>>;
}
