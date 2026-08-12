import InfoCard from "@/components/shared/InfoCard";
import { Badge } from "@/components/ui/badge";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function ScholarshipSection({
  content,
}: {
  content: AdmissionPageContent["scholarship"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Scholarship & Financial Assistance
        </h2>
      </div>

      <InfoCard>
        <p className="text-sm text-muted-foreground">{content.intro}</p>
      </InfoCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {content.scholarships.map((s) => (
          <InfoCard key={s.name}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.eligibility}</p>
                <Badge variant="secondary" className="mt-2">
                  {s.benefit}
                </Badge>
              </div>
            </div>
          </InfoCard>
        ))}
      </div>

      <InfoCard title="How to Apply for Scholarship">
        <BulletList items={content.howToApply} />
      </InfoCard>
    </div>
  );
}
