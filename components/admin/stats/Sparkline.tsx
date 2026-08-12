import { cn } from "@/lib/utils";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  variant?: "line" | "area" | "bars";
  tone?: "primary" | "success" | "warning" | "info";
  className?: string;
}

// Static Record — same reasoning as StatCard's TONES: Tailwind can't see a
// templated `text-${tone}` class, so the mapping must be literal strings.
const TONE_CLASS: Record<NonNullable<SparklineProps["tone"]>, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

/**
 * Minimal inline-SVG sparkline — no charting dependency. Coordinates are
 * rounded to 2 decimal places so the server-rendered and client-rendered
 * markup are byte-identical; without that, floating-point differences
 * between the Node and browser math can trip a React hydration mismatch.
 * `data` must be static/deterministic content (see components/admin/list
 * sample-data generator) for the same reason.
 */
export default function Sparkline({
  data,
  width = 120,
  height = 32,
  variant = "line",
  tone = "primary",
  className,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
  });

  if (variant === "bars") {
    const barWidth = Math.max(step * 0.6, 1);
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className={cn("h-8 w-full", TONE_CLASS[tone], className)}
        role="img"
        aria-hidden="true"
      >
        {points.map(([x, y], i) => (
          <rect
            key={i}
            x={(x - barWidth / 2).toFixed(2)}
            y={y}
            width={barWidth.toFixed(2)}
            height={(height - y).toFixed(2)}
            rx="1"
            fill="currentColor"
          />
        ))}
      </svg>
    );
  }

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-8 w-full", TONE_CLASS[tone], className)}
      role="img"
      aria-hidden="true"
    >
      {variant === "area" && (
        <path
          d={`${linePath} L${width},${height} L0,${height} Z`}
          fill="currentColor"
          fillOpacity="0.12"
          stroke="none"
        />
      )}
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
