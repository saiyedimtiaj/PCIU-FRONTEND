/**
 * Parses the "H:MM AM/PM" prefix of a "H:MM AM/PM – H:MM AM/PM" range string
 * (as produced by lib/academics/live.ts's formatTimeOfDay) back into minutes
 * since midnight, for chronological sorting without re-fetching raw ISO time.
 */
export function timeRangeSortKey(range: string): number {
  const match = range.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}
