export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border pb-14 pt-32">
      <div className="circuit-bg absolute inset-0 -z-10 opacity-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_50%_-20%,rgba(57,230,58,0.12),transparent)]" />
      <div className="mx-auto max-w-7xl px-5">
        {eyebrow && (
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
