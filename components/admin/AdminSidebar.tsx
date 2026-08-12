"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible } from "@base-ui/react/collapsible";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, type NavGroup } from "./nav-groups";

interface TopLevelItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const TOP_LEVEL_ITEMS: TopLevelItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Faculty Directory", href: "/admin/faculty", icon: GraduationCap },
  { title: "Pages", href: "/admin/pages", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  // Exact match or a real child segment — a bare startsWith would let
  // "/admin/iqac/iqac" match "/admin/iqac/iqac-committee" as a false
  // positive prefix.
  return pathname === href || pathname.startsWith(href + "/");
}

function groupIsActive(pathname: string, group: NavGroup) {
  return group.items.some((item) => isActive(pathname, item.href));
}

function NavLink({
  title,
  href,
  icon: Icon,
  active,
  collapsed,
  nested,
  onNavigate,
}: {
  title: string;
  href: string;
  icon?: LucideIcon;
  active: boolean;
  collapsed: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 rounded-lg py-2.5 text-sm transition-colors",
        nested ? "pl-6 pr-3 text-[0.8125rem]" : "px-3",
        collapsed && "justify-center px-0",
        active
          ? "bg-sidebar-primary/15 font-semibold text-sidebar-foreground"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      {nested && !collapsed && (
        <span
          aria-hidden
          className={cn(
            "absolute left-3 top-1/2 size-1 -translate-y-1/2 rounded-full transition-colors",
            active ? "bg-sidebar-primary" : "bg-sidebar-foreground/25"
          )}
        />
      )}
      {active && !collapsed && !nested && (
        <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />
      )}
      {Icon && (
        <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
      )}
      {!collapsed && <span className="truncate">{title}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{title}</TooltipContent>
    </Tooltip>
  );
}

function NavGroupItem({
  group,
  pathname,
  collapsed,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = groupIsActive(pathname, group);
  const [open, setOpen] = useState(active);
  const Icon = group.icon;

  // Collapsed rail: icon-only, jumps straight to the group's first entity.
  if (collapsed) {
    const firstHref = group.items[0]?.href ?? "/admin";
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={firstHref}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-center rounded-lg px-0 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-primary/15 text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            />
          }
        >
          <Icon className="size-4 shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="right">{group.title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          active
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/55 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        )}
      >
        <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
        <span className="flex-1 truncate text-left text-xs font-semibold tracking-wide uppercase">
          {group.title}
        </span>
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-medium tabular-nums transition-colors",
            active
              ? "bg-sidebar-primary/20 text-sidebar-primary"
              : "bg-sidebar-foreground/10 text-sidebar-foreground/50"
          )}
        >
          {group.items.length}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="overflow-hidden data-ending-style:h-0 data-starting-style:h-0">
        <div className="relative ml-[1.15rem] space-y-0.5 border-l border-sidebar-border py-1 pl-0">
          {group.items.map((item) => (
            <NavLink
              key={item.href}
              title={item.title}
              href={item.href}
              active={isActive(pathname, item.href)}
              collapsed={false}
              nested
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

function SidebarBody({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-5",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent ring-1 ring-sidebar-border">
          <Image
            src="/images/pciu-logo.png"
            alt="PCIU"
            width={22}
            height={22}
            className="size-5.5 shrink-0 object-contain"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-heading font-bold leading-tight text-sidebar-foreground">PCIU Admin</p>
            <p className="text-[0.6875rem] leading-tight text-sidebar-foreground/45">Content Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-2 pb-2">
        {TOP_LEVEL_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}

        <div className={cn("my-3 border-t border-sidebar-border", collapsed && "mx-1")} />

        <div className="space-y-0.5">
          {NAV_GROUPS.map((group) => (
            <NavGroupItem
              key={group.key}
              group={group}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-sidebar-border px-2 py-3">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

export interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ collapsed, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 h-full w-72 shadow-xl">
            <div className="flex justify-end bg-sidebar px-2 pt-2">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                onClick={onMobileClose}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="h-[calc(100%-2.5rem)]">
              <SidebarBody collapsed={false} pathname={pathname} onNavigate={onMobileClose} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border transition-all duration-300 lg:block",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarBody collapsed={collapsed} pathname={pathname} />
      </aside>
    </TooltipProvider>
  );
}
