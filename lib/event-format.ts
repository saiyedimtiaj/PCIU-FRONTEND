import type { HomeEvent } from "@/types/home";

function formatDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}

export function formatEventPublishedDate(value: string | null | undefined) {
  return formatDate(value, { dateStyle: "long" });
}

export function formatEventDateTime(
  value: string | null | undefined,
  allDay = false,
) {
  const date = formatDate(value, { dateStyle: "long" });
  if (date === "Date unavailable" || allDay) {
    return allDay && date !== "Date unavailable" ? `${date} · All day` : date;
  }

  return `${date} · ${formatDate(value, { hour: "numeric", minute: "2-digit" })}`;
}

export function getEventSummary(value: string | null | undefined) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function getEventStartTime(event: HomeEvent) {
  return formatEventDateTime(event.startDateTime, event.allDay);
}
