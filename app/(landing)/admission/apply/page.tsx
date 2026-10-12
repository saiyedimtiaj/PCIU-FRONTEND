import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Headset,
  House,
  Landmark,
  MousePointerClick,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import pageData from "@/content/admission/page.json";
import type { AdmissionPageContent } from "@/types/admission";
import ApplyChoiceCard from "./_ui/ApplyChoiceCard";
import ApplyInfoAccordion from "./_ui/ApplyInfoAccordion";

const content = pageData as AdmissionPageContent;

export const metadata: Metadata = {
  title: "Online Admission | Port City International University",
  description: "Apply online for a Bachelor's or Master's program at Port City International University.",
};

const { paymentPolicy } = content;

const PAYMENT_METHODS = [
  {
    icon: Landmark,
    name: "Bank Deposit",
    detail: paymentPolicy.banks.map((bank) => bank.name.replace(/ Ltd\.?$/, "")).join(" & "),
    iconClass: "bg-primary/10 text-primary",
  },
  {
    icon: Smartphone,
    name: "Rocket Bill Pay",
    detail: `Biller ID ${paymentPolicy.rocket.billerId}`,
    iconClass: "bg-secondary/10 text-secondary",
  },
  {
    icon: Wallet,
    name: "bKash",
    detail: `Merchant ${paymentPolicy.bkash.merchantNo} · App or *247#`,
    iconClass: "bg-accent/20 text-accent-hover",
  },
];

const paymentHelp = paymentPolicy.contacts[0];

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Choose a Program",
    text: "Pick Bachelor's or Master's and select the program you want to study.",
  },
  {
    icon: ClipboardList,
    title: "Fill the Form",
    text: "Enter your personal details and academic records from SSC onward.",
  },
  {
    icon: CreditCard,
    title: "Pay the Fee",
    text: "Pay the application fee via bank, Rocket or bKash using your reference ID.",
  },
  {
    icon: FileCheck2,
    title: "Verify Documents",
    text: "Bring your original documents to the Admission Office within 15 working days.",
  },
];

export default function AdmissionApplyPage() {
  return (
    <div className="min-h-screen bg-background font-admin">
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero-campus.jpg"
          alt="Port City International University campus"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary via-primary/90 to-primary/55" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary/80 via-transparent to-transparent" />

        <div className="container mx-auto px-4 pb-24 pt-8 sm:pb-28 sm:pt-10">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-heading text-sm font-semibold text-white/75 backdrop-blur-md sm:text-base"
          >
            <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
              <House className="size-4" />
              Home
            </Link>
            <ChevronRight className="size-4 text-white/40" />
            <Link href="/admission" className="transition-colors hover:text-accent">
              Admission
            </Link>
            <ChevronRight className="size-4 text-white/40" />
            <span className="text-accent">Online Application</span>
          </nav>

          <div className="mt-14 max-w-3xl sm:mt-20">
            <h1 className="font-heading text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Welcome to PCIU
              <br />
              <span className="text-accent">Online Admission</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Start your journey at Port City International University. Apply for an undergraduate or
              graduate program from anywhere — the whole application takes about ten minutes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                variant="highlight"
                size="cta"
                className="h-12 px-7 text-base"
                render={<Link href="/admission/apply/bachelor" />}
                nativeButton={false}
              >
                Apply for Bachelor&apos;s
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="cta"
                className="h-12 border border-white/40 bg-white/10 px-7 text-base text-white backdrop-blur-sm hover:bg-white hover:text-primary"
                render={<Link href="/admission/apply/master" />}
                nativeButton={false}
              >
                Apply for Master&apos;s
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="programs"
        className="relative isolate scroll-mt-24 overflow-hidden bg-secondary-light/40 py-20 sm:py-24"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(230 70% 50% / 0.35) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div aria-hidden className="absolute -left-32 top-10 -z-10 size-96 rounded-full bg-secondary/15 blur-[130px]" />
        <div aria-hidden className="absolute -right-32 bottom-0 -z-10 size-96 rounded-full bg-accent/20 blur-[130px]" />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Choose Your <span className="text-secondary">Program Level</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Two paths, one simple application. Pick the level that matches your qualification.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            <ApplyChoiceCard
              icon={GraduationCap}
              tone="blue"
              level="Undergraduate"
              title="Bachelor's Program"
              description="Begin your university journey right after HSC, O/A-Level or an equivalent qualification."
              points={["4-year honours programs", "Requires SSC & HSC results", "Minimum GPA 2.50 in SSC & HSC"]}
              href="/admission/apply/bachelor"
            />
            <ApplyChoiceCard
              icon={BookOpen}
              tone="gold"
              level="Graduate"
              title="Master's Program"
              description="Take the next step in your career with postgraduate study across PCIU's faculties."
              points={["Graduate & professional programs", "Requires a Bachelor's degree", "Second class or equivalent CGPA"]}
              href="/admission/apply/master"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Four Simple Steps to <span className="text-secondary">Apply</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              From choosing a program to confirming your seat — here&apos;s how the process works.
            </p>
          </div>

          <ol className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const last = i === STEPS.length - 1;
              return (
                <li key={step.title} className="relative flex flex-col items-center text-center">
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute left-[calc(50%+3.5rem)] right-[calc(-50%+3.5rem)] top-12 hidden border-t-2 border-dashed border-secondary/30 lg:block"
                    />
                  )}
                  <div className="relative">
                    <span
                      className={
                        last
                          ? "flex size-24 items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-hover text-black ring-8 ring-accent/15"
                          : "flex size-24 items-center justify-center rounded-full bg-linear-to-br from-secondary to-primary text-white ring-8 ring-secondary/10"
                      }
                    >
                      <step.icon className="size-10" />
                    </span>
                    <span className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-accent font-heading text-sm font-bold text-black">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-heading text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 max-w-60 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="payment" className="scroll-mt-24 bg-muted/50 py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Instructions &amp; <span className="text-secondary">Payment</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Read the applicant instructions, then pay the application fee using any of these methods.
              </p>

              <ul className="mt-8 space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <li
                    key={method.name}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${method.iconClass}`}
                    >
                      <method.icon className="size-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-base font-semibold text-foreground">{method.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{method.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-primary p-5 text-white">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-black">
                  <Headset className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold">Payment questions?</p>
                  <a
                    href={`tel:${paymentHelp.phone}`}
                    className="font-heading text-lg font-bold text-accent transition-colors hover:text-white"
                  >
                    {paymentHelp.phone}
                  </a>
                </div>
              </div>
            </div>

            <ApplyInfoAccordion
              onlineAdmission={content.onlineAdmission}
              paymentPolicy={content.paymentPolicy}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
