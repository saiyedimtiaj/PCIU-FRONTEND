"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { ToastProvider, Toaster } from "@/components/ui/toast";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="admin-theme flex min-h-screen w-full bg-background text-foreground">
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            onOpenMobileNav={() => setMobileOpen(true)}
          />
          <main className="min-w-0 flex-1 bg-muted/30">{children}</main>
        </div>
      </div>
      <Toaster />
    </ToastProvider>
  );
}
