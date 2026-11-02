"use server";

import { api, ApiError } from "@/services/http";
import { getSession } from "@/app/(auth)/actions";
import { isAdminRole } from "@/lib/auth-guards";
import { getClassTimeSlotOptions, getFreeRooms } from "@/lib/academics/live";
import type { FreeRoom } from "@/types/academics";
import type { ActionResult } from "./entity-actions";

type Dict = Record<string, unknown>;

export interface BookableSlot {
  id: number;
  time: string;
  /** Rooms with no class and no active booking in this slot on the date. */
  rooms: FreeRoom[];
}

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

/** "2026-10-25" → "SUNDAY" — parsed as a calendar date, no timezone drift. */
function weekdayOf(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** A booking the API still counts — anything not marked cancelled. */
function isActiveBooking(row: Dict): boolean {
  const status = typeof row.status === "string" ? row.status.toUpperCase() : "";
  if (status === "CANCELLED" || status === "CANCELED") return false;
  if (row.isCancelled === true || row.cancelledAt) return false;
  return true;
}

function rowsOf(data: unknown): Dict[] {
  if (Array.isArray(data)) return data as Dict[];
  if (data && typeof data === "object") {
    const list = Object.values(data as Dict).find(Array.isArray);
    if (list) return list as Dict[];
  }
  return [];
}

async function requireAdmin(): Promise<string | null> {
  const user = await getSession();
  return user && isAdminRole(user.role) ? null : "Your session has expired. Please sign in again.";
}

/**
 * Every class time slot on `date` with the rooms still bookable in it:
 * the API's free rooms for that weekday + slot (no class scheduled there),
 * minus rooms already booked on that exact date and slot.
 */
export async function getBookableSlotsAction(date: string): Promise<ActionResult<BookableSlot[]>> {
  const problem = await requireAdmin();
  if (problem) return { ok: false, error: problem };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "Pick a valid date." };

  try {
    const day = weekdayOf(date);
    const [slots, bookings] = await Promise.all([
      getClassTimeSlotOptions(),
      api.get<unknown>("/room-bookings").then(rowsOf),
    ]);

    const taken = new Set(
      bookings
        .filter((b) => isActiveBooking(b) && String(b.date ?? "").slice(0, 10) === date)
        .map((b) => `${b.roomId}-${b.timeSlotId}`),
    );

    const freeBySlot = await Promise.all(slots.map((s) => getFreeRooms({ day, timeSlotId: s.id })));

    return {
      ok: true,
      data: slots.map((slot, i) => ({
        id: slot.id,
        time: slot.time,
        rooms: freeBySlot[i].filter((room) => !taken.has(`${room.id}-${slot.id}`)),
      })),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not load free rooms.",
      status: error instanceof ApiError ? error.status : undefined,
    };
  }
}

/** PATCH /room-bookings/{id}/cancel — frees the room/slot again. */
export async function cancelRoomBookingAction(id: string): Promise<ActionResult<null>> {
  const problem = await requireAdmin();
  if (problem) return { ok: false, error: problem };
  try {
    await api.patch(`/room-bookings/${encodeURIComponent(id)}/cancel`, {});
    return { ok: true, data: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not cancel this booking.",
      status: error instanceof ApiError ? error.status : undefined,
    };
  }
}
