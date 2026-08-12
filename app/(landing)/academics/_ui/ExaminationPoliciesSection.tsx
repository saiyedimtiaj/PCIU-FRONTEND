import InfoCard from "@/components/shared/InfoCard";
import type { AcademicsPageContent } from "@/types/academics";

export default function ExaminationPoliciesSection({
  content,
}: {
  content: AcademicsPageContent["examinationPolicies"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Examination Policies
        </h2>
        <p className="text-sm text-muted-foreground">
          Rules governing attendance, assessment weighting, and academic integrity.
        </p>
      </div>

      <div className="space-y-4">
        {content.policies.map((policy, i) => (
          <InfoCard key={policy.title}>
            <div className="flex gap-4">
              <span className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{policy.title}</h3>
                <p className="text-sm text-muted-foreground">{policy.content}</p>
              </div>
            </div>
          </InfoCard>
        ))}
      </div>

      <InfoCard title="Marks Distribution Summary">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {[
            { label: "Class Attendance", value: "10%" },
            { label: "Assignment/Quiz", value: "10%" },
            { label: "Class Performance", value: "10%" },
            { label: "Midterm Exam", value: "30%" },
          ].map((tile) => (
            <div key={tile.label} className="text-center rounded-lg bg-muted p-3">
              <p className="font-heading font-bold text-lg text-foreground">{tile.value}</p>
              <p className="text-xs text-muted-foreground">{tile.label}</p>
            </div>
          ))}
        </div>
        <div className="text-center rounded-lg bg-primary text-primary-foreground p-4">
          <p className="font-heading font-bold text-2xl">40%</p>
          <p className="text-xs text-primary-foreground/80">Final Examination</p>
        </div>
      </InfoCard>
    </div>
  );
}
