import { cn } from "@/lib/utils";

/**
 * Animated dashed outline shared by the marketing cards that need a premium
 * "traveling light" border (department programs, faculty departments).
 *
 * The parent card must be `relative` with `overflow-hidden` and carry the
 * `group` class — the hover glow on the outline is driven by `group-hover`.
 * `id` only needs to be unique on the page; it namespaces the SVG gradient.
 */
export function ChaseBorder({
  id,
  className,
}: {
  id: string | number;
  className?: string;
}) {
  const gradientId = `chase-gradient-${id}`;

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
        className,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="40%" stopColor="#0ea5e9" />
          <stop offset="70%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect
        x="0.6"
        y="0.6"
        width="98.8"
        height="98.8"
        rx="3"
        ry="3"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="25 75"
        className="animate-border-chase opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_rgba(14,165,233,0.5)]"
      />
    </svg>
  );
}
