"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/types/auth";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AD";
}

function roleLabel(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AdminAccountMenu({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await logoutAction();
    router.replace("/signin");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="group flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-1.5 pr-2 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-accent data-popup-open:border-primary/30 data-popup-open:bg-accent"
      >
        <Avatar className="size-7 rounded-lg">
          {user.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
            {initials(user.name)}
          </AvatarFallback>
          <AvatarBadge className="bg-success" />
        </Avatar>
        <span className="hidden min-w-0 md:block">
          <span className="block max-w-32 truncate text-xs font-semibold text-foreground">
            {user.name}
          </span>
          <span className="block text-[10px] font-medium text-muted-foreground">
            {roleLabel(user.role)}
          </span>
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="admin-theme w-72 p-2">
        <DropdownMenuLabel className="rounded-lg bg-muted/70 px-3 py-3 normal-case tracking-normal">
          <span className="flex items-center gap-3">
            <Avatar size="lg" className="rounded-xl">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{user.name}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {user.email ?? roleLabel(user.role)}
              </span>
              {user.email && (
                <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {roleLabel(user.role)}
                </span>
              )}
            </span>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuLinkItem render={<Link href="/admin" />} closeOnClick>
          <LayoutDashboard />
          Dashboard overview
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/admin/pages" />} closeOnClick>
          <FileText />
          Content pages
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/admin/faculty" />} closeOnClick>
          <GraduationCap />
          Faculty directory
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/admin/settings" />} closeOnClick>
          <Settings2 />
          Site settings
        </DropdownMenuLinkItem>
        {user.role === "SUPER_ADMIN" && (
          <DropdownMenuLinkItem render={<Link href="/admin/system/permissions" />} closeOnClick>
            <ShieldCheck />
            Roles &amp; permissions
          </DropdownMenuLinkItem>
        )}
        <DropdownMenuLinkItem
          render={<Link href="/" target="_blank" rel="noopener noreferrer" />}
          closeOnClick
        >
          <ExternalLink />
          View public website
        </DropdownMenuLinkItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          destructive
          disabled={signingOut}
          onClick={() => void handleSignOut()}
        >
          <LogOut />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
