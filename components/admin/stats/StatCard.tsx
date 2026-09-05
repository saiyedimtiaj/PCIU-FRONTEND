import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Sparkline from "./Sparkline";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info" | "violet";
  delta?: { value: string; direction: "up" | "down" | "flat" };
  sparkline?: number[];
  className?: string;
  loading?: boolean;
}

// Static Record, never a template literal — Tailwind's scanner can't see
// `bg-${tone}/10` at build time, so a dynamic class string would silently
// generate no CSS and render colorless.
const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning-foreground",
  info: "bg-info-light text-info",
  violet: "bg-secondary/10 text-secondary",
};

const DELTA_TONE: Record<"up" | "down" | "flat", string> = {
  up: "bg-success-light text-success",
  down: "bg-destructive/10 text-destructive",
  flat: "bg-muted text-muted-foreground",
};

const DELTA_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  delta,
  sparkline,
  className,
  loading = false,
}: StatCardProps) {
  const DeltaIcon = delta ? DELTA_ICON[delta.direction] : null;

  if (loading) {
    return (
      <Card className={className} aria-busy="true">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="size-10 shrink-0 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
            <Icon className="size-5" />
          </div>
          {delta && DeltaIcon && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                DELTA_TONE[delta.direction]
              )}
            >
              <DeltaIcon className="size-3" />
              {delta.value}
            </span>
          )}
        </div>
        <div>
          <p className="font-heading text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} variant="area" tone={tone === "violet" ? "primary" : tone} />
        )}
      </CardContent>
    </Card>
  );
}
