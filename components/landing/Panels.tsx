type Panel = {
  n: string;
  chip: string;
  title: string;
  body: string;
  mock: React.ReactNode;
};

function MockPopover() {
  return (
    <div className="relative min-h-[196px] overflow-hidden rounded-lg border-[3px] border-ink bg-newsprint">
      <div aria-hidden="true" className="dots-red-16 absolute inset-0 opacity-30" />
      <div className="relative m-4 rounded-md border-[3px] border-ink bg-white p-4 shadow-hard-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-[11px] uppercase tracking-[0.16em]">Scan done</span>
          <span className="rounded-full border-2 border-ink bg-sun px-2 py-0.5 text-[10px] font-extrabold">
            7 repos
          </span>
        </div>
        <ul className="mt-3 space-y-2 text-[11px] font-semibold leading-snug text-ink">
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 shrink-0 bg-signal" />
            34 open bugs ranked by severity.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-2 w-2 shrink-0 bg-process" />
            58 modules fingerprinted.
          </li>
        </ul>
        <div className="mt-4 flex justify-end">
          <span className="rounded-full border-2 border-ink bg-ink px-3 py-1 text-[10px] font-extrabold text-white">
            View report
          </span>
        </div>
      </div>
    </div>
  );
}

function MockCases() {
  const rows = [
    { v: "#1184", t: "Race in scan queue", d: "SEV-1" },
    { v: "#1179", t: "Flaky city renderer", d: "SEV-2" },
    { v: "#1163", t: "DNA drift on main", d: "SEV-3" },
  ];
  return (
    <div className="flex min-h-[196px] flex-col justify-center gap-3 rounded-lg border-[3px] border-ink bg-newsprint p-4">
      {rows.map((row) => (
        <div
          key={row.v}
          className="flex items-center gap-3 rounded-md border-2 border-ink bg-white px-3 py-2.5"
        >
          <span className="rounded-full border-2 border-ink bg-sun px-2 py-0.5 text-[10px] font-extrabold">
            {row.v}
          </span>
          <span className="flex-1 truncate text-[11px] font-bold">{row.t}</span>
          <span className="text-[10px] font-semibold text-ink/50">{row.d}</span>
        </div>
      ))}
    </div>
  );
}

function MockFanout() {
  const modules = ["DNA", "Cases", "Mood", "City"];
  return (
    <div className="flex min-h-[196px] flex-col justify-center gap-4 rounded-lg border-[3px] border-ink bg-newsprint p-4">
      <div className="flex flex-wrap gap-2">
        {modules.map((c) => (
          <span
            key={c}
            className="rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-extrabold"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="border-t-2 border-dashed border-ink/40" />
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border-2 border-ink bg-ink px-3 py-1 text-[11px] font-extrabold text-white">
          1 repo in
        </span>
        <span className="font-display text-sm text-ink">→</span>
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-[11px] font-extrabold">
          5 modules out
        </span>
      </div>
    </div>
  );
}

const PANELS: Panel[] = [
  {
    n: "01",
    chip: "bg-signal",
    title: "Point it at a repo",
    body: "Connect once. Bob AI walks the tree, fingerprints every module and files what it finds.",
    mock: <MockPopover />,
  },
  {
    n: "02",
    chip: "bg-process",
    title: "Read the case files",
    body: "Unsolved bugs land as cold cases with severity, history and a reproduction path.",
    mock: <MockCases />,
  },
  {
    n: "03",
    chip: "bg-ink",
    title: "Five modules, one repo",
    body: "DNA, cold cases, mood, food chain and the 3D city all read from the same scan.",
    mock: <MockFanout />,
  },
];

export function Panels() {
  return (
    <section id="panels" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-center">
          <span className="inline-block -rotate-2 border-[3px] border-ink bg-sun px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.3em] shadow-hard-xs">
            How it works
          </span>
          <h2 className="mt-6 font-display text-[clamp(32px,5vw,60px)] uppercase leading-[0.95] tracking-[-0.03em]">
            In three panels
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-7">
          {PANELS.map((panel) => (
            <article
              key={panel.n}
              className="relative rounded-xl border-[3px] border-ink bg-white p-6 pt-8 shadow-hard"
            >
              <span
                className={`absolute -left-4 -top-5 -rotate-6 border-[3px] border-ink px-3 py-1 font-display text-sm text-white ${panel.chip}`}
              >
                {panel.n}
              </span>
              {panel.mock}
              <h3 className="mt-6 font-display text-xl uppercase tracking-[-0.02em] sm:text-2xl">
                {panel.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">{panel.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
