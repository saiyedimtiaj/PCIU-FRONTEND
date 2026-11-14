"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

/**
 * Unexpected render errors under /clubs and /clubs/[slug]. API failures
 * don't land here — getClubs/getClub return null and the pages show their
 * own empty / not-found states.
 */
export default function ClubsError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="container mx-auto px-4 py-20">
      <EmptyState
        size="lg"
        title="Something went wrong"
        description="We couldn't load this page right now. Please try again in a moment."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="accent" onClick={() => retry()}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
            <Button variant="outlineAccent" render={<Link href="/clubs" />} nativeButton={false}>
              <ArrowLeft className="size-4" />
              All clubs
            </Button>
          </div>
        }
      />
    </main>
  );
}
