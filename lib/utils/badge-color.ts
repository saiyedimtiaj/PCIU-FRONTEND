/**
 * Maps an arbitrary API color string (e.g. "green", "red") to a fixed,
 * on-brand set of Tailwind classes. Unknown/missing colors fall back to a
 * neutral style so the UI never breaks or introduces random hues.
 */
const BADGE_COLOR_MAP: Record<string, string> = {
  green: "border-emerald-300/40 bg-emerald-500/20 text-white",
  red: "border-red-300/40 bg-red-500/20 text-white",
  yellow: "border-amber-300/40 bg-amber-500/20 text-white",
  blue: "border-sky-300/40 bg-sky-500/20 text-white",
};

const DEFAULT_BADGE_CLASSES = "border-white/30 bg-white/10 text-white";

export function getBadgeColorClasses(color?: string | null): string {
  if (!color) return DEFAULT_BADGE_CLASSES;
  return BADGE_COLOR_MAP[color.toLowerCase()] ?? DEFAULT_BADGE_CLASSES;
}