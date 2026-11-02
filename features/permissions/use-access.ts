"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyAccessAction } from "@/app/(admin)/entity-actions-permissions";
import { can, SUPER_ADMIN, type Access, type PermissionAction } from "@/lib/admin/permissions";

/**
 * Under the same ["permissions"] prefix the matrix page invalidates, so
 * toggling a checkbox there updates the sidebar and buttons straight away.
 */
export const MY_ACCESS_KEY = ["permissions", "me"] as const;

/** What the signed-in admin's role may do, per module slug. */
export function useAccess() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: MY_ACCESS_KEY,
    queryFn: () => getMyAccessAction(),
    // Access can mean probing every module (see getMyAccessAction), so it's
    // fetched once per few minutes, not per page.
    staleTime: 5 * 60_000,
  });

  const check = useCallback(
    (slug: string, action: PermissionAction) => can(data, slug, action),
    [data],
  );

  /**
   * Record a module the API just refused (403) so the sidebar and buttons
   * hide it right away. Only matters when the role can't read the matrix —
   * with matrix rows, `can()` already knows.
   */
  const markDenied = useCallback(
    (slug: string) => {
      queryClient.setQueryData<Access>(MY_ACCESS_KEY, (prev) => {
        if (!prev || prev.rows || prev.role === SUPER_ADMIN) return prev;
        const denied = prev.denied ?? [];
        return denied.includes(slug) ? prev : { ...prev, denied: [...denied, slug] };
      });
    },
    [queryClient],
  );

  const role = data?.role ?? null;
  return {
    can: check,
    ready: !isLoading,
    role,
    isSuperAdmin: role === SUPER_ADMIN,
    markDenied,
  };
}
