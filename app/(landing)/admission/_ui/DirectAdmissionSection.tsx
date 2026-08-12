import InfoCard from "@/components/shared/InfoCard";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function DirectAdmissionSection({
  content,
}: {
  content: AdmissionPageContent["directAdmission"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Direct Admission
        </h2>
      </div>

      <InfoCard>
        <p className="text-sm text-muted-foreground">{content.intro}</p>
      </InfoCard>

      <InfoCard title="Eligibility for Direct Admission">
        <p className="text-sm font-medium text-foreground mb-2">Undergraduate Programs</p>
        <BulletList items={content.undergraduateEligibility} />
        <p className="text-sm font-medium text-foreground mt-4 mb-2">Master&apos;s Programs</p>
        <BulletList items={content.mastersEligibility} />
      </InfoCard>

      <InfoCard title="Direct Admission Process">
        <div className="space-y-4">
          {content.process.map((step) => (
            <div key={step.step} className="flex gap-4">
              <span className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm shrink-0">
                {step.step}
              </span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
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
