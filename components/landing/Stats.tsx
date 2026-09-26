const STATS = [
  { value: "18k", label: "Bugs closed" },
  { value: "4.2M", label: "Lines scanned" },
  { value: "63%", label: "Faster triage" },
];

export function Stats() {
  return (
    <section className="border-y-[3px] border-ink bg-ink">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 py-16 text-center sm:grid-cols-3 sm:gap-6 sm:py-20">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="font-display text-[clamp(40px,7vw,64px)] leading-none tracking-[-0.03em] text-sun">
              {stat.value}
            </div>
            <div className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white sm:text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
