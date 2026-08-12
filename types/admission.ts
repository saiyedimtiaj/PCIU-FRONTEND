import type { IconName } from "@/lib/icons";

export interface RequirementGroup {
  title: string;
  icon: IconName;
  items: string[];
}

export interface ProgramRequirement {
  program: string;
  req: string;
}

export interface AdmissionTestTrack {
  title: string;
  subjects: string[];
  footer: string;
}

export interface NumberedStep {
  step: number;
  text?: string;
  title?: string;
  desc?: string;
}

export interface BankAccount {
  name: string;
  account: string;
  branch: string;
}

export interface PaymentContact {
  name: string;
  role: string;
  phone: string;
}

export interface TuitionRow {
  program: string;
  credits: string;
  perCredit: string;
  total: string;
}

export interface MbaFeeRow {
  background: string;
  freshCredits: string;
  freshTotal: string;
}

export interface OtherFeeRow {
  item: string;
  amount: string;
}

export interface Scholarship {
  name: string;
  eligibility: string;
  benefit: string;
  icon: string;
}

export interface OfficeHour {
  day: string;
  time: string;
}

export interface AdmissionPageContent {
  requirement: {
    intro: string;
    bachelor: RequirementGroup[];
    mastersGeneral: string[];
    programSpecific: ProgramRequirement[];
  };
  admissionTest: {
    intro: string;
    tracks: AdmissionTestTrack[];
    guidelines: string[];
    admitCardSteps: NumberedStep[];
    note: string;
  };
  directAdmission: {
    intro: string;
    undergraduateEligibility: string[];
    mastersEligibility: string[];
    process: NumberedStep[];
    note: string;
  };
  documentsRequired: {
    bachelor: { atSubmission: string[]; atAdmission: string[] };
    masters: { atSubmission: string[]; atAdmission: string[] };
    note: string;
  };
  paymentPolicy: {
    rules: string[];
    banks: BankAccount[];
    bankNote: string;
    rocket: { billerId: string; steps: string[] };
    bkash: { merchantNo: string; steps: string[] };
    ussd: { steps: string[] };
    contacts: PaymentContact[];
  };
  onlineAdmission: {
    intro: string;
    steps: string[];
    portalUrl: string;
    note: string;
  };
  tuitionFees: {
    intro: string;
    undergraduate: TuitionRow[];
    masters: TuitionRow[];
    mba: MbaFeeRow[];
    other: OtherFeeRow[];
    note: string;
  };
  scholarship: {
    intro: string;
    scholarships: Scholarship[];
    howToApply: string[];
  };
  admissionContact: {
    office: { address: string; phone: string; email: string; website: string };
    officeHours: OfficeHour[];
    seasonNote: string;
  };
}

export const ADMISSION_SECTION_IDS = [
  "admission-advertisement",
  "requirement",
  "admission-schedule",
  "admission-test",
  "direct-admission",
  "documents-required",
  "payment-policy",
  "online-admission",
  "tuition-fees",
  "faq",
  "admission-test-result",
  "scholarship",
  "admission-contact",
] as const;

export type AdmissionSectionId = (typeof ADMISSION_SECTION_IDS)[number];
