/**
 * Notice dates come from the API as ISO timestamps anchored to UTC midnight
 * (`2026-10-02T00:00:00.000Z`). Formatting with the runtime's local timezone
 * can shift the day backwards, so everything here pins UTC.
 */
const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  timeZone: "UTC",
});

function parseNoticeDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatNoticeDate(
  value: string | null | undefined,
  fallback = "Date unavailable",
): string {
  const date = parseNoticeDate(value);
  return date ? fullDateFormatter.format(date) : fallback;
}

export function getNoticeDateParts(
  value: string | null | undefined,
): { day: string; month: string } | null {
  const date = parseNoticeDate(value);
  if (!date) return null;

  return {
    day: dayFormatter.format(date),
    month: monthFormatter.format(date),
  };
}
