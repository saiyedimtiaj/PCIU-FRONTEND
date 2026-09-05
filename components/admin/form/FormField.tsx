"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Controller, useWatch, type Control, type FieldValues, type UseFormRegister } from "react-hook-form";
import {
  AtSign, Phone, Link2, Lock, Calendar, Clock, Hash, Type,
  AlignLeft, ListFilter, Image as ImageIcon, Paperclip, Lock as LockIcon, X,
} from "lucide-react";
import { resolveUploadUrl } from "@/lib/upload-url";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Combobox,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrailing,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { useRelationOptions } from "@/features/entity";
import { cn } from "@/lib/utils";
import type { FieldDescriptor, FieldOption, FieldType } from "./form-types";

export interface FormFieldProps {
  field: FieldDescriptor;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  error?: string;
  mode?: "create" | "edit";
}

const NATIVE_INPUT_TYPES = new Set(["text", "email", "tel", "url", "password", "date", "datetime", "time"]);

const FIELD_ICON: Partial<Record<FieldType, typeof AtSign>> = {
  email: AtSign,
  tel: Phone,
  url: Link2,
  password: Lock,
  date: Calendar,
  datetime: Calendar,
  time: Clock,
  number: Hash,
  decimal: Hash,
  text: Type,
  textarea: AlignLeft,
  richtext: AlignLeft,
  select: ListFilter,
  enum: ListFilter,
  relation: ListFilter,
  image: ImageIcon,
  file: Paperclip,
};

function nativeInputType(type: FieldDescriptor["type"]) {
  if (type === "datetime") return "datetime-local";
  return type;
}

function FieldShell({
  field,
  error,
  children,
  locked,
  htmlFor,
  labelAs = "label",
}: {
  field: FieldDescriptor;
  error?: string;
  children: ReactNode;
  locked?: boolean;
  htmlFor?: string;
  labelAs?: "label" | "span";
}) {
  const LabelEl = labelAs === "label" ? Label : "span";

  return (
    <div className={cn("group/field space-y-2", field.colSpan === 2 && "sm:col-span-2")}>
      <div className="flex items-center justify-between gap-2">
        <LabelEl
          {...(labelAs === "label" ? { htmlFor: htmlFor ?? field.name } : {})}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </LabelEl>
        {locked && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <LockIcon className="size-3" />
            Locked
          </span>
        )}
      </div>

      {children}

      {field.helper && !error && (
        <p className="text-xs leading-relaxed text-muted-foreground">{field.helper}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function IconInput({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { icon?: typeof AtSign }) {
  if (!Icon) return <Input className={className} {...props} />;

  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/field:text-primary" />
      <Input className={cn("pl-10", className)} {...props} />
    </div>
  );
}

function ImageUploadField({
  field,
  error,
  value,
  onChange,
  onBlur,
}: {
  field: FieldDescriptor;
  error?: string;
  value: unknown;
  onChange: (value: File | string) => void;
  onBlur: () => void;
}) {
  const existing = typeof value === "string" ? value : "";
  const file = value instanceof File ? value : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const src = objectUrl ?? (existing ? resolveUploadUrl(existing) : "");
  const hasPreview = !!src && failedSrc !== src;

  return (
    <FieldShell field={field} error={error}>
      <label
        htmlFor={field.name}
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/20 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-accent/40"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ImageIcon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {file ? file.name : existing ? "Replace file" : "Choose a file"}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {file
              ? `${(file.size / 1024).toFixed(0)} KB selected`
              : existing || "No file selected yet"}
          </span>
        </span>
      </label>
      <input
        id={field.name}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (!picked) return;
          setFailedSrc(null);
          onChange(picked);
        }}
        onBlur={onBlur}
      />
      {hasPreview && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="size-full object-cover"
              onError={() => setFailedSrc(src)}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setFailedSrc(null);
              onChange("");
            }}
            className="flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <X className="size-3.5" />
            Remove
          </button>
        </div>
      )}
    </FieldShell>
  );
}


function RelationField({
  field,
  control,
  error,
}: {
  field: FieldDescriptor;
  control: Control<FieldValues>;
  error?: string;
}) {
  const { options, isLoading } = useRelationOptions(field.relationTo, field.options);
  const joinedKey = field.name.replace(/_id$/, "");
  const joined = useWatch({ control, name: joinedKey }) as
    | Record<string, unknown>
    | undefined;
  const joinedLabel =
    joined && typeof joined === "object"
      ? ((joined.name ?? joined.title ?? joined.designation) as string | undefined)
      : undefined;

  function itemToStringLabel(value: string) {
    if (!value) return "";
    return (
      options.find((o) => o.value === value)?.label ?? joinedLabel ?? `Unknown (id ${value})`
    );
  }

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: rhf }) => (
        <FieldShell field={field} error={error}>
          <Combobox
            items={options}
            value={rhf.value || null}
            onValueChange={(value) => rhf.onChange(value ?? "")}
            itemToStringLabel={itemToStringLabel}
          >
            <ComboboxInputGroup>
              <ComboboxInput
                id={field.name}
                aria-invalid={!!error}
                placeholder={
                  isLoading
                    ? "Loading…"
                    : (field.placeholder ?? `Search ${field.label.toLowerCase()}...`)
                }
                disabled={isLoading}
              />
              <ComboboxTrailing>
                {rhf.value && <ComboboxClear />}
              </ComboboxTrailing>
            </ComboboxInputGroup>
            <ComboboxContent>
              <ComboboxEmpty>
                {options.length === 0
                  ? "No options available"
                  : "No matches"}
              </ComboboxEmpty>
              <ComboboxList>
                {(option: FieldOption) => (
                  <ComboboxItem key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {isLoading && <Skeleton className="h-3 w-24" />}
        </FieldShell>
      )}
    />
  );
}

