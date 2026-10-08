"use client";

import { Field } from "@base-ui/react/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface FormInputProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
}

export default function FormInput({
  label,
  error,
  required,
  className,
  registration,
  type = "text",
  placeholder,
}: FormInputProps) {
  return (
    <Field.Root className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        {...registration}
      />
      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </Field.Root>
  );
}
