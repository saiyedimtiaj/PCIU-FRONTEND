import type { Metadata } from "next";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { Checkbox } from "@base-ui/react/checkbox";
import AuthShell from "@/components/shared/AuthShell";
import { AuthField } from "@/components/shared/auth-field";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Create Account | Port City International University",
  description: "Create your Port City International University account.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      image="/images/gallery/graduation.jpg"
      imageAlt="PCIU convocation ceremony"
      eyebrow="Join PCIU"
      headline="Your Journey Starts"
      headlineAccent="Here"
      blurb="Create your account to explore programs, track applications, and connect with the PCIU community."
      stats={[
        { value: "8", label: "Departments" },
        { value: "3", label: "Faculties" },
        { value: "15+", label: "Years" },
      ]}
      quote={{
        text: "From orientation to graduation, PCIU felt like a place that was genuinely invested in who I'd become.",
        author: "Nusrat Jahan",
        role: "CSE, Class of 2024",
      }}
      formTitle="Create your account"
      formSubtitle="Join thousands of students pursuing excellence at PCIU."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:text-accent transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5">
        <AuthField
          label="Full name"
          icon={<User />}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="John Doe"
        />

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
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <AuthField
          label="Confirm password"
          icon={<Lock />}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <label className="flex items-start gap-2.5 text-sm text-muted-foreground select-none">
          <Checkbox.Root className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-input bg-card text-primary-foreground outline-none transition-colors data-checked:border-primary data-checked:bg-primary focus-visible:ring-3 focus-visible:ring-ring/50">
            <Checkbox.Indicator className="flex data-unchecked:hidden">
              <Check className="size-3" strokeWidth={3} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span>
            I agree to the{" "}
            <Link href="#" className="font-medium text-secondary hover:text-accent transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-secondary hover:text-accent transition-colors">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" size="cta" className="w-full">
          Create Account
          <ArrowRight />
        </Button>
      </form>
    </AuthShell>
  );
}
