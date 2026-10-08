import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export default function FormSectionCard({
  id,
  step,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  step: number;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card">
      <header className="flex items-center gap-4 border-b border-border bg-linear-to-r from-secondary-light/60 to-transparent px-6 py-5 sm:px-8">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-secondary to-primary text-white">
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary">Step {step}</p>
          <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <div className="p-6 sm:p-8">{children}</div>
    </section>
  );
}
