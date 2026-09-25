export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#050816]" />

      {/* Animated orbs */}
      <div
        className="animate-float absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="animate-float2 absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "2s",
        }}
      />
      <div
        className="animate-float absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "4s",
        }}
      />
      <div
        className="animate-float2 absolute top-1/2 left-1/2 h-[300px] w-[300px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "1s",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />
    </div>
  );
}
