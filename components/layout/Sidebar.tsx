"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dna,
  Bug,
  HeartPulse,
  GitFork,
  Building2,
  LayoutDashboard,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",       icon: LayoutDashboard, color: "text-violet-400",  glow: "shadow-violet-500/30" },
  { href: "/dna",       label: "DNA Profiler",    icon: Dna,             color: "text-violet-400",  glow: "shadow-violet-500/30" },
  { href: "/coldcases", label: "Cold Case Files", icon: Bug,             color: "text-red-400",     glow: "shadow-red-500/30"    },
  { href: "/mood",      label: "Mood Ring",       icon: HeartPulse,      color: "text-pink-400",    glow: "shadow-pink-500/30"   },
  { href: "/foodchain", label: "Food Chain",      icon: GitFork,         color: "text-emerald-400", glow: "shadow-emerald-500/30"},
  { href: "/city",      label: "3D City Explorer",icon: Building2,       color: "text-sky-400",     glow: "shadow-sky-500/30"    },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="relative flex h-full w-60 flex-col"
      style={{
        background: "rgba(5,8,22,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-2 px-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute inset-0 rounded-lg bg-violet-600/30 animate-pulse-glow" />
          <Sparkles className="relative h-4 w-4 text-violet-400" />
        </div>
        <span className="text-lg font-bold tracking-tight gradient-text-violet-cyan">
          CODE STAR
        </span>
        <Zap className="ml-auto h-3 w-3 text-cyan-400 opacity-60" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="mb-2 px-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Modules
          </p>
        </div>
        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon, color, glow }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                      active
                        ? cn("bg-white/10 shadow-lg", glow, color)
                        : "bg-white/5 text-white/30 group-hover:bg-white/8 group-hover:text-white/60"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
          <p className="text-xs text-white/40">IBM Bob AI — Active</p>
        </div>
      </div>
    </aside>
  );
}
