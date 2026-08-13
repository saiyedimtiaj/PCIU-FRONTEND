"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Users,
  CalendarDays,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface FacultyNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

// Mirrors AdminSidebar's flat NAV_ITEMS shape — a teacher's portal has 8
// destinations total, so (unlike the admin sidebar) there's no need for the
// collapsible-group layer that exists there to manage 50 entities.
const NAV_ITEMS: FacultyNavItem[] = [
  { title: "Dashboard", href: "/faculty-portal", icon: LayoutDashboard },
  { title: "My Profile", href: "/faculty-portal/profile", icon: UserRound },
  { title: "Education", href: "/faculty-portal/education", icon: GraduationCap },
  { title: "Publications", href: "/faculty-portal/publications", icon: BookOpen },
  { title: "Experience", href: "/faculty-portal/experience", icon: Briefcase },
  { title: "Awards", href: "/faculty-portal/awards", icon: Award },
  { title: "Memberships", href: "/faculty-portal/memberships", icon: Users },
  { title: "Conferences", href: "/faculty-portal/conferences", icon: CalendarDays },
];

function isActive(pathname: string, href: string) {
  if (href === "/faculty-portal") return pathname === "/faculty-portal";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  title,
  href,
  icon: Icon,
  active,
  collapsed,
  onNavigate,
}: {
  title: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-sidebar-primary/15 font-semibold text-sidebar-foreground"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      {active && !collapsed && (
        <span aria-hidden className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />
      )}
      <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
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

function SidebarBody({
  collapsed,
  pathname,
  teacherName,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  teacherName: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-2")}>
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
            <p className="font-heading font-bold leading-tight text-sidebar-foreground">Faculty Portal</p>
            <p className="truncate text-[0.6875rem] leading-tight text-sidebar-foreground/45">{teacherName}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-2 pb-2">
        {NAV_ITEMS.map((item, i) => (
          <div key={item.href}>
            {i === 2 && <div className={cn("my-3 border-t border-sidebar-border", collapsed && "mx-1")} />}
            <NavLink
              title={item.title}
              href={item.href}
              icon={item.icon}
              active={isActive(pathname, item.href)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-sidebar-border px-2 py-3">
        <Link
          href="/signin"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && "Sign Out"}
        </Link>
      </div>
    </div>
  );
}

export interface FacultySidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  teacherName: string;
}

export default function FacultySidebar({ collapsed, mobileOpen, onMobileClose, teacherName }: FacultySidebarProps) {
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
              <SidebarBody collapsed={false} pathname={pathname} teacherName={teacherName} onNavigate={onMobileClose} />
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
        <SidebarBody collapsed={collapsed} pathname={pathname} teacherName={teacherName} />
      </aside>
    </TooltipProvider>
  );
}
