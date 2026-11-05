/** Placeholder matching ClubCard's profile-card layout. */
export default function ClubCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-primary/5">
      <div className="aspect-[27/10] animate-pulse bg-muted" />
      <div className="relative -mt-11 flex justify-center">
        <div className="size-22 animate-pulse rounded-full bg-muted ring-4 ring-card" />
      </div>
      <div className="flex flex-col items-center space-y-2.5 px-5 pt-3 pb-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-10 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
