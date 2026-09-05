"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEntityAction,
  updateEntityAction,
  deleteEntityAction,
} from "@/app/(admin)/entity-actions";
import type { EntityRecord } from "@/services/entity";
import { entityKeys } from "./keys";

type Values = Record<string, unknown>;

function useInvalidate(slug: string) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: entityKeys.resource(slug) });
}

export function useCreateEntity(slug: string) {
  const invalidate = useInvalidate(slug);

  return useMutation({
    mutationFn: async (values: Values): Promise<EntityRecord> => {
      const result = await createEntityAction(slug, values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateEntity(slug: string) {
  const invalidate = useInvalidate(slug);

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Values;
    }): Promise<EntityRecord> => {
      const result = await updateEntityAction(slug, id, values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteEntity(slug: string) {
  const invalidate = useInvalidate(slug);

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const result = await deleteEntityAction(slug, id);
      if (!result.ok) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
}
