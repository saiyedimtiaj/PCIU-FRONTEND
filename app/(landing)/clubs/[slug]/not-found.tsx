import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function ClubNotFound() {
  return (
    <main className="container mx-auto px-4 py-20">
      <EmptyState
        size="lg"
        title="Club not found"
        description="This club doesn't exist, is no longer active, or couldn't be loaded right now."
        action={
          <Button variant="outlineAccent" render={<Link href="/clubs" />} nativeButton={false}>
            <ArrowLeft className="size-4" />
            Browse all clubs
          </Button>
        }
      />
    </main>
  );
}
