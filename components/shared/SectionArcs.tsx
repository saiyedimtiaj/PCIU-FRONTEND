import { useId } from "react";
import { cn } from "@/lib/utils";

const STATIC_ARCS = [
  { d: "M20 6 Q410 82 800 6", stroke: "hsl(42 85% 58%)", width: 0.9, opacity: 0.42 },
  { d: "M10 18 Q410 94 810 18", stroke: "hsl(230 70% 50%)", width: 0.9, opacity: 0.24 },
  { d: "M28 30 Q410 102 792 30", stroke: "hsl(42 85% 72%)", width: 0.9, opacity: 0.38 },
  { d: "M45 42 Q410 108 775 42", stroke: "hsl(231 77% 22%)", width: 0.9, opacity: 0.16 },
  { d: "M36 12 Q410 76 784 12", stroke: "hsl(230 70% 50%)", width: 0.7, opacity: 0.18 },
  { d: "M18 26 Q410 100 802 26", stroke: "hsl(42 85% 58%)", width: 0.7, opacity: 0.25 },
  { d: "M54 38 Q410 106 766 38", stroke: "hsl(42 85% 72%)", width: 0.7, opacity: 0.22 },
  { d: "M68 50 Q410 110 752 50", stroke: "hsl(231 77% 22%)", width: 0.7, opacity: 0.12 },
];

const MOVING_ARCS = [
  { d: "M20 6 Q410 82 800 6", tone: "accent", reverse: false, delay: "0s", width: 1.8 },
  { d: "M28 30 Q410 102 792 30", tone: "secondary", reverse: true, delay: "-1.6s", width: 1.6 },
  { d: "M54 38 Q410 106 766 38", tone: "accent", reverse: false, delay: "-1.75s", width: 1.5 },
  { d: "M68 50 Q410 110 752 50", tone: "secondary", reverse: true, delay: "-0.9s", width: 1.4 },
] as const;

/**
 * The homepage's brand-coloured arcs with travelling highlights, for behind
 * a centred section heading. The parent must be `relative`; ids are unique
 * per instance so several can share a page.
 */
export default function SectionArcs({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 h-24 w-[min(820px,90vw)] -translate-x-1/2",
        className
      )}
    >
      <svg className="h-full w-full" viewBox="0 0 820 110" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${id}-fade`}>
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="12%" stopColor="white" />
            <stop offset="88%" stopColor="white" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {(["accent", "secondary"] as const).map((tone) => (
            <linearGradient
              key={tone}
              id={`${id}-${tone}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="820"
              y2="0"
            >
              <stop offset="0%" stopColor={`var(--${tone})`} stopOpacity="0" />
              <stop offset="50%" stopColor={`var(--${tone})`} />
              <stop offset="100%" stopColor={`var(--${tone})`} stopOpacity="0" />
            </linearGradient>
          ))}
          <mask id={`${id}-mask`}>
            <rect width="820" height="110" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          {STATIC_ARCS.map((arc) => (
            <path
              key={arc.d + arc.stroke}
              d={arc.d}
              stroke={arc.stroke}
              strokeWidth={arc.width}
              strokeLinecap="round"
              opacity={arc.opacity}
            />
          ))}
          {MOVING_ARCS.map((arc) => (
            <path
              key={`moving-${arc.d}`}
              className={arc.reverse ? "animate-arc-highlight-reverse" : "animate-arc-highlight"}
              style={{ animationDelay: arc.delay }}
              d={arc.d}
              stroke={`url(#${id}-${arc.tone})`}
              strokeWidth={arc.width}
              strokeLinecap="round"
              strokeDasharray="42 858"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