export function FormField({ field, control, register, error, mode = "create" }: FormFieldProps) {
  const Icon = FIELD_ICON[field.type];
  const locked = mode === "edit" && !!field.immutableOnEdit;
  const lockedHelper = locked
    ? { ...field, helper: field.helper ?? "This can't be changed after creation." }
    : field;

  if (NATIVE_INPUT_TYPES.has(field.type)) {
    return (
      <FieldShell field={lockedHelper} error={error} locked={locked}>
        <IconInput
          id={field.name}
          icon={Icon}
          type={nativeInputType(field.type)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          disabled={locked}
          className={cn(locked && "cursor-not-allowed bg-muted/60 text-muted-foreground")}
          {...register(field.name)}
        />
      </FieldShell>
    );
  }

  if (field.type === "number" || field.type === "decimal") {
    return (
      <FieldShell field={field} error={error}>
        <IconInput
          id={field.name}
          icon={Icon}
          type="number"
          step={field.type === "decimal" ? "0.01" : "1"}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          {...register(field.name)}
        />
      </FieldShell>
    );
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <FieldShell field={field} error={error}>
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          className={field.type === "richtext" ? "min-h-36" : undefined}
          {...register(field.name)}
        />
      </FieldShell>
    );
  }

  if (field.type === "image") {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <ImageUploadField
            field={field}
            error={error}
            value={rhf.value}
            onChange={rhf.onChange}
            onBlur={rhf.onBlur}
          />
        )}
      />
    );
  }

  if (field.type === "file") {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => {
          const existing = typeof rhf.value === "string" ? rhf.value : "";
          const picked = rhf.value instanceof File ? rhf.value : null;

          return (
            <FieldShell field={field} error={error}>
              <label
                htmlFor={field.name}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/20 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-accent/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Paperclip className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {picked ? picked.name : existing ? "Replace file" : "Choose a file"}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {picked
                      ? `${(picked.size / 1024).toFixed(0)} KB selected`
                      : existing || "No file selected yet"}
                  </span>
                </span>
              </label>
              <input
                id={field.name}
                type="file"
                className="sr-only"
                onChange={(e) => rhf.onChange(e.target.files?.[0] ?? existing)}
                onBlur={rhf.onBlur}
              />
            </FieldShell>
          );
        }}
      />
    );
  }

  if (field.type === "switch") {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <div className={cn("space-y-2", field.colSpan === 2 && "sm:col-span-2")}>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40">
              <div className="min-w-0">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                {field.helper && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{field.helper}</p>
                )}
              </div>
              <Switch id={field.name} checked={!!rhf.value} onCheckedChange={rhf.onChange} />
            </div>
            {error && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <div className={cn("space-y-2", field.colSpan === 2 && "sm:col-span-2")}>
            <label
              htmlFor={field.name}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40"
            >
              <Checkbox
                id={field.name}
                checked={!!rhf.value}
                onCheckedChange={rhf.onChange}
                className="mt-0.5"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{field.label}</span>
                {field.helper && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">{field.helper}</span>
                )}
              </span>
            </label>
            {error && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      />
    );
  }

  if (field.type === "select" || field.type === "enum") {
    const options = field.options ?? [];
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <FieldShell field={field} error={error}>
            <Select
              items={options}
              value={rhf.value ?? ""}
              onValueChange={(value) => rhf.onChange(value ?? "")}
            >
              <SelectTrigger id={field.name} aria-invalid={!!error}>
                <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.length === 0 ? (
                  <SelectItem value="" disabled>
                    No options available
                  </SelectItem>
                ) : (
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FieldShell>
        )}
      />
    );
  }

  if (field.type === "relation") {
    return <RelationField field={field} control={control} error={error} />;
  }

  if (field.type === "radio") {
    const options = field.options ?? [];
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <FieldShell field={field} error={error} labelAs="span">
            <RadioGroup
              value={rhf.value ?? ""}
              onValueChange={(value) => rhf.onChange(value)}
              className="grid gap-2"
            >
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-colors hover:border-primary/40 has-data-checked:border-primary has-data-checked:bg-accent/50"
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
          </FieldShell>
        )}
      />
    );
  }

  return null;
}
