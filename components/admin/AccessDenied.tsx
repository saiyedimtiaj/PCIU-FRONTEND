"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, LockKeyhole, ShieldX, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccess } from "@/features/permissions/use-access";

function prettyRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Full-page "no access" screen for an admin page the signed-in role isn't
 * allowed to use — shown instead of a form or a table whose every request
 * would come back 403.
 */
export default function AccessDenied({
  title = "You don't have access to this page",
  description = "Your role isn't allowed to use this section of the dashboard.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const { role } = useAccess();

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Decorative glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[15%] top-[20%] size-56 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative w-full max-w-lg animate-fade-in-up rounded-3xl border border-border bg-card/90 p-8 text-center shadow-xl backdrop-blur sm:p-10">
        {/* Icon: glowing shield with a lock badge */}
        <div className="relative mx-auto mb-7 size-24">
          <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-accent opacity-25 blur-xl" />
          <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-accent shadow-glow ring-8 ring-primary/10">
            <ShieldX className="size-10 text-white" strokeWidth={1.75} />
          </div>
          <span className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border border-border bg-card shadow-md">
            <LockKeyhole className="size-4 text-primary" />
          </span>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Error 403 · Restricted
        </p>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {role && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-foreground">
            <UserRound className="size-3.5 text-muted-foreground" />
            Signed in as <span className="font-semibold">{prettyRole(role)}</span>
          </div>
        )}

        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-3 text-left text-xs leading-relaxed text-muted-foreground">
          Need access? Ask a <span className="font-semibold text-foreground">Super Admin</span> to
          turn it on for your role in <span className="font-semibold text-foreground">System → Permissions</span>.
        </div>

        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <Button variant="outlineMuted" size="cta" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Button variant="highlight" size="cta" render={<Link href="/admin" />} nativeButton={false}>
            <LayoutDashboard className="size-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
