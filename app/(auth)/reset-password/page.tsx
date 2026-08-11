import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Eye, ArrowLeft, ShieldCheck } from "lucide-react";
import AuthShell from "@/components/shared/AuthShell";
import { AuthField } from "@/components/shared/auth-field";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reset Password | Port City International University",
  description: "Choose a new password for your Port City International University account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      image="/images/gallery/lab-research.jpg"
      imageAlt="Students in a PCIU research laboratory"
      eyebrow="Secure Your Account"
      headline="Choose a Strong"
      headlineAccent="New Password"
      blurb="Your new password should be at least 8 characters and different from previously used passwords."
      stats={[
        { value: "256-bit", label: "Encrypted" },
        { value: "0", label: "Data Shared" },
        { value: "24/7", label: "Support" },
      ]}
      formTitle="Set a new password"
      formSubtitle="Enter and confirm your new password below."
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
          label="New password"
          icon={<Lock />}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          trailing={<Eye aria-hidden />}
        />

        <AuthField
          label="Confirm new password"
          icon={<Lock />}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          trailing={<Eye aria-hidden />}
        />

        <Button type="submit" size="cta" className="w-full">
          Reset Password
          <ShieldCheck />
        </Button>
      </form>
    </AuthShell>
  );
}
