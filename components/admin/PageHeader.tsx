import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

/**
 * Shared title block for admin pages — an icon chip, title, description,
 * and a right-aligned actions slot (typically an "Add X" button). Used by
 * both EntityForm (the create/edit form heading) and EntityListClient (the
 * listing heading) so the two read as one consistent surface.
 */
export default function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
        )}
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
