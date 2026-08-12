import InfoCard from "@/components/shared/InfoCard";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function DocumentsRequiredSection({
  content,
}: {
  content: AdmissionPageContent["documentsRequired"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Documents Required
        </h2>
      </div>

      <InfoCard title="Bachelor's Degree Programs">
        <p className="text-sm font-medium text-foreground mb-2">At the time of form submission:</p>
        <BulletList items={content.bachelor.atSubmission} />
        <p className="text-sm font-medium text-foreground mt-4 mb-2">At the time of admission:</p>
        <BulletList items={content.bachelor.atAdmission} />
      </InfoCard>

      <InfoCard title="Master's Degree Programs">
        <p className="text-sm font-medium text-foreground mb-2">At the time of form submission:</p>
        <BulletList items={content.masters.atSubmission} />
        <p className="text-sm font-medium text-foreground mt-4 mb-2">At the time of admission:</p>
        <BulletList items={content.masters.atAdmission} />
      </InfoCard>

      <InfoCard className="border-l-4 border-l-destructive">
        <p className="text-sm text-muted-foreground">{content.note}</p>
      </InfoCard>
    </div>
  );
}
