import InfoCard from "@/components/shared/InfoCard";
import { Card, CardContent } from "@/components/ui/card";

export default function CertificationVerificationSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Certification Verification
        </h2>
        <p className="text-sm text-muted-foreground">
          Verify the authenticity of PCIU academic documents.
        </p>
      </div>

      <Card className="bg-gradient-hero text-white">
        <CardContent>
          <h3 className="font-heading font-bold text-lg mb-2">
            Certificate Verification Portal
          </h3>
          <p className="text-sm text-white/80 mb-6">
            Enter a student ID and certificate number to verify a PCIU academic document.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-sm text-white/60">
              Student ID
            </div>
            <div className="rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-sm text-white/60">
              Certificate Number
            </div>
          </div>
          <p className="text-xs text-white/60 mt-4">
            * This is a display-only preview. Please contact the Registrar&apos;s Office for
            actual verification.
          </p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard title="Documents That Can Be Verified">
          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            <li>Provisional Certificate</li>
            <li>Original Degree Certificate</li>
            <li>Academic Transcript</li>
            <li>Character Certificate</li>
            <li>Student Status Certificate</li>
          </ul>
        </InfoCard>
        <InfoCard title="Contact for Verification">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Office of the Registrar
            <br />
            Port City International University
            <br />
            1/1, Nasirabad Housing Society, Chittagong-4209
            <br />
            📧 registrar@portcity.edu.bd
            <br />
            📞 +880-31-2550780
            <br />
            Office Hours: Saturday – Thursday, 9:00 AM – 5:00 PM
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
