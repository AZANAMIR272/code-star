import { Bell, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header
      className="flex h-14 items-center justify-between px-6 z-10 relative"
      style={{
        background: "rgba(5,8,22,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-56 items-center gap-2 rounded-lg bg-white/5 px-3 border border-white/8 text-white/40 hover:border-white/15 transition-colors cursor-pointer">
          <Search className="h-3 w-3 shrink-0" />
          <span className="text-xs">Search modules…</span>
          <kbd className="ml-auto text-[10px] bg-white/10 rounded px-1 py-0.5">⌘K</kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Notification bell with dot */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-8 w-8 text-white/40 hover:text-white/80 hover:bg-white/5"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/60" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className="h-8 w-8 text-white/40 hover:text-white/80 hover:bg-white/5"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-violet-500/20 cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
