import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft, SendHorizontal } from "lucide-react";
import AuthShell from "@/components/shared/AuthShell";
import { AuthField } from "@/components/shared/auth-field";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Forgot Password | Port City International University",
  description: "Reset the password for your Port City International University account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      image="/images/campus-life-library.jpg"
      imageAlt="Students studying in the PCIU library"
      eyebrow="Account Recovery"
      headline="We'll Help You Get"
      headlineAccent="Back In"
      blurb="It happens to everyone. Enter your email and we'll send you a link to reset your password."
      stats={[
        { value: "24/7", label: "Support" },
        { value: "<5 min", label: "Reset Time" },
        { value: "100%", label: "Secure" },
      ]}
      formTitle="Forgot your password?"
      formSubtitle="No worries — enter your email and we'll send you a reset link."
      footer={
        <Link
          href="/signin"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5">
        <AuthField
          label="Email address"
          icon={<Mail />}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
        />

        <Button type="submit" size="cta" className="w-full">
          Send Reset Link
          <SendHorizontal />
        </Button>
      </form>
    </AuthShell>
  );
}
