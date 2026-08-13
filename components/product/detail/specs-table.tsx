export function SpecsTable({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs ?? {});
  if (entries.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-5">Specifications</h2>
      <dl className="border border-black/[0.08] rounded-[5px] overflow-hidden">
        {entries.map(([k, v], i) => (
          <div
            key={k}
            className={`grid grid-cols-[40%_60%] sm:grid-cols-[30%_70%] ${i % 2 ? "bg-mist/50" : "bg-paper"}`}
          >
            <dt className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-wide text-slate border-r border-black/[0.06]">
              {k}
            </dt>
            <dd className="px-4 py-3 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
