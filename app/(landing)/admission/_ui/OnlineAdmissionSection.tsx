import { ArrowRight } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Button } from "@/components/ui/button";
import type { AdmissionPageContent } from "@/types/admission";

export default function OnlineAdmissionSection({
  content,
}: {
  content: AdmissionPageContent["onlineAdmission"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Online Admission
        </h2>
      </div>

      <InfoCard>
        <p className="text-sm text-muted-foreground">{content.intro}</p>
      </InfoCard>

      <InfoCard title="Online Application Steps">
        <div className="space-y-3">
          {content.steps.map((step, i) => (
            <div key={step} className="flex gap-3">
              <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground font-heading font-bold text-xs shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
        <Button
          className="mt-6 gap-2"
          variant="highlight"
          render={<a href={content.portalUrl} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
        >
          Go to Online Admission Portal
          <ArrowRight className="size-4" />
        </Button>
      </InfoCard>

      <InfoCard className="border-l-4 border-l-highlight">
        <p className="text-sm text-muted-foreground">{content.note}</p>
      </InfoCard>
    </div>
  );
}
