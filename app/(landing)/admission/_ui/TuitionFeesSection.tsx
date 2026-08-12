import InfoCard from "@/components/shared/InfoCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdmissionPageContent } from "@/types/admission";

export default function TuitionFeesSection({
  content,
}: {
  content: AdmissionPageContent["tuitionFees"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Tuition & Fees</h2>
      </div>

      <InfoCard>
        <p className="text-sm text-muted-foreground">{content.intro}</p>
      </InfoCard>

      <InfoCard title="Bachelor's Degree Programs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Per Credit (BDT)</TableHead>
              <TableHead>Total (BDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.undergraduate.map((row) => (
              <TableRow key={row.program}>
                <TableCell>{row.program}</TableCell>
                <TableCell>{row.credits}</TableCell>
                <TableCell>৳{row.perCredit}</TableCell>
                <TableCell className="font-medium text-foreground">৳{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>

      <InfoCard title="Master's Degree Programs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Per Credit (BDT)</TableHead>
              <TableHead>Total (BDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.masters.map((row) => (
              <TableRow key={row.program}>
                <TableCell>{row.program}</TableCell>
                <TableCell>{row.credits}</TableCell>
                <TableCell>৳{row.perCredit}</TableCell>
                <TableCell className="font-medium text-foreground">৳{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>

      <InfoCard title="MBA Program Fees (Per Credit: ৳1,600)">
        <p className="text-xs text-muted-foreground mb-3">
          Credit hours vary based on academic background. Job experience reduces credit
          requirements (must be business-related, counted from last degree).
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Academic Background</TableHead>
              <TableHead>Fresh Graduates Credits</TableHead>
              <TableHead>Total (BDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.mba.map((row) => (
              <TableRow key={row.background}>
                <TableCell>{row.background}</TableCell>
                <TableCell>{row.freshCredits}</TableCell>
                <TableCell className="font-medium text-foreground">৳{row.freshTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>

      <InfoCard title="Other Fees & Charges">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Amount (BDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.other.map((row) => (
              <TableRow key={row.item}>
                <TableCell>{row.item}</TableCell>
                <TableCell className="font-medium text-foreground">৳{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>

      <InfoCard className="border-l-4 border-l-highlight">
        <p className="text-sm text-muted-foreground">{content.note}</p>
      </InfoCard>
    </div>
  );
}
