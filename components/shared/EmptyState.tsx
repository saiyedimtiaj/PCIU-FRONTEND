import React from "react";
import { Waves } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "animation" | "icon";
  className?: string;
}

const containerPaddingMap: Record<NonNullable<EmptyStateProps["size"]>, string> = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

const sceneWidthMap: Record<NonNullable<EmptyStateProps["size"]>, string> = {
  sm: "max-w-[180px]",
  md: "max-w-[240px]",
  lg: "max-w-[300px]",
};

function BayScene({ size }: { size: NonNullable<EmptyStateProps["size"]> }) {
  return (
    <div className={`w-full ${sceneWidthMap[size]} animate-fade-in`}>
      <svg
        viewBox="0 0 240 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="An empty bay at sunrise"
        className="w-full"
      >
        <defs>
          <linearGradient id="es-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--highlight)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <linearGradient id="es-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="es-clip">
            <rect x="0" y="0" width="240" height="86" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="240" height="86" fill="url(#es-sky)" />

        <g clipPath="url(#es-clip)">
          <circle cx="120" cy="86" r="46" fill="var(--highlight)" opacity="0.10" />
          <circle cx="120" cy="86" r="32" fill="var(--highlight)" opacity="0.14" />
          <circle cx="120" cy="86" r="20" fill="url(#es-sun)" />
        </g>

        <line
          x1="18"
          y1="86"
          x2="222"
          y2="86"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <g stroke="var(--primary)" strokeLinecap="round" fill="none">
          <path d="M32 98h40M84 98h52M148 98h44" strokeWidth="2.5" opacity="0.28" />
          <path d="M50 108h34M96 108h48M156 108h32" strokeWidth="2.5" opacity="0.20" />
          <path d="M68 118h44M124 118h40" strokeWidth="2.5" opacity="0.12" />
        </g>

        <g className="animate-float" style={{ transformOrigin: "182px 86px" }}>
          <path d="M182 86V64l14 22h-14Z" fill="var(--secondary)" opacity="0.85" />
          <path d="M180 86h18l-3 4h-12l-3-4Z" fill="var(--primary)" opacity="0.55" />
        </g>
      </svg>
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
      className={`flex flex-col items-center justify-center gap-4 px-6 text-center ${containerPaddingMap[size]} ${className}`}
    >
      {variant === "animation" ? (
        <BayScene size={size} />
      ) : (
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
          {icon ?? <Waves className="size-6" />}
        </div>
      )}

      <div className="space-y-1.5">
        <p className="font-heading text-lg font-bold text-foreground">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
