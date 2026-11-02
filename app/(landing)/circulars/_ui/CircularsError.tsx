"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, TriangleAlert } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function CircularsError({ message }: { message: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-card">
      <EmptyState
        variant="icon"
        icon={<TriangleAlert className="size-6 text-destructive" />}
        title="Circulars are unavailable"
        description={message}
        action={
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
          >
            <RotateCcw className={pending ? "animate-spin" : undefined} />
            {pending ? "Retrying…" : "Try again"}
          </Button>
        }
      />
    </div>
  );
}
