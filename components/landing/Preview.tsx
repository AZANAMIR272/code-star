const CHECKS = [
  "DNA fingerprint of every module",
  "Cold-case files for unsolved bugs",
  "Mood and health scores on one board",
];

const ENTRIES = [
  {
    tag: "Case #1184",
    isNew: true,
    date: "Mar 4",
    title: "Race condition in scan queue",
    desc: "Reproduced twice, fixed in twelve lines.",
  },
  {
    tag: "DNA",
    isNew: false,
    date: "Feb 19",
    title: "Module fingerprint baseline",
    desc: "58 modules mapped across seven repos.",
  },
];

function ChromeDot({ className }: { className: string }) {
  return <span className={`block h-3 w-3 rounded-full border-2 border-ink ${className}`} />;
}

export function Preview() {
  return (
    <section className="border-y-[3px] border-ink bg-newsprint">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <h2 className="font-display text-[clamp(32px,5vw,56px)] uppercase leading-[0.95] tracking-[-0.03em]">
            Your codebase,
            <br />
            x-rayed.
          </h2>
          <p className="mt-6 max-w-[460px] text-base font-medium leading-relaxed text-ink/75">
            A repo nobody understands is just a pile of files. CODE STAR reads it once, then hands
            every team the same map — with the bugs, the drift and the crunch flagged in bold.
          </p>

          <ul className="mt-8 space-y-4">
            {CHECKS.map((item) => (
              <li key={item} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-[3px] border-ink bg-signal">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M4 12.5 L9.5 18 L20 6"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-base font-bold leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-hard">
          <div className="flex items-center gap-2 border-b-[3px] border-ink bg-newsprint px-4 py-3">
            <ChromeDot className="bg-signal" />
            <ChromeDot className="bg-sun" />
            <ChromeDot className="bg-white" />
            <div className="ml-2 flex-1 truncate rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-bold text-ink/55">
              code-star.app/reports
            </div>
          </div>

          <div className="relative border-b-[3px] border-ink px-5 py-7 sm:px-7">
            <div aria-hidden="true" className="dots-red-8 absolute inset-0 opacity-70" />
            <div className="relative inline-block border-[3px] border-ink bg-white px-4 py-2 font-display text-lg uppercase tracking-[-0.02em] shadow-hard-xs sm:text-2xl">
              Scan report
            </div>
          </div>

          <div className="px-5 py-6 sm:px-7">
            {ENTRIES.map((entry, i) => (
              <div key={entry.tag}>
                {i > 0 && <div className="my-5 border-t-2 border-dashed border-ink/30" />}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border-2 border-ink bg-sun px-2.5 py-1 text-xs font-extrabold">
                    {entry.tag}
                  </span>
                  {entry.isNew && (
                    <span className="border-2 border-ink bg-signal px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
                      New
                    </span>
                  )}
                  <span className="ml-auto text-xs font-semibold text-ink/50">{entry.date}</span>
                </div>
                <h3 className="mt-3 text-base font-extrabold sm:text-lg">{entry.title}</h3>
                <p className="mt-1 text-sm font-medium text-ink/70">{entry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
