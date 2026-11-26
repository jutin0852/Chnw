// Shown instantly when moving between admin pages, while the next page's data loads.
// The sidebar and header stay in place, so navigation feels immediate instead of frozen.
export default function AdminLoading() {
  return (
    <section aria-busy="true" aria-label="Loading" className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded-md bg-black/10" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-black/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg border border-black/10 bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-lg border border-black/10 bg-white" />
    </section>
  );
}
