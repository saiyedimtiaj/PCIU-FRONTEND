"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, DoorOpen, Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import AccessDenied from "@/components/admin/AccessDenied";
import RequirePermission from "@/components/admin/RequirePermission";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable";
import EmptyState from "@/components/shared/EmptyState";
import { Alert, AlertDialog } from "@/components/shared/Aleart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToastManager } from "@/components/ui/toast";
import { useAccess } from "@/features/permissions/use-access";
import { entityKeys, isForbidden, useDeleteEntity, useEntityList } from "@/features/entity";
import { cancelRoomBookingAction } from "@/app/(admin)/room-booking-actions";
import type { EntityRecord } from "@/services/entity";

const SLUG = "room-bookings";
const PAGE_SIZE = 10;

type StatusFilter = "upcoming" | "all" | "cancelled";

const str = (value: unknown) => (typeof value === "string" ? value : value == null ? "" : String(value));

function isCancelled(row: EntityRecord): boolean {
  const status = str(row.status).toUpperCase();
  return status === "CANCELLED" || status === "CANCELED" || row.isCancelled === true || !!row.cancelledAt;
}

/** The joined room as "Building D · 101", falling back to the bare id. */
function roomLabel(row: EntityRecord): string {
  const room = (row.room ?? {}) as Record<string, unknown>;
  const building = (room.building ?? {}) as Record<string, unknown>;
  const name = str(room.name);
  if (!name) return row.room_id ? `Room #${row.room_id}` : "—";
  return building.name ? `Building ${str(building.name)} · ${name}` : name;
}

function slotLabel(row: EntityRecord): string {
  const slot = (row.timeSlot ?? row.time_slot ?? {}) as Record<string, unknown>;
  const formatted = str(slot.timeSlotString);
  if (formatted) return formatted;
  const start = str(slot.startTimeFormatted);
  const end = str(slot.endTimeFormatted);
  return start && end ? `${start} – ${end}` : row.time_slot_id ? `Slot #${row.time_slot_id}` : "—";
}

/** "2026-10-25" → "25 Oct 2026", pure string work (no timezone shifts). */
function dateLabel(value: unknown): string {
  const iso = str(value).slice(0, 10);
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return y && m && d ? `${Number(d)} ${months[Number(m) - 1] ?? m} ${y}` : "—";
}

function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function RoomBookingsList() {
  return (
    <RequirePermission slug={SLUG} action="view" label="room bookings">
      <RoomBookingsListInner />
    </RequirePermission>
  );
}

function RoomBookingsListInner() {
  const access = useAccess();
  const toast = useToastManager();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useEntityList(SLUG);
  const deleteBooking = useDeleteEntity(SLUG);

  const [status, setStatus] = useState<StatusFilter>("upcoming");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<EntityRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntityRecord | null>(null);
  const [busy, setBusy] = useState(false);

  const canCreate = access.can(SLUG, "create");
  const canCancel = access.can(SLUG, "edit");
  const canDelete = access.can(SLUG, "delete");

  const rows = useMemo(() => {
    const today = todayIso();
    const q = query.trim().toLowerCase();
    return (data ?? [])
      .filter((row) => {
        if (status === "cancelled") return isCancelled(row);
        if (status === "upcoming") return !isCancelled(row) && str(row.date).slice(0, 10) >= today;
        return true;
      })
      .filter((row) =>
        !q
          ? true
          : [row.purpose, row.booked_by, row.contact_email, roomLabel(row)]
              .map((v) => str(v).toLowerCase())
              .some((v) => v.includes(q)),
      )
      .sort((a, b) => str(a.date).localeCompare(str(b.date)));
  }, [data, status, query]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (isForbidden(error)) {
    return <AccessDenied title="You don't have access to Room Bookings" />;
  }

  async function confirmCancel() {
    if (!cancelTarget) return;
    setBusy(true);
    const result = await cancelRoomBookingAction(cancelTarget.__id);
    setBusy(false);
    if (result.ok) {
      toast.add({ type: "success", title: "Booking cancelled", description: "The room is free for that slot again." });
      queryClient.invalidateQueries({ queryKey: entityKeys.resource(SLUG) });
      setCancelTarget(null);
    } else {
      toast.add({ type: "error", title: "Could not cancel this booking", description: result.error });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteBooking.mutateAsync(deleteTarget.__id);
      toast.add({ type: "success", title: "Booking deleted" });
      setDeleteTarget(null);
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not delete this booking",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  const columns: DataTableColumn<EntityRecord>[] = [
    {
      key: "date",
      header: "Date & Time",
      cell: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">{dateLabel(row.date)}</p>
          <p className="text-xs text-muted-foreground">{slotLabel(row)}</p>
        </div>
      ),
    },
    {
      key: "room",
      header: "Room",
      cell: (row) => <span className="text-sm text-foreground">{roomLabel(row)}</span>,
    },
    {
      key: "purpose",
      header: "Purpose",
      hideBelow: "md",
      cell: (row) => <span className="line-clamp-2 text-sm text-foreground">{str(row.purpose) || "—"}</span>,
    },
    {
      key: "booked_by",
      header: "Booked By",
      hideBelow: "lg",
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{str(row.booked_by) || "—"}</p>
          {row.contact_email ? (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="size-3" /> {str(row.contact_email)}
            </p>
          ) : null}
          {row.contact_phone ? (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" /> {str(row.contact_phone)}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) =>
        isCancelled(row) ? <Badge variant="muted">Cancelled</Badge> : <Badge variant="success">Booked</Badge>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {canCancel && !isCancelled(row) && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-warning-foreground hover:bg-warning-light"
              onClick={() => setCancelTarget(row)}
              aria-label="Cancel booking"
              title="Cancel booking"
            >
              <Ban className="size-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteTarget(row)}
              aria-label="Delete booking"
              title="Delete booking"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 px-4 pt-6 pb-10">
      <PageHeader
        title="Room Bookings"
        description="Rooms booked for one-off use — makeup classes, workshops, club events."
        icon={DoorOpen}
        actions={
          canCreate ? (
            <Button
              variant="highlight"
              size="admin"
              render={<Link href="/admin/scheduling/room-bookings/new" />}
              nativeButton={false}
            >
              <Plus className="size-4" />
              Book a Room
            </Button>
          ) : undefined
        }
      />

      {error && !isForbidden(error) && (
        <Alert
          variant="error"
          message={`Could not load room bookings: ${error instanceof Error ? error.message : "please try again."}`}
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value as StatusFilter);
            setPage(1);
          }}
          variant="pill"
        >
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search purpose, name, room..."
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pageRows}
        rowKey={(row) => row.__id}
        isLoading={isLoading}
        entityLabel="bookings"
        onPageChange={setPage}
        pagination={{ page: currentPage, totalPages, total: rows.length, limit: PAGE_SIZE }}
        emptyState={
          <EmptyState
            title={status === "cancelled" ? "No cancelled bookings" : "No room bookings yet"}
            description={canCreate ? "Book a free room to see it here." : undefined}
          />
        }
      />

      <AlertDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel this booking?"
        description={
          cancelTarget
            ? `${roomLabel(cancelTarget)} on ${dateLabel(cancelTarget.date)} (${slotLabel(cancelTarget)}) becomes free again.`
            : ""
        }
        confirmLabel="Cancel booking"
        cancelLabel="Keep it"
        loading={busy}
        onConfirm={confirmCancel}
      />
      <AlertDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this booking?"
        description="This removes the booking record permanently."
        confirmLabel="Delete"
        variant="danger"
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
