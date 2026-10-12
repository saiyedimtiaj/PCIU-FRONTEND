"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export default function FormSelect({
  label,
  error,
  required,
  className,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
}: FormSelectProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Select
        items={options}
        value={value || null}
        onValueChange={(next) => onValueChange(next ?? "")}
        disabled={disabled}
      >
        <SelectTrigger aria-invalid={!!error}>
          <SelectValue placeholder={placeholder ?? `Select ${label.toLowerCase()}`} />
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
      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
