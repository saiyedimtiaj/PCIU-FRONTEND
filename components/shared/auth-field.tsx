"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Field } from "@base-ui/react/field";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends ComponentProps<"input"> {
  label: string;
  icon: ReactNode;
  action?: ReactNode;
  trailing?: ReactNode;
}

export function AuthField({ label, icon, action, trailing, className, type, ...props }: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  const hasTrailing = isPassword || !!trailing;

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
          type={inputType}
          render={<Input />}
          className={cn("pl-10", hasTrailing && "pr-11", className)}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4"
          >
            {revealed ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
          </button>
        ) : (
          trailing && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {trailing}
            </span>
          )
        )}
      </div>
    </Field.Root>
  );
}
