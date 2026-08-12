import InfoCard from "@/components/shared/InfoCard";
import type { AcademicsPageContent } from "@/types/academics";

export default function AcademicResultsSection({
  content,
}: {
  content: AcademicsPageContent["academicResults"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Academic Results
        </h2>
        <p className="text-sm text-muted-foreground">
          How to check your semester results and transcripts online.
        </p>
      </div>

      <InfoCard title="How to Check Your Results">
        <div className="space-y-4">
          {content.steps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <span className="flex items-center justify-center size-8 rounded-full bg-accent text-accent-foreground font-heading font-bold text-sm shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard title="Result Publication Timeline">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Midterm results within 2 weeks of exam completion.</li>
            <li>Final results within 4 weeks.</li>
            <li>Results published on student portal first.</li>
            <li>Official transcripts available from Registrar&apos;s Office.</li>
          </ul>
        </InfoCard>
        <InfoCard title="Grade Review Process">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Apply within 7 days of result publication.</li>
            <li>Submit review application to department head.</li>
            <li>Review fee BDT 500 per course.</li>
            <li>Results of review communicated within 2 weeks.</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}
