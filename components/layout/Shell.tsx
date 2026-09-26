import { AnimatedBackground } from "./AnimatedBackground";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <AnimatedBackground />
      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="animate-fade-in flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
