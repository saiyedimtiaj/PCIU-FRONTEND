"use client";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyAccessAction } from "@/app/(admin)/entity-actions-permissions";
import { can, type PermissionAction } from "@/lib/admin/permissions";

/**
 * Under the same ["permissions"] prefix the matrix page invalidates, so
 * toggling a checkbox there updates the sidebar and buttons straight away.
 */
export const MY_ACCESS_KEY = ["permissions", "me"] as const;

/** What the signed-in admin's role may do, per module slug. */
export function useAccess() {
  const { data, isLoading } = useQuery({
    queryKey: MY_ACCESS_KEY,
    queryFn: () => getMyAccessAction(),
    staleTime: 60_000,
  });

  const check = useCallback(
    (slug: string, action: PermissionAction) => can(data, slug, action),
    [data],
  );

  return { can: check, ready: !isLoading, role: data?.role ?? null };
}
