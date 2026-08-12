import { Phone, Mail } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Button } from "@/components/ui/button";
import type { AdmissionPageContent } from "@/types/admission";

export default function AdmissionContactSection({
  content,
}: {
  content: AdmissionPageContent["admissionContact"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Admission Contact
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard title="Admission Office">
          <p className="text-sm text-muted-foreground whitespace-pre-line mb-2">
            {content.office.address}
          </p>
          <p className="text-sm text-muted-foreground whitespace-pre-line mb-2">
            {content.office.phone}
          </p>
          <p className="text-sm text-muted-foreground mb-1">{content.office.email}</p>
          <p className="text-sm text-muted-foreground">{content.office.website}</p>
        </InfoCard>
        <InfoCard title="Office Hours">
          <ul className="space-y-1.5 mb-3">
            {content.officeHours.map((h) => (
              <li key={h.day} className="flex justify-between text-sm text-muted-foreground">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground border-t border-border pt-3">
            {content.seasonNote}
          </p>
        </InfoCard>
      </div>

      <div className="rounded-2xl bg-gradient-hero text-white p-8 text-center">
        <h3 className="font-heading font-bold text-xl mb-2">Need Help with Admission?</h3>
        <p className="text-white/80 mb-6">
          Our admission counselors are available to guide you through the entire process.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="highlight"
            size="cta"
            render={<a href={`tel:${content.office.phone.split("\n")[0]}`} />}
            nativeButton={false}
          >
            <Phone className="size-4" />
            Call Now
          </Button>
          <Button
            variant="outline"
            size="cta"
            className="border-white text-white hover:bg-white/10"
            render={<a href={`mailto:${content.office.email}`} />}
            nativeButton={false}
          >
            <Mail className="size-4" />
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
}
