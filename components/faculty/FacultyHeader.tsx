"use client";

import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FacultyHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileNav: () => void;
  title: string;
}

/** Mirrors AdminHeader's layout exactly; title is passed in rather than
 * derived from the pathname internally, since this same shell backs two
 * different route trees (the portal and the admin per-teacher workspace),
 * each with its own title-resolution rules. */
export default function FacultyHeader({ collapsed, onToggleCollapse, onOpenMobileNav, title }: FacultyHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-card px-4">
      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>
      <h1 className="font-heading text-sm font-semibold text-foreground">{title}</h1>
    </header>
  );
}
