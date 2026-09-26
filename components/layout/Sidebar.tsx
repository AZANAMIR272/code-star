"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dna, Bug, HeartPulse, GitFork, Building2, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tile: "bg-sun text-ink" },
  { href: "/dna", label: "DNA Profiler", icon: Dna, tile: "bg-process text-white" },
  { href: "/coldcases", label: "Cold Case Files", icon: Bug, tile: "bg-signal text-white" },
  { href: "/mood", label: "Mood Ring", icon: HeartPulse, tile: "bg-sun text-ink" },
  { href: "/foodchain", label: "Food Chain", icon: GitFork, tile: "bg-process text-white" },
  { href: "/city", label: "3D City Explorer", icon: Building2, tile: "bg-ink text-white" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative hidden h-full w-60 shrink-0 flex-col border-r-[3px] border-ink bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b-[3px] border-ink px-5">
        <span className="relative font-display text-lg tracking-[-0.02em] text-ink">
          CODE STAR
          <svg
            viewBox="0 0 220 220"
            className="absolute -right-3.5 -top-2 h-3.5 w-3.5"
            aria-hidden="true"
          >
            <polygon
              points="110.0,10.0 123.9,40.4 148.3,17.6 149.4,51.0 180.7,39.3 169.0,70.6 202.4,71.7 179.6,96.1 210.0,110.0 179.6,123.9 202.4,148.3 169.0,149.4 180.7,180.7 149.4,169.0 148.3,202.4 123.9,179.6 110.0,210.0 96.1,179.6 71.7,202.4 70.6,169.0 39.3,180.7 51.0,149.4 17.6,148.3 40.4,123.9 10.0,110.0 40.4,96.1 17.6,71.7 51.0,70.6 39.3,39.3 70.6,51.0 71.7,17.6 96.1,40.4"
              fill="#dc341e"
              stroke="#0f0d0a"
              strokeWidth="10"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="mb-3 px-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-ink/50">
            Modules
          </p>
        </div>
        <ul className="space-y-2 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon, tile }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-full border-[3px] border-ink px-3 py-2 text-sm font-extrabold transition-all duration-100",
                    active
                      ? "press bg-ink text-white shadow-hard-xs"
                      : "bg-white text-ink hover:bg-newsprint"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-ink",
                      tile
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t-[3px] border-ink px-4 py-4">
        <div className="flex items-center gap-2 rounded-md border-2 border-ink bg-newsprint px-3 py-2">
          <span className="h-2 w-2 rounded-full border-2 border-ink bg-signal" />
          <p className="text-xs font-bold text-ink">IBM watsonx.ai — Active</p>
        </div>
      </div>
    </aside>
  );
}
