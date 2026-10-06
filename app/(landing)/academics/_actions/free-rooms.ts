"use server";

import { getFreeRooms, type FreeRoomQuery } from "@/lib/academics/live";
import type { FreeRoom}  from "@/types/academics";

export async function searchFreeRooms(query: FreeRoomQuery): Promise<FreeRoom[]> {
  return getFreeRooms(query);
}