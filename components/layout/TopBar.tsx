"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MODULES = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dna", label: "DNA" },
  { href: "/coldcases", label: "Cold Cases" },
  { href: "/mood", label: "Mood Ring" },
  { href: "/foodchain", label: "Food Chain" },
  { href: "/city", label: "City" },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 border-b-[3px] border-ink bg-white">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Search */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-full border-[3px] border-ink bg-sun px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-ink shadow-hard-xs transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_#0f0d0a] sm:flex"
          >
            Home
          </Link>
          <div className="flex h-9 w-40 cursor-pointer items-center gap-2 rounded-full border-[3px] border-ink bg-white px-3 text-ink/50 transition-colors hover:bg-newsprint sm:w-56">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden text-xs font-semibold sm:inline">Search modules…</span>
            <kbd className="ml-auto hidden rounded border-2 border-ink bg-sun px-1 py-0.5 text-[10px] font-extrabold text-ink sm:inline">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative h-9 w-9"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-ink bg-signal" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Settings" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-6 w-[3px] bg-ink" />

          {/* User avatar */}
          <div className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-full border-[3px] border-ink bg-process">
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-ink/30" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-white">
              A
            </span>
          </div>
        </div>
      </div>

      {/* Mobile module rail */}
      <nav
        aria-label="Modules"
        className="flex gap-2 overflow-x-auto border-t-[3px] border-ink px-4 py-2 lg:hidden"
      >
        {MODULES.map((m) => {
          const active = pathname === m.href || pathname.startsWith(m.href + "/");
          return (
            <Link
              key={m.href}
              href={m.href}
              className={cn(
                "shrink-0 rounded-full border-[3px] border-ink px-3 py-1 text-xs font-extrabold transition-all duration-100",
                active ? "bg-ink text-white" : "bg-white text-ink"
              )}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
