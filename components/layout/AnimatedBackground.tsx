export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-sun" aria-hidden="true">
      {/* ben-day screen, top-right */}
      <div className="dots-red-16 absolute -right-24 -top-24 h-[460px] w-[460px] rounded-bl-[140px] opacity-30" />

      {/* ink screen, bottom-left */}
      <div className="dots-ink-8 absolute -bottom-16 -left-16 h-[360px] w-[360px] rounded-tr-[120px] opacity-[0.12]" />

      {/* blue screen, mid-right */}
      <div className="dots-blue-16 absolute -right-20 bottom-[15%] h-[280px] w-[280px] rounded-bl-[100px] opacity-20" />
    </div>
  );
}
