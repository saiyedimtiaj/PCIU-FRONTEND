"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Search, X } from "lucide-react";
import {
  listPermissionsAction,
  updatePermissionAction,
  createPermissionAction,
  type PermissionRow,
} from "@/app/(admin)/entity-actions-permissions";
import {
  ADMIN_ROLES,
  PERMISSION_ACTIONS,
  knownResources,
  modulesByResource,
  type PermissionAction,
} from "@/lib/admin/permissions";
import { getEntitySchema } from "@/lib/admin/entities";
import PageHeader from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToastManager } from "@/components/ui/toast";
import { Alert } from "@/components/shared/Aleart";
import EmptyState from "@/components/shared/EmptyState";

/** A role/resource pair with no row yet — shown unchecked, created on first tick. */
type MatrixRow = PermissionRow & { missing?: boolean };

/** Same prefix `useAccess()` lives under, so a change here re-gates the sidebar too. */
const PERMISSION_KEY = ["permissions"] as const;

function prettyResource(resource: string) {
  return resource
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PermissionsMatrix() {
  const queryClient = useQueryClient();
  const toast = useToastManager();
  const [role, setRole] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [savingCell, setSavingCell] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...PERMISSION_KEY, "all"],
    queryFn: async () => {
      const result = await listPermissionsAction();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: PERMISSION_KEY });

  const updatePermission = useMutation({
    mutationFn: async (row: PermissionRow) => {
      const result = await updatePermissionAction(row);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });

  const createPermission = useMutation({
    mutationFn: async (values: Omit<PermissionRow, "id">) => {
      const result = await createPermissionAction(values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });

  // Every admin role gets a tab even before it has a single row.
  const roles = useMemo(
    () => Array.from(new Set<string>([...ADMIN_ROLES, ...(data ?? []).map((r) => r.role)])),
    [data],
  );
  const activeRole = role ?? roles[0] ?? null;

  const resources = useMemo(() => knownResources(data ?? []), [data]);

  // Which admin modules each resource controls, as display titles.
  const moduleTitles = useMemo(() => {
    const byResource = modulesByResource(new Set(resources));
    const out = new Map<string, string[]>();
    for (const [resource, slugs] of byResource) {
      out.set(
        resource,
        slugs.map((slug) => getEntitySchema(slug)?.title ?? slug),
      );
    }
    return out;
  }, [resources]);

  // One row per known resource for the active role — real rows where they
  // exist, placeholders where the role has nothing configured yet.
  const rows = useMemo<MatrixRow[]>(() => {
    if (!activeRole) return [];
    const forRole = new Map(
      (data ?? []).filter((r) => r.role === activeRole).map((r) => [r.resource, r]),
    );
    const all = resources.map(
      (resource): MatrixRow =>
        forRole.get(resource) ?? {
          id: -1,
          role: activeRole,
          resource,
          view: false,
          create: false,
          edit: false,
          delete: false,
          missing: true,
        },
    );
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (r) =>
        prettyResource(r.resource).toLowerCase().includes(q) ||
        (moduleTitles.get(r.resource) ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [data, activeRole, resources, query, moduleTitles]);

  const missingCount = useMemo(
    () =>
      activeRole
        ? resources.filter((res) => !(data ?? []).some((r) => r.role === activeRole && r.resource === res)).length
        : 0,
    [data, activeRole, resources],
  );

  async function toggle(row: MatrixRow, action: PermissionAction, next: boolean) {
    const cell = `${row.role}-${row.resource}-${action}`;
    setSavingCell(cell);
    try {
      if (row.missing) {
        // No row yet: create it with just this flag set.
        await createPermission.mutateAsync({
          role: row.role,
          resource: row.resource,
          view: false,
          create: false,
          edit: false,
          delete: false,
          [action]: next,
        });
      } else {
        await updatePermission.mutateAsync({ ...row, [action]: next });
      }
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not update this permission",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSavingCell(null);
    }
  }

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title="Permissions"
        description="Control what each role can see and change across the dashboard. A role sees a module in the sidebar only with View; Create, Edit and Delete show or hide those buttons."
        icon={ShieldCheck}
      />

      {isError && (
        <Alert
          variant="error"
          message={
            error instanceof Error
              ? `Could not load permissions: ${error.message}`
              : "Could not load permissions."
          }
        />
      )}

      {isLoading ? (
        <Card className="space-y-3 p-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </Card>
      ) : (
        !isError && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              {activeRole && (
                <Tabs value={activeRole} onValueChange={(value) => setRole(value as string)} variant="pill">
                  <TabsList>
                    {roles.map((r) => (
                      <TabsTrigger key={r} value={r}>
                        {prettyResource(r)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}

              <div className="relative ml-auto w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search resources or modules..."
                  className="pl-9"
                />
              </div>

              {query && (
                <Button variant="ghost" size="admin" onClick={() => setQuery("")}>
                  <X className="size-4" />
                  Clear
                </Button>
              )}
            </div>

            {missingCount > 0 && activeRole && (
              <Alert
                variant="info"
                message={`${prettyResource(activeRole)} has no permission set for ${missingCount} resource${missingCount === 1 ? "" : "s"} (marked "Not set") — it can't use those modules until you tick a box.`}
              />
            )}

            <Card className="overflow-hidden">
              {rows.length === 0 ? (
                <EmptyState title="No resources match" description="Try a different search term." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Resource
                        </th>
                        {PERMISSION_ACTIONS.map((action) => (
                          <th
                            key={action}
                            className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                          >
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((row) => {
                        const modules = moduleTitles.get(row.resource) ?? [];
                        return (
                          <tr key={row.resource} className="transition-colors hover:bg-muted/30">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                {prettyResource(row.resource)}
                                {row.missing && <Badge variant="warning">Not set</Badge>}
                              </div>
                              {modules.length > 0 && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {modules.join(", ")}
                                </p>
                              )}
                            </td>
                            {PERMISSION_ACTIONS.map((action) => (
                              <td key={action} className="px-5 py-3 text-center">
                                <span className="inline-flex items-center justify-center">
                                  <Checkbox
                                    checked={row[action]}
                                    disabled={savingCell === `${row.role}-${row.resource}-${action}`}
                                    onCheckedChange={(next) => toggle(row, action, next === true)}
                                    aria-label={`${action} ${prettyResource(row.resource)}`}
                                  />
                                </span>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )
      )}
    </div>
  );
}
