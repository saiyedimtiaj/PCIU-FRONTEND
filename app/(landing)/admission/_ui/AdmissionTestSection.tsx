import InfoCard from "@/components/shared/InfoCard";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function AdmissionTestSection({
  content,
}: {
  content: AdmissionPageContent["admissionTest"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Admission Test</h2>
      </div>

      <InfoCard>
        <p className="text-sm text-muted-foreground">{content.intro}</p>
      </InfoCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {content.tracks.map((track) => (
          <InfoCard key={track.title} title={track.title}>
            <BulletList items={track.subjects} />
            <p className="text-xs text-muted-foreground mt-3 font-medium">{track.footer}</p>
          </InfoCard>
        ))}
      </div>

      <InfoCard title="Test Day Guidelines">
        <BulletList items={content.guidelines} />
      </InfoCard>

      <InfoCard title="How to Get the Admit Card">
        <div className="space-y-3">
          {content.admitCardSteps.map((step) => (
            <div key={step.step} className="flex gap-3">
              <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground font-heading font-bold text-xs shrink-0">
                {step.step}
              </span>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard className="border-l-4 border-l-highlight">
        <p className="text-sm text-muted-foreground">{content.note}</p>
      </InfoCard>
    </div>
  );
}
