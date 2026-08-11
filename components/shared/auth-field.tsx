import type { ComponentProps, ReactNode } from "react";
import { Field } from "@base-ui/react/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends ComponentProps<"input"> {
  label: string;
  icon: ReactNode;
  /** Rendered inline next to the label, e.g. a "Forgot password?" link. */
  action?: ReactNode;
  /** Rendered inside the field on the right, e.g. a decorative show/hide icon. */
  trailing?: ReactNode;
}

/**
 * Shared auth-form field: base-ui Field gives free label<->control `id`
 * association (full a11y) with zero state, while `render` lets it wrap our
 * existing styled Input so field styling stays defined in one place.
 */
export function AuthField({ label, icon, action, trailing, className, ...props }: AuthFieldProps) {
  return (
    <Field.Root className="space-y-2">
      <div className="flex items-center justify-between">
        <Field.Label className="text-sm font-medium text-foreground">{label}</Field.Label>
        {action}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
        <Field.Control
          {...props}
          render={<Input />}
          className={cn("pl-10", trailing && "pr-11", className)}
        />
        {trailing && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {trailing}
          </span>
        )}
      </div>
    </Field.Root>
  );
}
