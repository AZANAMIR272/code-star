import Link from "next/link";
import { Wordmark } from "./Bits";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["Dashboard", "/dashboard"],
      ["DNA Profiler", "/dna"],
      ["Cold Cases", "/coldcases"],
      ["Mood Ring", "/mood"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/"],
      ["Blog", "/"],
      ["Careers", "/"],
      ["Contact", "/"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/"],
      ["Privacy", "/"],
      ["Security", "/"],
    ],
  },
];

export function CtaFooter() {
  return (
    <>
      <section className="relative overflow-hidden bg-process">
        <div
          aria-hidden="true"
          className="dots-white-16 pointer-events-none absolute -bottom-10 -left-10 h-[70%] w-[70%] rounded-tr-[140px] opacity-25 sm:w-[55%]"
        />
        <div className="relative mx-auto max-w-[1000px] px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="font-display text-[clamp(34px,6vw,68px)] uppercase leading-[0.95] tracking-[-0.03em] text-white">
            Ready to crack it?
          </h2>
          <div className="mt-9 flex justify-center">
            <Link
              href="/dashboard"
              className="press rounded-none border-[3px] border-ink bg-sun px-8 py-4 font-display text-base uppercase tracking-wide text-ink shadow-hard sm:text-lg"
            >
              Open dashboard
            </Link>
          </div>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-white/85 sm:text-sm">
            First scan free · Set up in 4 minutes
          </p>
        </div>
      </section>

      <footer className="border-t-[3px] border-ink bg-newsprint">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <div className="col-span-2 sm:col-span-4 lg:col-span-1">
              <Link href="/" className="inline-block text-2xl text-ink">
                <Wordmark />
              </Link>
              <p className="mt-4 max-w-[260px] text-sm font-medium leading-relaxed text-ink/70">
                Five modules, one scan.
                <br />
                Your codebase, loud and clear.
              </p>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/60">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm font-bold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-4"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-ink/20 pt-6">
            <p className="text-xs font-semibold text-ink/50">
              © 2026 CODE STAR · Powered by IBM Bob AI · All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
