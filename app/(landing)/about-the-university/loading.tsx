export default function AboutUniversityLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="flex h-[52vh] min-h-[340px] flex-col items-center justify-center gap-4 bg-primary px-4 sm:min-h-[400px] md:h-[60vh] md:max-h-[640px]">
        <div className="h-7 w-36 animate-pulse rounded-full bg-white/15" />
        <div className="h-12 w-64 animate-pulse rounded-lg bg-white/15 sm:h-16 sm:w-96" />
        <div className="h-5 w-full max-w-md animate-pulse rounded bg-white/10" />
      </div>

      <div className="container mx-auto px-4 pt-6 pb-12 sm:pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-4 w-44 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">
            {/* Main text */}
            <div className="space-y-4">
              <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded bg-muted"
                  style={{ width: `${[100, 96, 92, 98, 70, 100, 94, 60][index]}%` }}
                />
              ))}
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="h-80 animate-pulse rounded-2xl bg-primary/15" />
              <div className="h-52 animate-pulse rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
