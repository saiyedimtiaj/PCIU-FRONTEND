import type { LucideIcon } from "lucide-react";
import {
  Award,
  Banknote,
  BookOpen,
  Building2,
  GraduationCap,
  ReceiptText,
} from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAdmissionFeeStructure,
  getMbaEligibility,
  getProgramTuitionFees,
  type AdmissionFeeStructureData,
  type MbaEligibilityData,
  type ProgramTuitionFeeData,
  type ProgramType,
} from "@/lib/api/admission";
import type { AdmissionPageContent } from "@/types/admission";

type ProgramGroup = {
  type: ProgramType;
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  tone: "primary" | "highlight";
};

const PROGRAM_GROUPS: ProgramGroup[] = [
  {
    type: "UNDERGRADUATE",
    eyebrow: "Undergraduate",
    title: "Bachelor's Degree Programs",
    icon: BookOpen,
    tone: "primary",
  },
  {
    type: "GRADUATE",
    eyebrow: "Postgraduate",
    title: "Master's Degree Programs",
    icon: Award,
    tone: "highlight",
  },
];

const TONE_TILE = {
  primary: "bg-primary text-primary-foreground shadow-primary/20",
  highlight: "bg-highlight text-highlight-foreground shadow-highlight/25",
} as const;

type ProgramFeesResult =
  | { status: "success"; data: ProgramTuitionFeeData[] }
  | { status: "empty" }
  | { status: "error" };

function formatBdt(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `৳${new Intl.NumberFormat("en-BD", {
        maximumFractionDigits: 2,
      }).format(amount)}`
    : `৳${value}`;
}

export default async function TuitionFeesSection({
  content,
}: {
  content: AdmissionPageContent["tuitionFees"];
}) {
  const [tuitionResult, mbaResult, feeResult] = await Promise.all([
    getProgramTuitionFees(),
    getMbaEligibility(),
    getAdmissionFeeStructure(),
  ]);

  return (
    <section
      aria-labelledby="tuition-fees-title"
      className="space-y-6 sm:space-y-8"
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Banknote aria-hidden="true" className="size-3.5" />
          Tuition &amp; charges
        </div>
        <h2
          id="tuition-fees-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Tuition &amp; Fees
        </h2>
      </header>

      <InfoCard>
        <p className="text-sm leading-6 text-muted-foreground">
          {content.intro}
        </p>
      </InfoCard>

      {PROGRAM_GROUPS.map((group) => (
        <ProgramFeesGroup
          key={group.type}
          group={group}
          result={
            tuitionResult.status === "success"
              ? { status: "success", data: tuitionResult.data[group.type] }
              : tuitionResult
          }
        />
      ))}

      <InfoCard>
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 pt-0.5">
            <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              MBA Program Fees
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Compare credit requirements and tuition by academic background.
            </p>
          </div>
        </div>
        {mbaResult.status === "success" ? (
          mbaResult.data.length ? (
            <MbaFeeTable data={mbaResult.data} />
          ) : (
            <ApiState status="empty" label="MBA program fees" />
          )
        ) : (
          <ApiState status={mbaResult.status} label="MBA program fees" />
        )}
      </InfoCard>

      <InfoCard>
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ReceiptText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 pt-0.5">
            <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
              Other Fees &amp; Charges
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Additional fees required during the admission process.
            </p>
          </div>
        </div>
        {feeResult.status === "success" ? (
          <OtherFeeDetails data={feeResult.data} />
        ) : (
          <ApiState status={feeResult.status} label="Other fees & charges" />
        )}
      </InfoCard>

      <InfoCard className="border-l-4 border-l-primary">
        <p className="text-sm leading-6 text-muted-foreground">
          {content.note}
        </p>
      </InfoCard>
    </section>
  );
}

function ProgramFeesGroup({
  group,
  result,
}: {
  group: ProgramGroup;
  result: ProgramFeesResult;
}) {
  const headingId = `tuition-${group.type.toLowerCase()}-heading`;
  const programs = result.status === "success" ? result.data : [];
  const lowestTotal = programs.length
    ? Math.min(...programs.map((p) => Number(p.totalFees)))
    : null;
  const Icon = group.icon;

  return (
    <section aria-labelledby={headingId} className="space-y-4 sm:space-y-5">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md",
              TONE_TILE[group.tone],
            )}
          >
            <Icon className="size-5 stroke-2" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {group.eyebrow}
            </p>
            <h3
              id={headingId}
              className="font-heading text-lg font-bold leading-snug text-foreground sm:text-xl"
            >
              {group.title}
            </h3>
          </div>
        </div>
        {programs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              {programs.length} programs
            </span>
            {lowestTotal !== null && Number.isFinite(lowestTotal) && (
              <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                From {formatBdt(String(lowestTotal))}
              </span>
            )}
          </div>
        )}
      </div>

      {result.status === "error" ? (
        <ApiState status="error" label={group.title} />
      ) : programs.length === 0 ? (
        <ApiState status="empty" label={group.title} />
      ) : (
        <ProgramFeeTable programs={programs} caption={group.title} />
      )}
    </section>
  );
}

