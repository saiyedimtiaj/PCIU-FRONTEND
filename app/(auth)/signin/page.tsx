import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Lock, Eye, ArrowRight, Check } from "lucide-react";
import { Checkbox } from "@base-ui/react/checkbox";
import AuthShell from "@/components/shared/AuthShell";
import { AuthField } from "@/components/shared/auth-field";
import { Button } from "@/components/ui/button";

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
          <Link href="/signup" className="font-semibold text-primary hover:text-accent transition-colors">
            Create one
          </Link>
        </>
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

        <AuthField
          label="Password"
          icon={<Lock />}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          trailing={<Eye aria-hidden />}
          action={
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-secondary hover:text-accent transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        <label className="flex items-center gap-2.5 text-sm text-muted-foreground select-none">
          <Checkbox.Root className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-input bg-card text-primary-foreground outline-none transition-colors data-checked:border-primary data-checked:bg-primary focus-visible:ring-3 focus-visible:ring-ring/50">
            <Checkbox.Indicator className="flex data-unchecked:hidden">
              <Check className="size-3" strokeWidth={3} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          Keep me signed in
        </label>

        <Button type="submit" size="cta" className="w-full">
          Sign In
          <ArrowRight />
        </Button>
      </form>
    </AuthShell>
  );
}
