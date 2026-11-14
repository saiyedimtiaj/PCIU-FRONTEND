import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ApplyChoiceCard({
  icon: Icon,
  number,
  level,
  title,
  description,
  points,
  meta,
  href,
  tone,
}: {
  icon: LucideIcon;
  number: string;
  level: string;
  title: string;
  description: string;
  points: string[];
  meta: Array<{ label: string; value: string }>;
  href: string;
  tone: "blue" | "gold";
}) {
  const gold = tone === "gold";

  return (
    <article
      className={cn(
        "flex min-h-full flex-col overflow-hidden rounded-3xl border bg-white transition-colors",
        gold ? "border-amber-200 hover:border-amber-300" : "border-blue-200 hover:border-blue-300",
      )}
    >
      <div className={cn("h-1.5 w-full", gold ? "bg-accent" : "bg-secondary")} />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              gold ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-primary",
            )}
          >
            <Icon className="size-6" />
          </span>
          <span className={cn("text-xs font-bold tracking-[0.16em]", gold ? "text-amber-700" : "text-secondary")}>
            {number}
          </span>
        </div>

        <div className="mt-6">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
              gold ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-primary",
            )}
          >
            {level}
          </span>
          <h2 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <div className="mt-6 flex gap-8 border-y border-border py-4">
          {meta.map((item) => (
            <div key={item.label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-heading text-lg font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex-1">
          <p className="font-heading text-sm font-semibold text-foreground">Eligibility at a glance</p>
          <ul className="mt-4 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                    gold ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-primary",
                  )}
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant={gold ? "highlight" : "default"}
          size="cta"
          className="mt-8 h-12 w-full text-sm sm:text-base"
          render={<Link href={href} />}
          nativeButton={false}
        >
          Start {level} Application
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}
