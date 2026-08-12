"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// `variant` is set once on TabsList and read by every TabsTrigger and
// TabsContent via context, so callers can't forget to pass it to an
// individual trigger/panel. Landing pages never pass `variant`, so they
// stay on "default" — the classes for that branch are byte-identical to
// this component's pre-variant styling, to avoid any pixel shift on
// /research or /iqac.
type TabsVariant = "default" | "pill" | "underline";
const TabsVariantContext = React.createContext<TabsVariant>("default");

// The provider wraps Tabs.Root (not just TabsList) because TabsContent is
// a sibling of TabsList under Root, not a descendant of it — a provider
// scoped to TabsList alone would never reach TabsContent's context read.
function Tabs({
  className,
  variant,
  ...props
}: TabsPrimitive.Root.Props & { variant?: TabsVariant }) {
  return (
    <TabsVariantContext.Provider value={variant ?? "default"}>
      <TabsPrimitive.Root data-slot="tabs" className={className} {...props} />
    </TabsVariantContext.Provider>
  );
}

const tabsListVariants = cva("inline-flex h-auto items-center", {
  variants: {
    variant: {
      default: "flex-wrap justify-center gap-2 rounded-lg bg-muted/50 p-2",
      // Dark, matches the sidebar rail rather than a pale muted chip —
      // gives the active trigger's solid fill somewhere to visibly sit.
      pill: "gap-1 rounded-lg bg-sidebar p-1",
      underline: "gap-6 border-b border-border p-0",
    },
  },
  defaultVariants: { variant: "default" },
});

const tabsTriggerVariants = cva(
  "inline-flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-md px-4 py-2 text-muted-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm hover:text-foreground",
        pill: "rounded-md px-3 py-1.5 text-sidebar-foreground/60 hover:text-sidebar-foreground data-active:shadow-sm",
        underline:
          "-mb-px border-b-2 border-transparent px-1 pb-3 text-muted-foreground data-active:border-primary data-active:text-foreground hover:text-foreground",
      },
      // Only meaningful on the "pill" list variant (e.g. status filters:
      // All / Active / Inactive) — solid admin-button-style fill on the
      // active tab, mirroring Button's success/warning variants. Scoped to
      // "pill" via compoundVariants below so it never touches default/underline.
      tone: {
        neutral: "",
        success: "",
        warning: "",
      },
    },
    compoundVariants: [
      // Bright indigo, not bg-card — a white fill inside the dark pill
      // read as barely-there; the solid accent color is unmistakable.
      {
        variant: "pill",
        tone: "neutral",
        className: "data-active:bg-sidebar-primary data-active:text-white",
      },
      // success/warning toned triggers also carry a faint resting tint
      // (not just on the active state) so "Active"/"Inactive" read as
      // distinct colored options even before either is selected — plain
      // grey text at rest made them indistinguishable from each other and
      // from "All".
      {
        variant: "pill",
        tone: "success",
        className:
          "text-success/80 data-active:bg-success data-active:text-success-foreground",
      },
      {
        variant: "pill",
        tone: "warning",
        className:
          "text-warning data-active:bg-warning data-active:text-warning-foreground",
      },
    ],
    defaultVariants: { variant: "default", tone: "neutral" },
  }
);

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends TabsPrimitive.Tab.Props {
  /** Active-state color, for status-style triggers (e.g. "Active" -> success). Only visible on the "pill" TabsList variant. */
  tone?: "neutral" | "success" | "warning";
}

function TabsTrigger({ className, tone, ...props }: TabsTriggerProps) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

const tabsContentVariants = cva("mt-6 outline-none", {
  variants: {
    variant: {
      default: "",
      pill: "",
      // Underline tabs read as a page-section switcher, so give the panel
      // its own card surface — without this the content floated directly
      // on the page background with nothing to visually contain it.
      underline: "rounded-xl border border-border bg-card p-5",
    },
  },
  defaultVariants: { variant: "default" },
});

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(tabsContentVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
