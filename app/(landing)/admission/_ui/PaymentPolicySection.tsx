import InfoCard from "@/components/shared/InfoCard";
import BulletList from "./BulletList";
import type { AdmissionPageContent } from "@/types/admission";

export default function PaymentPolicySection({
  content,
}: {
  content: AdmissionPageContent["paymentPolicy"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Payment Policy</h2>
      </div>

      <InfoCard title="Payment Rules">
        <BulletList items={content.rules} />
      </InfoCard>

      <h3 className="font-heading font-semibold text-lg text-foreground">
        Bank, Rocket &amp; bKash Payment Details
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {content.banks.map((bank) => (
          <InfoCard key={bank.name}>
            <p className="font-semibold text-foreground text-sm">🏦 {bank.name}</p>
            <p className="text-sm text-muted-foreground mt-1">A/C No: {bank.account}</p>
            <p className="text-sm text-muted-foreground">Branch: {bank.branch}</p>
          </InfoCard>
        ))}
      </div>
      <InfoCard className="border-l-4 border-l-highlight">
        <p className="text-sm text-muted-foreground">{content.bankNote}</p>
      </InfoCard>

      <InfoCard title={`📱 Rocket Payment — Biller ID: ${content.rocket.billerId}`}>
        <BulletList items={content.rocket.steps} />
      </InfoCard>

      <InfoCard title={`📱 bKash Payment — Merchant No: ${content.bkash.merchantNo}`}>
        <BulletList items={content.bkash.steps} />
      </InfoCard>

      <InfoCard title="📞 Payment By Dialing *247#">
        <BulletList items={content.ussd.steps} />
      </InfoCard>

      <InfoCard title="📞 For Any Query, Please Contact">
        <ul className="space-y-2">
          {content.contacts.map((c) => (
            <li key={c.phone} className="text-sm text-muted-foreground">
              {c.role && <span className="font-medium text-foreground">{c.role}: </span>}
              {c.name} — {c.phone}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
