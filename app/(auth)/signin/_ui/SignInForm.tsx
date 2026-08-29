"use client";

import Link from "next/link";
import { Mail, Lock, Eye, ArrowRight, Check } from "lucide-react";
import { Checkbox } from "@base-ui/react/checkbox";
import { AuthField } from "@/components/shared/auth-field";
import { Button } from "@/components/ui/button";
import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/(auth)/actions";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      setError(null);
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // Redirect to a dashboard or home page on successful login
        router.push("/dashboard");
      }
    });
  };
  return (
    <form className="space-y-5" onSubmit={handleLogin}>
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}
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
        <Checkbox.Root
          name="rememberMe"
          className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border text-primary-foreground outline-none transition-colors data-checked:border-primary data-checked:bg-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Checkbox.Indicator className="data-unchecked:hidden">
            <Check className="size-3" strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Keep me signed in
      </label>

      <Button type="submit" size="cta" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
        <ArrowRight />
      </Button>
    </form>
  );
}
