"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Search, X, Plus } from "lucide-react";
import {
  listPermissionsAction,
  updatePermissionAction,
  createPermissionAction,
  type PermissionRow,
} from "@/app/(admin)/entity-actions-permissions";
import PageHeader from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useToastManager } from "@/components/ui/toast";
import { Alert } from "@/components/shared/Aleart";
import { Modal } from "@/components/shared/Modal";
import EmptyState from "@/components/shared/EmptyState";


const ALL_RESOURCES = [
  "ACTIVITY", "ADMISSION_ADVERTISEMENT", "ADMISSION_SCHEDULE", "ADMISSION_TEST_RESULT",
  "AWARD", "BATCH", "BUILDING", "CLASS_ROUTINE", "CONTACT", "COURSE", "DEPARTMENT",
  "EDUCATION", "EVENT", "EXAM", "EXAM_ROUTINE", "EXPERIENCE", "FACULTY", "FAQ",
  "FEE_STRUCTURE", "GALLERY", "HERO_SLIDE", "IQAC", "IQAC_COMMITTEE", "LAB_FACILITY",
  "MANAGEMENT", "MBA_ELIGIBILITY_TIER", "MEMBERSHIP", "MENU", "MOU", "NEWS_ARTICLE",
  "NOTICE", "PAGE", "PARTNER", "PCJ_ARTICLE", "PCJ_VOLUME", "POPUP", "PROGRAM",
  "RESEARCH_AREA", "RESEARCH_CENTRE", "RESEARCH_PUBLICATION", "ROOM", "SECTION",
  "SEMESTER", "SEMINAR", "SETTING", "TEACHER", "TIME_SLOT", "USER",
] as const;

const ACTIONS = ["view", "create", "edit", "delete"] as const;
type Action = (typeof ACTIONS)[number];

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
    queryKey: PERMISSION_KEY,
    queryFn: async () => {
      const result = await listPermissionsAction();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });

  const updatePermission = useMutation({
    mutationFn: async (row: PermissionRow) => {
      const result = await updatePermissionAction(row);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PERMISSION_KEY }),
  });

  const createPermission = useMutation({
    mutationFn: async (values: Omit<PermissionRow, "id">) => {
      const result = await createPermissionAction(values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PERMISSION_KEY }),
  });

  const roles = useMemo(
    () => Array.from(new Set((data ?? []).map((r) => r.role))),
    [data],
  );
  const activeRole = role ?? roles[0] ?? null;

  const rows = useMemo(() => {
    const forRole = (data ?? []).filter((r) => r.role === activeRole);
    const q = query.trim().toLowerCase();
    const filtered = q
      ? forRole.filter((r) => r.resource.toLowerCase().includes(q))
      : forRole;
    return [...filtered].sort((a, b) => a.resource.localeCompare(b.resource));
  }, [data, activeRole, query]);

  // A role doesn't have a row for every resource yet (MODERATOR has 14 of
  // 48) — these are the ones the Add dialog can offer for the active role.
  const missingResources = useMemo(() => {
    const have = new Set((data ?? []).filter((r) => r.role === activeRole).map((r) => r.resource));
    return ALL_RESOURCES.filter((r) => !have.has(r));
  }, [data, activeRole]);

  const [addOpen, setAddOpen] = useState(false);
  const [newResource, setNewResource] = useState<string>("");
  const [newFlags, setNewFlags] = useState<Record<Action, boolean>>({
    view: true,
    create: false,
    edit: false,
    delete: false,
  });

  function openAddDialog() {
    setNewResource(missingResources[0] ?? "");
    setNewFlags({ view: true, create: false, edit: false, delete: false });
    setAddOpen(true);
  }

  async function toggle(row: PermissionRow, action: Action, next: boolean) {
    const cell = `${row.id}-${action}`;
    setSavingCell(cell);
    try {
      await updatePermission.mutateAsync({ ...row, [action]: next });
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

  async function submitAdd() {
    if (!activeRole || !newResource) return;
    try {
      await createPermission.mutateAsync({
        role: activeRole,
        resource: newResource,
        ...newFlags,
      });
      toast.add({
        type: "success",
        title: "Permission added",
        description: `${prettyResource(newResource)} added for ${prettyResource(activeRole)}.`,
      });
      setAddOpen(false);
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not add this permission",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title="Permissions"
        description="Control what each role can see and change across the dashboard."
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
        <Card>
          <CardContent className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {roles.length > 0 && activeRole && (
              <Tabs
                value={activeRole}
                onValueChange={(value) => setRole(value as string)}
                variant="pill"
              >
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
                placeholder="Search resources..."
                className="pl-9"
              />
            </div>

            {query && (
              <Button variant="ghost" size="admin" onClick={() => setQuery("")}>
                <X className="size-4" />
                Clear
              </Button>
            )}

            <Button
              variant="highlight"
              size="admin"
              onClick={openAddDialog}
              disabled={!activeRole || missingResources.length === 0}
              title={
                missingResources.length === 0
                  ? `${activeRole ? prettyResource(activeRole) : "This role"} already has every resource.`
                  : undefined
              }
            >
              <Plus className="size-4" />
              Add Permission
            </Button>
          </div>

          <Card className="overflow-hidden">
            {rows.length === 0 ? (
              <EmptyState
                title="No resources match"
                description="Try a different search term."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Resource
                      </th>
                      {ACTIONS.map((action) => (
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
                    {rows.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-3 text-sm font-medium text-foreground">
                          {prettyResource(row.resource)}
                        </td>
                        {ACTIONS.map((action) => (
                          <td key={action} className="px-5 py-3 text-center">
                            <span className="inline-flex items-center justify-center">
                              <Checkbox
                                checked={row[action]}
                                disabled={savingCell === `${row.id}-${action}`}
                                onCheckedChange={(next) =>
                                  toggle(row, action, next === true)
                                }
                                aria-label={`${action} ${prettyResource(row.resource)}`}
                              />
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add permission"
        description={
          activeRole
            ? `Give ${prettyResource(activeRole)} access to a resource it doesn't have yet.`
            : undefined
        }
        loading={createPermission.isPending}
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={createPermission.isPending}>
              Cancel
            </Button>
            <Button
              variant="highlight"
              onClick={submitAdd}
              disabled={!newResource || createPermission.isPending}
              loading={createPermission.isPending}
            >
              Add Permission
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="permission-resource">Resource</Label>
            <Select
              items={missingResources.map((r) => ({ label: prettyResource(r), value: r }))}
              value={newResource}
              onValueChange={(value) => setNewResource(value ?? "")}
            >
              <SelectTrigger id="permission-resource">
                <SelectValue placeholder="Select a resource" />
              </SelectTrigger>
              <SelectContent>
                {missingResources.map((r) => (
                  <SelectItem key={r} value={r}>
                    {prettyResource(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-3">
              {ACTIONS.map((action) => (
                <label
                  key={action}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm capitalize transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    checked={newFlags[action]}
                    onCheckedChange={(next) =>
                      setNewFlags((prev) => ({ ...prev, [action]: next === true }))
                    }
                  />
                  {action}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
