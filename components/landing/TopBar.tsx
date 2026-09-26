import Link from "next/link";
import { Wordmark } from "./Bits";

const NAV = [
  { label: "Dashboard", href: "/dashboard", solid: true },
  { label: "DNA", href: "/dna", solid: false },
  { label: "Cold Cases", href: "/coldcases", solid: false },
  { label: "Mood Ring", href: "/mood", solid: false },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-sun">
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-[22px] leading-none text-ink sm:text-[26px]">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`press rounded-full border-[3px] border-ink px-4 py-1.5 text-sm font-extrabold shadow-hard-xs ${
                item.solid ? "bg-ink text-white" : "bg-white text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <Link
            href="/dashboard"
            className="hidden text-sm font-extrabold text-ink underline-offset-4 hover:underline sm:block"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="press press-sun rounded-none border-[3px] border-ink bg-ink px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-white shadow-hard-sun sm:px-5 sm:text-base"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
