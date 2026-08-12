import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&_svg]:pointer-events-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary: "border-secondary/30 bg-secondary/20 text-secondary font-semibold",
        accent: "border-transparent bg-accent text-accent-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border bg-background text-foreground",
        success: "border-success/30 bg-success/20 text-success font-semibold",
        warning: "border-warning/40 bg-warning/25 text-warning-foreground font-semibold",
        info: "border-info/30 bg-info/20 text-info font-semibold",
        soft: "border-transparent bg-accent text-accent-foreground",
        muted: "border-border bg-muted text-foreground font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
