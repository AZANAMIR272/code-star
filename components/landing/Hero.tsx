import Link from "next/link";
import { MarkerUnderline, NewBadge } from "./Bits";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-sun">
      <div
        aria-hidden="true"
        className="dots-red-16 pointer-events-none absolute -right-16 top-0 h-[340px] w-[62%] rounded-bl-[96px] opacity-40 sm:h-[440px] sm:w-[56%]"
      />

      <div className="relative mx-auto max-w-[1100px] px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24">
        <span className="inline-block -rotate-2 border-[3px] border-ink bg-white px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.3em] shadow-hard-xs sm:text-xs">
          5 modules · Powered by IBM Bob AI
        </span>

        <div className="relative mt-8">
          <h1 className="font-display text-[clamp(44px,8vw,96px)] uppercase leading-[0.92] tracking-[-0.035em] text-ink">
            Crack the{" "}
            <span className="relative inline-block">
              <span className="relative z-10">code.</span>
              <MarkerUnderline />
            </span>
          </h1>
          <NewBadge className="absolute -top-16 right-0 h-16 w-16 sm:-top-14 sm:h-20 sm:w-20 lg:-right-10 lg:-top-12 lg:h-28 lg:w-28" />
        </div>

        <p className="mx-auto mt-7 max-w-[680px] text-base font-semibold leading-relaxed text-ink sm:text-lg">
          Five modules read your repo — DNA fingerprints, cold-case bugs, team mood, dependency food
          chains.
          <br className="hidden sm:block" /> Your codebase, mapped loud and clear.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="press rounded-none border-[3px] border-ink bg-signal px-7 py-3.5 font-display text-base uppercase tracking-wide text-white shadow-hard sm:text-lg"
          >
            Open dashboard
          </Link>
          <a
            href="#panels"
            className="press rounded-full border-[3px] border-ink bg-white px-7 py-3.5 font-display text-base uppercase tracking-wide text-ink shadow-hard sm:text-lg"
          >
            See the modules
          </a>
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-ink/70 sm:text-sm">
          No setup · First scan free · Cancel anytime
        </p>
      </div>
    </section>
  );
}
