"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import type { FaqData } from "@/lib/api/admission";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  admission: "Admission",
  cfpg: "CFPG",
  others: "Others",
};

function typeLabel(type: string) {
  return (
    TYPE_LABELS[type] ??
    type.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function FAQList({ faqs }: { faqs: FaqData[] }) {
  const [activeType, setActiveType] = useState("all");

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const faq of faqs) {
      counts.set(faq.type, (counts.get(faq.type) ?? 0) + 1);
    }
    return [...counts];
  }, [faqs]);

  const visible =
    activeType === "all" ? faqs : faqs.filter((faq) => faq.type === activeType);

  return (
    <div className="space-y-5">
      {types.length > 1 && (
        <div
          role="group"
          aria-label="Filter questions by category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
        >
          {[["all", faqs.length] as const, ...types].map(([type, count]) => {
            const active = activeType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveType(type)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition duration-200 sm:text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-sm",
                )}
              >
                {type === "all" ? "All" : typeLabel(type)}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums sm:text-xs",
                    active ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <AccordionPrimitive.Root
        key={activeType}
        defaultValue={visible[0] ? [visible[0].id] : []}
        className="space-y-3"
      >
        {visible.map((faq, index) => (
          <AccordionPrimitive.Item
            key={faq.id}
            value={faq.id}
            className={cn(
              "group overflow-hidden rounded-2xl border border-border border-l-4 border-l-transparent bg-card shadow-sm transition duration-200",
              "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg",
              "data-open:border-primary/25 data-open:border-l-primary data-open:shadow-md",
            )}
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="flex w-full items-start gap-3 p-4 text-left outline-none focus-visible:bg-primary/5 sm:gap-4 sm:p-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold tabular-nums text-primary transition-colors duration-200 group-data-open:bg-primary group-data-open:text-primary-foreground sm:size-9">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 pt-1">
                  <span className="block font-heading text-sm font-semibold leading-6 text-foreground transition-colors group-hover:text-primary sm:text-base">
                    {faq.question}
                  </span>
                  {activeType === "all" && types.length > 1 && (
                    <span className="mt-1.5 inline-block rounded-md bg-secondary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-[11px]">
                      {typeLabel(faq.type)}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition duration-300 group-hover:border-primary/30 group-hover:text-primary group-data-open:rotate-180 group-data-open:border-primary group-data-open:bg-primary group-data-open:text-primary-foreground">
                  <ChevronDown aria-hidden="true" className="size-4" />
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0">
              <p className="px-4 pb-5 pl-15 text-sm leading-7 text-muted-foreground sm:px-5 sm:pl-18 sm:text-[15px]">
                {faq.answer}
              </p>
            </AccordionPrimitive.Panel>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </div>
  );
}
