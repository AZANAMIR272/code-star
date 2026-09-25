import { AnimatedBackground } from "./AnimatedBackground";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <AnimatedBackground />
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
