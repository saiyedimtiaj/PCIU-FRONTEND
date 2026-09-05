"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { logoutAction } from "@/app/(auth)/actions";

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
        "group/link relative flex items-center gap-2.5 rounded-xl text-sm transition-all duration-150",
        nested ? "py-2 pr-3 pl-8 text-[0.8125rem]" : "px-3 py-2.5",
        collapsed && "justify-center px-0",
        active
          ? nested
            ? "font-medium text-sidebar-foreground"
            : "bg-gradient-accent font-semibold text-white shadow-glow"
          : "text-sidebar-foreground/55 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
      )}
    >
      {nested && (
        <span
          aria-hidden
          className={cn(
            "absolute left-4 top-1/2 size-1.5 -translate-y-1/2 rounded-full transition-colors",
            active ? "bg-sidebar-primary shadow-[0_0_6px_var(--sidebar-primary)]" : "bg-sidebar-foreground/20 group-hover/link:bg-sidebar-foreground/40"
          )}
        />
      )}
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0 transition-transform duration-150",
            active && !nested && "text-white",
            !active && "group-hover/link:scale-110"
          )}
        />
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
                "flex items-center justify-center rounded-xl px-0 py-2.5 text-sm transition-all",
                active
                  ? "bg-sidebar-primary/20 text-sidebar-primary"
                  : "text-sidebar-foreground/55 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
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
          "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm transition-colors",
          active
            ? "bg-sidebar-accent/50 text-sidebar-foreground"
            : "text-sidebar-foreground/45 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/80"
        )}
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
            active ? "bg-sidebar-primary/20 text-sidebar-primary" : "bg-sidebar-foreground/6 text-sidebar-foreground/50"
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="flex-1 truncate text-left text-[0.8125rem] font-medium">
          {group.title}
        </span>
        <span
          className={cn(
            "flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[0.625rem] font-semibold tabular-nums transition-colors",
            active
              ? "bg-sidebar-primary/25 text-sidebar-primary"
              : "bg-sidebar-foreground/8 text-sidebar-foreground/40"
          )}
        >
          {group.items.length}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-sidebar-foreground/35 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="overflow-hidden data-ending-style:h-0 data-starting-style:h-0">
        <div className="space-y-0.5 pt-0.5 pb-1">
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
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await logoutAction();
    router.replace("/signin");
    router.refresh();
  }

  return (
    <div className="relative flex h-full flex-col bg-sidebar">
      {/* Ambient glow behind the logo — purely decorative, echoes the
          gradient-accent chips used throughout the header/cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-sidebar-primary/10 blur-3xl"
      />

      <div
        className={cn(
          "relative flex items-center gap-3 px-4 py-5",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow ring-1 ring-white/10">
          <Image
            src="/images/pciu-logo.png"
            alt="PCIU"
            width={24}
            height={24}
            className="size-6 shrink-0 object-contain"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-heading text-[0.9375rem] font-bold leading-tight text-sidebar-foreground">
              PCIU Admin
            </p>
            <p className="text-[0.6875rem] font-medium leading-tight text-sidebar-foreground/40">
              Content Dashboard
            </p>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin relative flex-1 space-y-4 overflow-y-auto px-2.5 pb-2">
        <div className="space-y-0.5">
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
        </div>

        <div className={cn("space-y-1", collapsed && "space-y-1.5")}>
          {!collapsed && (
            <p className="px-2.5 pb-1 text-[0.625rem] font-semibold tracking-widest text-sidebar-foreground/30 uppercase">
              Content
            </p>
          )}
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

      <div className="relative border-t border-sidebar-border/60 px-2.5 py-3">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && (signingOut ? "Signing out…" : "Sign Out")}
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

      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border transition-all duration-300 lg:block",
          collapsed ? "w-17" : "w-64"
        )}
      >
        <SidebarBody collapsed={collapsed} pathname={pathname} />
      </aside>
    </TooltipProvider>
  );
}
