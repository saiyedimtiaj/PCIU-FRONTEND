"use client";

import { useQuery } from "@tanstack/react-query";
import { listEntityAction, getEntityAction } from "@/app/(admin)/entity-actions";
import type { EntityRecord } from "@/services/entity";
import { entityKeys } from "./keys";

export function useEntityList(
  slug: string,
  params?: Record<string, string | number | undefined>,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: entityKeys.list(slug, params),
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<EntityRecord[]> => {
      const result = await listEntityAction(slug, params);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useEntityById(
  slug: string,
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: entityKeys.detail(slug, id ?? ""),
    enabled: (options?.enabled ?? true) && !!id,
    queryFn: async (): Promise<EntityRecord | null> => {
      const result = await getEntityAction(slug, id!);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}
