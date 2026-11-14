"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getNavSession } from "@/app/(auth)/actions";
import type { SessionUser } from "@/types/auth";

/**
 * The signed-in user for the public site's Topbar/Navbar, fetched once per
 * page load from the browser instead of during the server render.
 *
 * Reading the session cookie while rendering the public layout made every
 * public page dynamic (and cost an uncached `/auth/me` round-trip per view).
 * Resolving it client-side lets those pages be prerendered and cached.
 *
 * `undefined` = still checking, `null` = signed out.
 */
type State = SessionUser | null | undefined;

let state: State = undefined;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

function load() {
  pending ??= getNavSession()
    .then(emit, () => emit(null))
    .finally(() => {
      pending = null;
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNavSession(): State {
  const session = useSyncExternalStore(
    subscribe,
    () => state,
    () => undefined
  );
  useEffect(() => {
    if (state === undefined) load();
  }, []);
  return session;
}

/** Call after logging out so both the Topbar and Navbar flip immediately. */
export function clearNavSession() {
  emit(null);
}
