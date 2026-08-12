import React from "react";
import {
  FileText,
  ImageIcon,
  LayoutGrid,
  FolderOpen,
  Tag,
  Video,
  Music,
  Archive,
} from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "animation" | "icon";
  className?: string;
}

const clusterSizeMap: Record<NonNullable<EmptyStateProps["size"]>, number> = {
  sm: 128,
  md: 160,
  lg: 220,
};

const containerPaddingMap: Record<NonNullable<EmptyStateProps["size"]>, string> = {
  sm: "py-6",
  md: "py-8",
  lg: "py-16",
};

const RING_RADIUS_PCT = [14, 28, 42, 56];

const ring2Icons = [
  { Icon: FileText, color: "var(--secondary)", bg: "var(--secondary-light)" },
  { Icon: ImageIcon, color: "var(--accent)", bg: "var(--accent-light)" },
  { Icon: LayoutGrid, color: "var(--primary)", bg: "color-mix(in oklch, var(--primary), transparent 90%)" },
  { Icon: FolderOpen, color: "var(--highlight)", bg: "color-mix(in oklch, var(--highlight), transparent 85%)" },
];

const ring4Icons = [
  { Icon: Tag, color: "var(--secondary)", bg: "var(--secondary-light)" },
  { Icon: Video, color: "var(--accent)", bg: "var(--accent-light)" },
  { Icon: Music, color: "var(--primary)", bg: "color-mix(in oklch, var(--primary), transparent 90%)" },
  { Icon: Archive, color: "var(--highlight)", bg: "color-mix(in oklch, var(--highlight), transparent 85%)" },
];

function ringIconPositions(radiusPct: number, startDeg: number) {
  return [0, 90, 180, 270].map((offset) => {
    const rad = ((startDeg + offset) * Math.PI) / 180;
    return {
      left: `${50 + radiusPct * Math.cos(rad)}%`,
      top: `${50 + radiusPct * Math.sin(rad)}%`,
    };
  });
}

function EmptyStateCluster({ size }: { size: NonNullable<EmptyStateProps["size"]> }) {
  const dim = clusterSizeMap[size];
  const ring2Pos = ringIconPositions(RING_RADIUS_PCT[1], 45);
  const ring4Pos = ringIconPositions(RING_RADIUS_PCT[3], 0);
  const chipSize = size === "sm" ? 20 : size === "md" ? 24 : 28;
  const iconSize = size === "sm" ? 11 : size === "md" ? 13 : 15;
  const centerSize = size === "sm" ? 22 : size === "md" ? 26 : 34;

  return (
    <div className="relative shrink-0 animate-fade-in" style={{ width: dim, height: dim }}>
      {/* 4 concentric rings */}
      {RING_RADIUS_PCT.map((pct, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-border/50"
          style={{
            left: `${50 - pct}%`,
            top: `${50 - pct}%`,
            width: `${pct * 2}%`,
            height: `${pct * 2}%`,
          }}
        />
      ))}

      {/* Ring 2 icon chips */}
      {ring2Icons.map(({ Icon, color, bg }, i) => (
        <div
          key={`r2-${i}`}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border shadow-sm animate-float"
          style={{
            ...ring2Pos[i],
            width: chipSize,
            height: chipSize,
            backgroundColor: bg,
            borderColor: color,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          <Icon style={{ color, width: iconSize, height: iconSize }} />
        </div>
      ))}

      {/* Ring 4 icon chips */}
      {ring4Icons.map(({ Icon, color, bg }, i) => (
        <div
          key={`r4-${i}`}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border shadow-sm animate-float"
          style={{
            ...ring4Pos[i],
            width: chipSize,
            height: chipSize,
            backgroundColor: bg,
            borderColor: color,
            animationDelay: `${0.5 + i * 0.4}s`,
          }}
        >
          <Icon style={{ color, width: iconSize, height: iconSize }} />
        </div>
      ))}

      {/* Small center icon — no background box, solid foreground fill */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-muted-foreground">
        <FileText style={{ width: centerSize, height: centerSize }} strokeWidth={2} />
      </div>
    </div>
  );
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  size = "md",
  variant = "animation",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 gap-3 ${containerPaddingMap[size]} ${className}`}
    >
      {variant === "animation" ? (
        <EmptyStateCluster size={size} />
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="mt-6">
        <p className="text-lg font-bold text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
