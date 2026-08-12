"use client";

import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-card outline-none transition-colors data-checked:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex size-2 rounded-full bg-primary data-unchecked:hidden" />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
