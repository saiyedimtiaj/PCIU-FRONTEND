"use client";

import type { ReactNode } from "react";
import { ShieldOff } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccess } from "@/features/permissions/use-access";
import type { PermissionAction } from "@/lib/admin/permissions";

const VERB: Record<PermissionAction, string> = {
  view: "view",
  create: "add",
  edit: "edit",
  delete: "delete",
};

/**
 * Renders `children` only when the signed-in role may `action` the module
 * `slug` (per the /permissions matrix); otherwise a "no access" panel. The
 * API enforces the same rule — this just stops the page from rendering a
 * form or table whose every request would come back 403.
 */
export default function RequirePermission({
  slug,
  action,
  label,
  children,
}: {
  slug: string;
  action: PermissionAction;
  /** What to call the module in the message, e.g. "Teachers". */
  label?: string;
  children: ReactNode;
}) {
  const access = useAccess();

  if (!access.ready) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!access.can(slug, action)) {
    return (
      <div className="p-6">
        <EmptyState
          variant="icon"
          icon={<ShieldOff className="size-6" />}
          title="You don't have access to this"
          description={`Your role isn't allowed to ${VERB[action]} ${label ?? "this section"}. Ask a super admin to update your permissions.`}
        />
      </div>
    );
  }

  return <>{children}</>;
}
