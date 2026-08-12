import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function InfoCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent>
        {title && <h3 className={cn("font-semibold text-foreground mb-3")}>{title}</h3>}
        {children}
      </CardContent>
    </Card>
  );
}
