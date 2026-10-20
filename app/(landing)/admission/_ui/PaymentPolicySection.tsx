import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Hash,
  Headset,
  Info,
  Landmark,
  Phone,
  ScrollText,
  Smartphone,
  Wallet,
} from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { AdmissionPageContent } from "@/types/admission";

type Content = AdmissionPageContent["paymentPolicy"];

const CARD_CLASS =
  "rounded-2xl border-border/80 shadow-sm [&_[data-slot=card-content]]:p-4 sm:[&_[data-slot=card-content]]:p-6";

function IconTile({
  icon: Icon,
  tone = "primary",
  className,
}: {
  icon: LucideIcon;
  tone?: "primary" | "highlight";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md",
        tone === "primary"
          ? "bg-primary text-primary-foreground shadow-primary/20"
          : "bg-highlight text-highlight-foreground shadow-highlight/25",
        className,
      )}
    >
      <Icon className="size-5 stroke-2" />
    </span>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  aside,
}: {
  id: string;
  eyebrow: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <h3
          id={id}
          className="mt-1 font-heading text-xl font-bold text-foreground"
        >
          {title}
        </h3>
      </div>
      {aside}
    </div>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="relative flex gap-3.5">
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-8 -bottom-3 w-px bg-border"
            />
          )}
          <span
            aria-hidden="true"
            className="relative z-10  flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-heading text-xs font-bold text-primary"
          >
            {index + 1}
          </span>
          <p className="pt-0.5 text-sm leading-6 text-muted-foreground">
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}

function KeyValue({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const valueClass =
    "mt-1 block font-mono text-lg font-bold tracking-wide text-foreground sm:text-xl";
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-primary/4 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {href ? (
        <a href={href} className={cn(valueClass, "hover:text-primary")}>
          {value}
        </a>
      ) : (
        <span className={valueClass}>{value}</span>
      )}
    </div>
  );
}

function MobileMethod({
  icon,
  title,
  keyLabel,
  keyValue,
  keyHref,
  steps,
}: {
  icon: LucideIcon;
  title: string;
  keyLabel: string;
  keyValue: string;
  keyHref?: string;
  steps: string[];
}) {
  return (
    <InfoCard className={CARD_CLASS}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <IconTile icon={icon} />
            <h4 className="font-heading text-base font-semibold text-foreground">
              {title}
            </h4>
          </div>
          <KeyValue label={keyLabel} value={keyValue} href={keyHref} />
        </div>
        <Steps steps={steps} />
      </div>
    </InfoCard>
  );
}

export default function PaymentPolicySection({
  content,
}: {
  content: Content;
}) {
  const bkashHref = `tel:${content.bkash.merchantNo}`;

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
          <CreditCard aria-hidden="true" className="size-6" />
        </span>
        <div className="pt-0.5">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Fees &amp; deadlines
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Payment Policy
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Payment rules for admission and tuition fees, and every way you can
            pay — by bank deposit, Rocket, or bKash.
          </p>
        </div>
      </header>

      <section aria-labelledby="payment-rules-heading" className="space-y-4">
        <SectionHeading
          id="payment-rules-heading"
          eyebrow="Before you pay"
          title="Payment rules"
        />
        <InfoCard className={CARD_CLASS}>
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <IconTile icon={ScrollText} />
            <p className="text-sm leading-6 text-muted-foreground">
              Please read these rules carefully — they apply to every trimester.
            </p>
          </div>
          <ol className="divide-y divide-border/70">
            {content.rules.map((rule, index) => (
              <li
                key={rule}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 ml-2 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-heading text-[11px] font-bold text-primary"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-muted-foreground">
                  {rule}
                </span>
              </li>
            ))}
          </ol>
        </InfoCard>
      </section>

      <section aria-labelledby="payment-methods-heading" className="space-y-4">
        <SectionHeading
          id="payment-methods-heading"
          eyebrow="How to pay"
          title="Payment methods"
        />

        <Tabs defaultValue="bank" className="w-full">
          <TabsList
            aria-label="Choose a payment method"
            className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1 shadow-sm sm:grid-cols-4"
          >
            {(
              [
                { value: "bank", label: "Bank deposit", icon: Landmark },
                { value: "rocket", label: "Rocket", icon: Smartphone },
                { value: "bkash", label: "bKash app", icon: Wallet },
                { value: "ussd", label: "Dial *247#", icon: Hash },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="min-w-0 justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs text-muted-foreground hover:text-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm sm:gap-2 sm:text-sm"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="bank" className="mt-5 space-y-4 outline-none">
            <div className="grid gap-4 md:grid-cols-2">
              {content.banks.map((bank, index) => (
                <InfoCard
                  key={bank.name}
                  className={cn(
                    CARD_CLASS,
                    "h-full motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/20 motion-safe:hover:shadow-lg",
                  )}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <IconTile
                      icon={Landmark}
                      tone={index % 2 === 0 ? "primary" : "highlight"}
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading text-base font-semibold leading-snug text-foreground">
                        {bank.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {bank.branch}
                      </p>
                    </div>
                  </div>
                  <KeyValue label="Account number" value={bank.account} />
                </InfoCard>
              ))}
            </div>
            <aside className="flex items-start gap-3 rounded-2xl border border-highlight/30 border-l-4 border-l-highlight bg-highlight/6 p-4 sm:gap-4">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-highlight text-highlight-foreground shadow-md shadow-highlight/25"
              >
                <Info className="size-4 stroke-[2.25]" />
              </span>
              <p className="pt-1.5 text-sm font-medium leading-6 text-foreground/80">
                {content.bankNote}
              </p>
            </aside>
          </TabsContent>

          <TabsContent value="rocket" className="mt-5 outline-none">
            <MobileMethod
              icon={Smartphone}
              title="Rocket payment"
              keyLabel="Biller ID"
              keyValue={content.rocket.billerId}
              steps={content.rocket.steps}
            />
          </TabsContent>

          <TabsContent value="bkash" className="mt-5 outline-none">
            <MobileMethod
              icon={Wallet}
              title="bKash app payment"
              keyLabel="Merchant number"
              keyValue={content.bkash.merchantNo}
              keyHref={bkashHref}
              steps={content.bkash.steps}
            />
          </TabsContent>

          <TabsContent value="ussd" className="mt-5 outline-none">
            <MobileMethod
              icon={Hash}
              title="Pay by dialing *247#"
              keyLabel="Merchant number"
              keyValue={content.bkash.merchantNo}
              keyHref={bkashHref}
              steps={content.ussd.steps}
            />
          </TabsContent>
        </Tabs>
      </section>

      <section aria-labelledby="payment-contacts-heading" className="space-y-4">
        <SectionHeading
          id="payment-contacts-heading"
          eyebrow="Need help?"
          title="Payment query contacts"
          aside={
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              {content.contacts.length} contacts
            </span>
          }
        />
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {content.contacts.map((contact) => (
            <li key={contact.phone}>
              <a
                href={`tel:${contact.phone}`}
                className="group flex h-full items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm motion-safe:transition motion-safe:duration-200 hover:border-primary/25 hover:shadow-md"
              >
                <IconTile
                  icon={contact.role ? Headset : Phone}
                  tone={contact.role ? "highlight" : "primary"}
                  className="size-10"
                />
                <span className="min-w-0">
                  {contact.role && (
                    <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {contact.role}
                    </span>
                  )}
                  <span className="block font-heading text-sm font-semibold leading-snug text-foreground">
                    {contact.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-sm text-primary group-hover:underline">
                    {contact.phone}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
