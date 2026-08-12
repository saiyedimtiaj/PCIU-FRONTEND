import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BulletList({
  items,
  color = "text-primary",
}: {
  items: string[];
  color?: string;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle className={cn("size-4 shrink-0 mt-0.5", color)} />
          {item}
        </li>
      ))}
    </ul>
  );
}
