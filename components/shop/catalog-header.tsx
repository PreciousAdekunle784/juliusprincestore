export function CatalogHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
}) {
  return (
    <section className="bg-ink text-paper">
      <div className="container-screen py-12 md:py-16">
        <p className="eyebrow text-accent mb-3">{eyebrow}</p>
        <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-slate leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
