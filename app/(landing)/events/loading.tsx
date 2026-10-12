export default function EventsLoading() {
  return (
    <main className="container mx-auto px-4 py-12 sm:px-6">
      <div className="mb-8 h-10 w-56 animate-pulse rounded bg-muted" />
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-11 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
