import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ApplicationSubmitted({ referenceId }: { referenceId: string }) {
  return (
    <div className="mx-auto max-w-lg animate-fade-in-up rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-light text-success">
        <CheckCircle2 className="size-8" />
      </span>
      <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">Application Received</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Thank you for applying to Port City International University. Our admissions team will review
        your application and reach out with next steps.
      </p>
      <div className="mt-6 rounded-xl border border-dashed border-accent/50 bg-accent/5 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Reference ID
        </p>
        <p className="mt-1 font-heading text-lg font-bold text-primary">{referenceId}</p>
      </div>
      <Button variant="highlight" size="cta" className="mt-8 w-full" render={<Link href="/" />} nativeButton={false}>
        Back to Home
      </Button>
    </div>
  );
}
