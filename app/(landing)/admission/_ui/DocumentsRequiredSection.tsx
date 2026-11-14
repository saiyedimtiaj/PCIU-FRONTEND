import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  FileText,
  FolderOpen,
  TriangleAlert,
} from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdmissionPageContent } from "@/types/admission";

type Content = AdmissionPageContent["documentsRequired"];

const PROGRAMS = [
  { value: "bachelor", label: "Bachelor's", icon: BookOpen },
  { value: "masters", label: "Master's", icon: Award },
] as const;

function StageCard({
  stage,
  icon: Icon,
  title,
  items,
}: {
  stage: number;
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <InfoCard className="h-full rounded-2xl border-border/80 shadow-sm [&_[data-slot=card-content]]:p-4 sm:[&_[data-slot=card-content]]:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md",
              stage === 1
                ? "bg-primary text-primary-foreground shadow-primary/20"
                : "bg-highlight text-highlight-foreground shadow-highlight/25",
            )}
          >
            <Icon className="size-5 stroke-2" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Stage {stage}
            </p>
            <h4 className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base">
              {title}
            </h4>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {items.length} items
        </span>
      </div>

      <ol className="divide-y divide-border/70">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 ml-2 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-heading text-[11px] font-bold text-primary"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-6 text-muted-foreground">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </InfoCard>
  );
}

export default function DocumentsRequiredSection({
  content,
}: {
  content: Content;
}) {
  const note = content.note.replace(/^Note:\s*/i, "");

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
          <FolderOpen aria-hidden="true" className="size-6" />
        </span>
        <div className="pt-0.5">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Prepare in advance
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Documents Required
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Keep these documents ready for each stage — when you submit the
            application form, and when you complete your admission.
          </p>
        </div>
      </header>

      <Tabs defaultValue="bachelor" className="w-full">
        <TabsList
          aria-label="Choose your program level"
          className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1 shadow-sm sm:max-w-md"
        >
          {PROGRAMS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="min-w-0 justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs text-muted-foreground hover:text-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm sm:gap-2 sm:px-4 sm:text-sm"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{label} programs</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {PROGRAMS.map(({ value }) => (
          <TabsContent key={value} value={value} className="mt-5 outline-none">
            <div className="grid gap-4 lg:grid-cols-2">
              <StageCard
                stage={1}
                icon={FileText}
                title="At form submission"
                items={content[value].atSubmission}
              />
              <StageCard
                stage={2}
                icon={ClipboardCheck}
                title="At the time of admission"
                items={content[value].atAdmission}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <aside
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-destructive/25 border-l-4 border-l-destructive bg-destructive/4 p-4 sm:gap-4 sm:p-5"
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive text-white shadow-md shadow-destructive/25 sm:size-10"
        >
          <TriangleAlert className="size-4 stroke-[2.25] sm:size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Incomplete applications may be cancelled
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{note}</p>
        </div>
      </aside>
    </div>
  );
}
