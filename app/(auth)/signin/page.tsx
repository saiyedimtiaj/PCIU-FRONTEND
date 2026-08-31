import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import AuthShell from "@/components/shared/AuthShell";
import { SignInForm } from "./_ui/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Port City International University",
  description: "Sign in to your Port City International University account.",
};

export default function SignInPage() {
  return (
    <AuthShell
      image="/images/hero-campus.jpg"
      imageAlt="PCIU main campus"
      preloadImage
      eyebrow="Welcome Back"
      headline="Where the Bay Meets"
      headlineAccent="Brilliance"
      blurb="Access your courses, results, notices and campus services from one place."
      stats={[
        { value: "5,000+", label: "Students" },
        { value: "120+", label: "Faculty" },
        { value: "25+", label: "Programs" },
      ]}
      quote={{
        text: "PCIU gave me more than a degree — it gave me a network that opened doors across the country.",
        author: "Tanvir Ahmed",
        role: "BBA, Class of 2023",
      }}
      formTitle="Sign in to your account"
      formSubtitle="Enter your credentials to continue."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-accent transition-colors"
          >
            Create one
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
