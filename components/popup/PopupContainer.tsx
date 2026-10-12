"use client";

import { useState, useSyncExternalStore } from "react";
import PopupCard from "@/components/popup/PopupCard";
import type { Popup } from "@/types/popup";

const DISMISSED_KEY = "pciu-popup-session-dismissed";
const COMPLETED_KEY = "pciu-popup-session-completed";
const SESSION_CHANGE_EVENT = "pciu-popup-session-change";
let checkedReloadForPage = false;

interface SessionSnapshot {
  dismissed: boolean;
  completedIds: number[];
}

function getSessionSnapshot(): string {
  try {
    const storedIds = sessionStorage.getItem(COMPLETED_KEY);
    const parsedIds: unknown = storedIds ? JSON.parse(storedIds) : [];
    const completedIds = Array.isArray(parsedIds)
      ? parsedIds.filter((id): id is number => typeof id === "number")
      : [];
    return JSON.stringify({
      dismissed: sessionStorage.getItem(DISMISSED_KEY) === "true",
      completedIds,
    });
  } catch {
    return JSON.stringify({ dismissed: false, completedIds: [] });
  }
}

function subscribeToSession(callback: () => void) {
  if (!checkedReloadForPage) {
    try {
      const navigation = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (navigation?.type === "reload") {
        sessionStorage.removeItem(DISMISSED_KEY);
        sessionStorage.removeItem(COMPLETED_KEY);
      }
    } catch {
      checkedReloadForPage = true;
    }
    checkedReloadForPage = true;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_CHANGE_EVENT, callback);
  };
}

function saveSessionProgress(completedIds: number[], dismissed: boolean) {
  try {
    sessionStorage.setItem(COMPLETED_KEY, JSON.stringify(completedIds));
    if (dismissed) sessionStorage.setItem(DISMISSED_KEY, "true");
  } catch {
    return;
  }
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

function orderPopups(popups: Popup[]): Popup[] {
  return popups
    .map((popup, index) => ({ popup, index }))
    .filter(({ popup }) => popup.status === true)
    .sort((left, right) => {
      const priority =
        (left.popup.type === "VIDEO" ? 0 : 1) -
        (right.popup.type === "VIDEO" ? 0 : 1);
      if (priority !== 0) return priority;

      const leftUpdated = new Date(left.popup.updatedAt).getTime() || 0;
      const rightUpdated = new Date(right.popup.updatedAt).getTime() || 0;
      if (leftUpdated !== rightUpdated) return rightUpdated - leftUpdated;

      const idOrder = String(left.popup.id).localeCompare(
        String(right.popup.id),
        undefined,
        { numeric: true },
      );
      return idOrder || left.index - right.index;
    })
    .map(({ popup }) => popup);
}

export default function PopupContainer({ popups }: { popups: Popup[] }) {
  const snapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => null,
  );
  const session = snapshot ? (JSON.parse(snapshot) as SessionSnapshot) : null;
  const [localCompletedIds, setLocalCompletedIds] = useState<number[]>([]);
  const [locallyDismissed, setLocallyDismissed] = useState(false);
  const completedIds = [
    ...new Set([...(session?.completedIds ?? []), ...localCompletedIds]),
  ];
  const orderedPopups = orderPopups(popups);
  const currentPopup = orderedPopups.find(
    (popup) => !completedIds.includes(popup.id),
  );

  function advanceSequence() {
    if (!currentPopup || completedIds.includes(currentPopup.id)) return;

    const nextCompletedIds = [...completedIds, currentPopup.id];
    setLocalCompletedIds(nextCompletedIds);

    const hasNextPopup = orderedPopups.some(
      (popup) => !nextCompletedIds.includes(popup.id),
    );
    if (!hasNextPopup) setLocallyDismissed(true);
    saveSessionProgress(nextCompletedIds, !hasNextPopup);
  }

  if (!session || session.dismissed || locallyDismissed || !currentPopup) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-60 flex justify-end px-4 sm:px-6"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)" }}
    >
      <div className="pointer-events-auto">
        <PopupCard
          key={`${currentPopup.type}-${currentPopup.id}`}
          popup={currentPopup}
          onAdvance={advanceSequence}
        />
      </div>
    </div>
  );
}
