import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function UnderConstruction({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1 flex items-center gap-2">
          <Icon className="size-6 text-primary" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Card>
        <CardContent className="text-center py-16">
          <p className="text-3xl mb-3">🚧</p>
          <p className="font-medium text-foreground">Page Under Construction</p>
          <p className="text-sm text-muted-foreground mt-1">
            This section is being updated. Please check back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
