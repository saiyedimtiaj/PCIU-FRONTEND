"use client";

import { Controller, type Control, type FieldValues, type UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FieldDescriptor } from "./form-types";

export interface FormFieldProps {
  field: FieldDescriptor;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  error?: string;
}

const NATIVE_INPUT_TYPES = new Set(["text", "email", "tel", "url", "password", "date", "datetime", "time"]);

function nativeInputType(type: FieldDescriptor["type"]) {
  if (type === "datetime") return "datetime-local";
  return type;
}

export function FormField({ field, control, register, error }: FormFieldProps) {
  const wrapperClass = cn("space-y-2", field.colSpan === 2 && "sm:col-span-2");

  // Native text-like inputs and number/decimal — plain register, no Controller needed.
  if (NATIVE_INPUT_TYPES.has(field.type)) {
    return (
      <div className={wrapperClass}>
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input
          id={field.name}
          type={nativeInputType(field.type)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          {...register(field.name)}
        />
        {field.helper && !error && (
          <p className="text-xs text-muted-foreground">{field.helper}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (field.type === "number" || field.type === "decimal") {
    return (
      <div className={wrapperClass}>
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input
          id={field.name}
          type="number"
          step={field.type === "decimal" ? "0.01" : "1"}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          {...register(field.name, { valueAsNumber: true })}
        />
        {field.helper && !error && (
          <p className="text-xs text-muted-foreground">{field.helper}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <div className={wrapperClass}>
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          rows={field.type === "richtext" ? 6 : 4}
          {...register(field.name)}
        />
        {field.helper && !error && (
          <p className="text-xs text-muted-foreground">{field.helper}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (field.type === "image" || field.type === "file") {
    return (
      <div className={wrapperClass}>
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input
          id={field.name}
          type="url"
          placeholder={field.placeholder ?? "https://example.com/file.jpg"}
          aria-invalid={!!error}
          {...register(field.name)}
        />
        <p className="text-xs text-muted-foreground">
          {field.helper ?? "Paste a file URL — direct uploads aren't wired up yet."}
        </p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (field.type === "switch") {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <div className={cn(wrapperClass, "flex items-center justify-between rounded-lg border border-border p-3")}>
            <div>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.helper && <p className="text-xs text-muted-foreground">{field.helper}</p>}
            </div>
            <Switch
              id={field.name}
              checked={!!rhf.value}
              onCheckedChange={rhf.onChange}
            />
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
          <div className={cn(wrapperClass, "flex items-center gap-2.5")}>
            <Checkbox
              id={field.name}
              checked={!!rhf.value}
              onCheckedChange={rhf.onChange}
            />
            <Label htmlFor={field.name} className="font-normal">
              {field.label}
            </Label>
          </div>
        )}
      />
    );
  }

  if (field.type === "select" || field.type === "enum" || field.type === "relation") {
    const options = field.options ?? [];
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <div className={wrapperClass}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            <Select
              items={options}
              value={rhf.value ?? ""}
              onValueChange={(value) => rhf.onChange(value ?? "")}
            >
              <SelectTrigger id={field.name} aria-invalid={!!error}>
                <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helper && !error && (
              <p className="text-xs text-muted-foreground">{field.helper}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  if (field.type === "radio") {
    const options = field.options ?? [];
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <div className={wrapperClass}>
            <Label>
              {field.label}
              {field.required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            <RadioGroup value={rhf.value ?? ""} onValueChange={(value) => rhf.onChange(value)}>
              {options.map((option) => (
                <label key={option.value} className="flex items-center gap-2.5 text-sm text-foreground">
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  return null;
}