function ProgramFeeTable({
  programs,
  caption,
}: {
  programs: ProgramTuitionFeeData[];
  caption: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm motion-safe:transition motion-safe:duration-300 hover:shadow-lg hover:shadow-primary/5">
      <Table className="min-w-160">
        <caption className="sr-only">{caption} tuition fees</caption>
        <TableHeader>
          <TableRow className="border-primary/10 bg-primary hover:bg-primary">
            <TableHead className="w-12 text-center text-primary-foreground">
              #
            </TableHead>
            <TableHead className="min-w-64 text-primary-foreground">
              Program
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-primary-foreground">
              Credits
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-primary-foreground">
              Per Credit (BDT)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-primary-foreground">
              Total Fee (BDT)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program, index) => (
            <TableRow
              key={program.id}
              className="group/row even:bg-muted/25 hover:bg-primary/4"
            >
              <TableCell className="text-center">
                <span className="inline-flex size-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-heading text-[11px] font-bold text-primary transition-colors group-hover/row:bg-primary group-hover/row:text-primary-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </TableCell>
              <TableCell className="min-w-64 whitespace-normal py-3">
                <p className="font-semibold text-foreground">
                  {program.program}
                </p>
                {program.departmentName && (
                  <p className="mt-0.5 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
                    <Building2
                      aria-hidden="true"
                      className="mt-0.5 size-3.5 shrink-0 text-primary/60"
                    />
                    {program.departmentName}
                  </p>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums">
                {program.credit}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
                {formatBdt(program.perCreditAmount)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right font-heading font-bold tabular-nums text-primary">
                {formatBdt(program.totalFees)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground md:hidden">
        Scroll horizontally to view all columns.
      </p>
    </div>
  );
}

function MbaFeeTable({ data }: { data: MbaEligibilityData[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table className="min-w-[680px]">
        <caption className="sr-only">
          MBA program fees by academic background
        </caption>
        <TableHeader>
          <TableRow className="border-primary/10 bg-primary hover:bg-primary">
            <TableHead className="min-w-56 text-primary-foreground">
              Academic Background
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-primary-foreground">
              Credits Required
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-primary-foreground">
              Per Credit (BDT)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right text-primary-foreground">
              Total Fee (BDT)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tier) => (
            <TableRow
              key={tier.id}
              className="group/row hover:bg-primary/[0.035]"
            >
              <TableCell className="min-w-56 whitespace-normal font-medium text-foreground">
                {tier.academicBackground}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums">
                {tier.creditsRequired}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
                {formatBdt(tier.perCreditFeeBDT)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums text-primary">
                {formatBdt(tier.totalFeeBDT)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
        Scroll horizontally to view all columns on smaller screens.
      </p>
    </div>
  );
}

function OtherFeeDetails({ data }: { data: AdmissionFeeStructureData }) {
  const fees = [
    {
      label: "Admission fee",
      description: "One-time fee payable upon admission",
      amount: data.admissionFeeBDT,
    },
    {
      label: "Admission form fee",
      description: "Application form processing charge",
      amount: data.admissionFormFeeBDT,
    },
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {fees.map((fee) => (
        <div
          key={fee.label}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary/12">
            <ReceiptText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <dt className="text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
              {fee.label}
            </dt>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {fee.description}
            </p>
            <dd className="mt-2 font-heading text-xl font-bold tabular-nums text-primary sm:text-2xl">
              {formatBdt(fee.amount)}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

function ApiState({
  status,
  label,
}: {
  status: "empty" | "error";
  label: string;
}) {
  if (status === "error") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/20 bg-destructive/5 p-4"
      >
        <p className="text-sm font-medium text-foreground">
          Unable to load {label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <p
      role="status"
      className="rounded-xl border border-dashed border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground"
    >
      {label} are not available at the moment.
    </p>
  );
}

export function TuitionFeesSectionSkeleton() {
  return (
    <section
      aria-label="Loading tuition and fees"
      aria-busy="true"
      className="space-y-6"
    >
      <div className="h-9 w-56 animate-pulse rounded bg-muted" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
      {[0, 1].map((group) => (
        <div key={group} className="space-y-4">
          <div className="h-11 w-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-72 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      ))}
      <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
    </section>
  );
}
