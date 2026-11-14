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
        <li
          key={item}
          className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
        >
          <CheckCircle
            aria-hidden="true"
            className={cn("mt-1 size-4 shrink-0", color)}
          />
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}
