const LOGOS = [
  { name: "PIXELFORGE", className: "tracking-[0.2em]" },
  { name: "northwind", className: "tracking-[-0.03em] lowercase" },
  { name: "HELIOTYPE", className: "tracking-[0.06em]" },
  { name: "Okapi Labs", className: "tracking-[0.02em]" },
  { name: "VOLTA°", className: "tracking-[0.14em]" },
];

export function Proof() {
  return (
    <section className="relative overflow-hidden border-y-[3px] border-ink bg-newsprint">
      <div
        aria-hidden="true"
        className="dots-ink-8 pointer-events-none absolute inset-0 opacity-[0.09]"
      />
      <div className="relative mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12">
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.3em] text-ink/70">
          Scanned every day by teams at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {LOGOS.map((logo) => (
            <span
              key={logo.name}
              className={`font-display text-base uppercase text-ink/75 sm:text-xl ${logo.className}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
