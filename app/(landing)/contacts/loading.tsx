import PageBanner from "@/components/shared/PageBanner";

export default function ContactsLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true">
      <PageBanner
        title="Contact Our Administration"
        subtitle="Find the right office and get in touch with Port City International University."
        align="left"
        variant="gradient"
      />
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-border bg-muted/50"
            />
          ))}
        </div>
        <span className="sr-only" role="status">
          Loading administration contacts
        </span>
      </div>
    </main>
  );
}
