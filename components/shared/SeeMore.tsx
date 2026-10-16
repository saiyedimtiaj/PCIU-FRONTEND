"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Renders the first `limit` items, plus a toggle for the rest. Collapsing
 * scrolls back to the list's top, so a reader who expanded a long list isn't
 * left stranded far below the section they were reading.
 */
export default function SeeMore<T>({
  items,
  limit,
  children,
}: {
  items: T[];
  limit: number;
  children: (visible: T[]) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const hidden = Math.max(items.length - limit, 0);

  function toggle() {
    if (expanded) anchor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setExpanded(!expanded);
  }

  return (
    <div ref={anchor} className="scroll-mt-28">
      {children(expanded ? items : items.slice(0, limit))}
      {hidden > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full px-6"
            onClick={toggle}
            aria-expanded={expanded}
          >
            {expanded ? "See less" : `See more (${hidden})`}
            <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
          </Button>
        </div>
      )}
    </div>
  );
}
