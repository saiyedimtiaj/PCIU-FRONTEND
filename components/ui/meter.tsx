import { Meter as MeterPrimitive } from "@base-ui/react/meter";

import { cn } from "@/lib/utils";

// No `format`/`locale` prop is ever passed through here — Intl.NumberFormat
// output can differ by runtime ICU data between server and client, which is
// exactly the class of bug AGENTS.md warns about for date formatting.
// Callers should pre-format any displayed value text themselves.

const Meter = MeterPrimitive.Root;

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    />
  );
}

function MeterIndicator({ className, ...props }: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("h-full rounded-full bg-primary transition-all", className)}
      {...props}
    />
  );
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

export { Meter, MeterTrack, MeterIndicator, MeterLabel };
