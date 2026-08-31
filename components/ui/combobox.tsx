"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

const Combobox = ComboboxPrimitive.Root;

function ComboboxInputGroup({
  className,
  ...props
}: ComboboxPrimitive.InputGroup.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn("relative flex items-center", className)}
      {...props}
    />
  );
}

function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "flex h-11 w-full items-center rounded-lg border border-input bg-card px-4 py-3 pr-16 text-sm text-foreground outline-none transition-colors data-popup-open:ring-2 data-popup-open:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxTrailing({ children }: { children?: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute right-3 flex items-center gap-1 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-60">
      {children}
      <ComboboxPrimitive.Icon>
        <ChevronDown />
      </ComboboxPrimitive.Icon>
    </div>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        "pointer-events-auto absolute right-9 flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5",
        className,
      )}
      {...props}
    >
      <X />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxContent({
  className,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner sideOffset={6} className="z-50">
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "max-h-[min(24rem,var(--available-height))] w-(--anchor-width) overflow-y-auto rounded-lg border border-border bg-card p-1 text-foreground shadow-lg",
            className,
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex cursor-default items-center justify-between gap-2 rounded-md px-3 py-2 text-sm outline-none select-none data-highlighted:bg-muted [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <ComboboxPrimitive.ItemIndicator>
        <Check className="text-accent" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    // Stays mounted (and DOM-empty) whenever the list has matches — the
    // primitive requires that for screen readers — so its padding must
    // collapse via `empty:` or it leaves a blank gap above real results.
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "empty:hidden not-empty:px-3 not-empty:py-6 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrailing,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
};
