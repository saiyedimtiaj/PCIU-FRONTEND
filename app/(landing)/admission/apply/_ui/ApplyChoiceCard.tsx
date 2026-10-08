import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ApplyChoiceCard({
  icon: Icon,
  level,
  title,
  description,
  points,
  href,
  tone,
}: {
  icon: LucideIcon;
  level: string;
  title: string;
  description: string;
  points: string[];
  href: string;
  tone: "blue" | "gold";
}) {
  const gold = tone === "gold";

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-primary/10 bg-card">
      <div
        className={cn(
          "relative overflow-hidden px-8 pb-10 pt-8",
          gold ? "bg-linear-to-br from-accent to-accent-hover text-black" : "bg-linear-to-br from-secondary to-primary text-white",
        )}
      >
        <div
          aria-hidden
          className={cn("absolute -right-10 -top-10 size-44 rounded-full", gold ? "bg-white/25" : "bg-white/10")}
        />
        <div
          aria-hidden
          className={cn("absolute -bottom-16 right-16 size-32 rounded-full", gold ? "bg-white/15" : "bg-white/5")}
        />
        <span
          className={cn(
            "relative inline-block rounded-full px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wider",
            gold ? "bg-black/10" : "bg-white/15",
          )}
        >
          {level}
        </span>
        <div className="relative mt-6 flex items-center gap-4">
          <span
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-2xl",
              gold ? "bg-black text-accent" : "bg-white text-primary",
            )}
          >
            <Icon className="size-8" />
          </span>
          <h3 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">{title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <p className="text-muted-foreground">{description}</p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-sm font-medium text-foreground">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  gold ? "bg-accent/20 text-accent-hover" : "bg-primary/10 text-primary",
                )}
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
        <Button
          variant={gold ? "highlight" : "default"}
          size="cta"
          className="mt-8 h-12 w-full text-base"
          render={<Link href={href} />}
          nativeButton={false}
        >
          Apply for {title}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
