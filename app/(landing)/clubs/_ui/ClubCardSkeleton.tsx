/** Placeholder matching ClubCard's profile-card layout. */
export default function ClubCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="aspect-2/1 animate-pulse bg-muted" />
      <div className="flex gap-3.5 px-5">
        <div className="-mt-9 size-18 shrink-0 animate-pulse rounded-2xl bg-muted ring-4 ring-card" />
        <div className="flex-1 space-y-2 pt-3">
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-2.5 px-5 pt-4 pb-5">
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
          <div className="flex -space-x-1.5">
            <div className="size-7 animate-pulse rounded-full border-2 border-card bg-muted" />
            <div className="size-7 animate-pulse rounded-full border-2 border-card bg-muted" />
          </div>
          <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
