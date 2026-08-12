import { iconMap } from "@/lib/icons";
import InfoCard from "@/components/shared/InfoCard";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function RequirementSection({
  content,
}: {
  content: AdmissionPageContent["requirement"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Admission Requirement
        </h2>
      </div>

      <InfoCard>
        <p className="text-sm text-muted-foreground">{content.intro}</p>
      </InfoCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {content.bachelor.map((group) => {
          const Icon = iconMap[group.icon];
          return (
            <InfoCard key={group.title}>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon className="size-5 text-primary" />
                {group.title}
              </h3>
              <BulletList items={group.items} />
            </InfoCard>
          );
        })}
      </div>

      <h3 className="font-heading font-semibold text-lg text-foreground">
        Master&apos;s Degree General Requirements
      </h3>
      <InfoCard>
        <BulletList items={content.mastersGeneral} color="text-highlight" />
      </InfoCard>

      <h3 className="font-heading font-semibold text-lg text-foreground">
        Program-Specific Requirements
      </h3>
      <div className="space-y-3">
        {content.programSpecific.map((entry, i) => (
          <InfoCard key={entry.program}>
            <div className="flex gap-4">
              <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground font-heading font-bold text-xs shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{entry.program}</p>
                <p className="text-sm text-muted-foreground mt-1">{entry.req}</p>
              </div>
            </div>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}
