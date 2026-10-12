import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ClipboardList, Landmark, Smartphone, Wallet, type LucideIcon } from "lucide-react";
import type { AdmissionPageContent } from "@/types/admission";

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

const triggerClass = "px-5 py-4 font-heading text-base font-semibold text-foreground hover:bg-transparent";

function TriggerLabel({ icon: Icon, label, iconClass }: { icon: LucideIcon; label: string; iconClass: string }) {
  return (
    <span className="flex items-center gap-4">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="size-5" />
      </span>
      {label}
    </span>
  );
}

export default function ApplyInfoAccordion({
  onlineAdmission,
  paymentPolicy,
}: {
  onlineAdmission: AdmissionPageContent["onlineAdmission"];
  paymentPolicy: AdmissionPageContent["paymentPolicy"];
}) {
  return (
    <Accordion className="space-y-3" defaultValue={["instructions"]}>
      <AccordionItem value="instructions" className="rounded-2xl border-border/80">
        <AccordionTrigger className={triggerClass}>
          <TriggerLabel icon={ClipboardList} label="Instructions for Applicants" iconClass="bg-primary text-primary-foreground" />
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 pt-1">
          <StepList
            steps={[
              "Choose Bachelor's or Master's program level on this page.",
              "Select your desired program and fill in your personal information.",
              "Enter your SSC, HSC and (for Master's) Bachelor's academic records exactly as they appear on your certificates.",
              "Submit the application and note down your reference ID.",
              "Pay the application fee using one of the payment methods below.",
            ]}
          />
          <p className="mt-5 rounded-xl border-l-4 border-accent bg-accent/10 px-4 py-3 text-sm text-foreground">
            {onlineAdmission.note}
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="payment" className="rounded-2xl border-border/80">
        <AccordionTrigger className={triggerClass}>
          <TriggerLabel icon={Landmark} label="Payment Instructions" iconClass="bg-primary/10 text-primary" />
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 pt-1">
          <ul className="space-y-2.5">
            {paymentPolicy.rules.map((rule) => (
              <li key={rule} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {paymentPolicy.banks.map((bank) => (
              <div key={bank.name} className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="font-heading text-sm font-semibold text-foreground">{bank.name}</p>
                <p className="mt-1 font-mono text-sm text-primary">{bank.account}</p>
                <p className="mt-1 text-xs text-muted-foreground">{bank.branch}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs font-medium text-muted-foreground">{paymentPolicy.bankNote}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rocket" className="rounded-2xl border-border/80">
        <AccordionTrigger className={triggerClass}>
          <TriggerLabel icon={Smartphone} label="How to Pay Through Rocket" iconClass="bg-secondary/10 text-secondary" />
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 pt-1">
          <p className="mb-4 text-sm text-muted-foreground">
            Biller ID:{" "}
            <span className="font-heading font-semibold text-primary">{paymentPolicy.rocket.billerId}</span>
          </p>
          <StepList steps={paymentPolicy.rocket.steps} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="bkash" className="rounded-2xl border-border/80">
        <AccordionTrigger className={triggerClass}>
          <TriggerLabel icon={Wallet} label="How to Pay Through bKash" iconClass="bg-accent/20 text-accent-hover" />
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 pt-1">
          <p className="mb-4 text-sm text-muted-foreground">
            Merchant number:{" "}
            <span className="font-heading font-semibold text-primary">{paymentPolicy.bkash.merchantNo}</span>
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 font-heading text-sm font-semibold text-foreground">Using the bKash App</p>
              <StepList steps={paymentPolicy.bkash.steps} />
            </div>
            <div>
              <p className="mb-3 font-heading text-sm font-semibold text-foreground">Using USSD (*247#)</p>
              <StepList steps={paymentPolicy.ussd.steps} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
