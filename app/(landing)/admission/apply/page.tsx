import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  Headset,
  House,
  Mail,
  MousePointerClick,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import pageData from "@/content/admission/page.json";
import type { AdmissionPageContent } from "@/types/admission";
import ApplyChoiceCard from "./_ui/ApplyChoiceCard";

const content = pageData as AdmissionPageContent;

export const metadata: Metadata = {
  title: "Online Admission | Port City International University",
  description: "Apply online for a Bachelor's or Master's program at Port City International University.",
};

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Choose your level",
    text: "Select Bachelor's or Master's based on your latest completed qualification.",
  },
  {
    icon: FileCheck2,
    title: "Add your details",
    text: "Enter personal information, academic results and the program you want to study.",
  },
  {
    icon: Send,
    title: "Review and submit",
    text: "Check every entry carefully, then send your application to the admission team.",
  },
  {
    icon: CheckCircle2,
    title: "Verify documents",
    text: "Bring your original documents to PCIU when the Admission Office contacts you.",
  },
];

const STEP_TONES = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent/20 text-accent-hover",
  "bg-success-light text-success",
] as const;

const admissionPhone = content.admissionContact.office.phone.split("\n")[0];
const admissionEmail = content.admissionContact.office.email;

export default function AdmissionApplyPage() {
  return (
    <div className="min-h-screen bg-background font-admin">
      <section id="programs" className="scroll-mt-24 border-b border-border bg-linear-to-b from-secondary-light/35 to-background py-12 sm:py-16 lg:py-20">

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
              <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
                <House className="size-4" />
                Home
              </Link>
              <ChevronRight className="size-3.5 text-border" />
              <Link href="/admission" className="transition-colors hover:text-primary">
                Admission
              </Link>
              <ChevronRight className="size-3.5 text-border" />
              <span className="text-primary">Apply Online</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-3.5 text-accent-hover" />
              Online Application
            </span>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Choose Your <span className="text-secondary">Program Level</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start with the study level that matches your qualification. Each path takes you directly to the right PCIU application form.
            </p>
          </div>

          <div className="mx-auto mt-11 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
            <ApplyChoiceCard
              icon={GraduationCap}
              number="01"
              tone="blue"
              level="Bachelor's"
              title="Undergraduate Programs"
              description="Build your foundation after HSC, O/A-Level, Diploma or an equivalent qualification."
              meta={[
                { label: "Program options", value: `${content.tuitionFees.undergraduate.length}+` },
                { label: "Typical duration", value: "4 years" },
              ]}
              points={[
                content.requirement.bachelor[0].items[0],
                content.requirement.bachelor[1].items[0],
                "Keep your SSC and HSC or equivalent results ready before you begin.",
              ]}
              href="/admission/apply/bachelor"
            />
            <ApplyChoiceCard
              icon={BookOpen}
              number="02"
              tone="gold"
              level="Master's"
              title="Graduate Programs"
              description="Advance your career with postgraduate study across PCIU's professional and academic disciplines."
              meta={[
                { label: "Program options", value: `${content.tuitionFees.masters.length + 1}+` },
                { label: "Typical duration", value: "1–2 years" },
              ]}
              points={[
                content.requirement.mastersGeneral[0],
                content.requirement.mastersGeneral[2],
                "Keep your Bachelor's transcript and certificate ready before you begin.",
              ]}
              href="/admission/apply/master"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div aria-hidden className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Simple from start to finish</span>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your application journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four clear steps take you from choosing a program to document verification.
            </p>
          </div>

          <ol className="relative mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-11 hidden border-t border-dashed border-primary/20 lg:block" />
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="group relative rounded-3xl border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/25 hover:bg-muted/20"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`relative z-10 flex size-12 items-center justify-center rounded-2xl ${STEP_TONES[index]}`}>
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-heading text-4xl font-black text-primary/[0.08]">0{index + 1}</span>
                </div>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="relative mx-auto mt-12 flex max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-primary px-6 py-7 text-white sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div aria-hidden className="absolute -right-16 -top-24 size-64 rounded-full bg-secondary/55 blur-3xl" />
            <div aria-hidden className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-accent/18 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-accent text-black">
                <Headset className="size-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Need help choosing?</p>
                <h2 className="mt-1 font-heading text-2xl font-bold">Talk to the PCIU Admission Office</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
                  Ask about eligibility, available programs or which application path is right for you.
                </p>
              </div>
            </div>
            <div className="relative mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <a
                href={`tel:${admissionPhone}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-primary transition-colors hover:bg-white/90"
              >
                <Phone className="size-4" />
                {admissionPhone}
              </a>
              <a
                href={`mailto:${admissionEmail}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <Mail className="size-4" />
                Email admission
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
