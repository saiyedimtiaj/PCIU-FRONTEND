import { Skeleton } from "@/components/ui/skeleton";

export function CircularCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="h-1 rounded-none" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
        </div>
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="flex gap-2 border-t border-border/70 px-5 py-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}

export default function CircularsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading circulars" className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-14 w-40 rounded-xl" />
      </div>
      <div className="space-y-3 rounded-2xl border border-border bg-card p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_11rem_17rem]">
          <Skeleton className="h-11 sm:col-span-2 lg:col-span-1" />
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
        <div className="flex gap-2 border-t border-border/70 pt-3">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CircularCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
