export default function NewsLoading() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
