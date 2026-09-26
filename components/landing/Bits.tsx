const STAR_POINTS =
  "110.0,10.0 123.9,40.4 148.3,17.6 149.4,51.0 180.7,39.3 169.0,70.6 202.4,71.7 179.6,96.1 210.0,110.0 179.6,123.9 202.4,148.3 169.0,149.4 180.7,180.7 149.4,169.0 148.3,202.4 123.9,179.6 110.0,210.0 96.1,179.6 71.7,202.4 70.6,169.0 39.3,180.7 51.0,149.4 17.6,148.3 40.4,123.9 10.0,110.0 40.4,96.1 17.6,71.7 51.0,70.6 39.3,39.3 70.6,51.0 71.7,17.6 96.1,40.4";

export function Starburst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      <polygon
        points={STAR_POINTS}
        fill="#dc341e"
        stroke="#0f0d0a"
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(-8deg)", filter: "drop-shadow(4px 4px 0 #0f0d0a)" }}
      aria-hidden="true"
    >
      <div className="relative">
        <Starburst className="h-full w-full" />
        <span
          className="absolute inset-0 flex items-center justify-center font-display text-[13px] leading-none text-white sm:text-base"
          style={{ transform: "rotate(-5deg)" }}
        >
          NEW!
        </span>
      </div>
    </div>
  );
}

export function MiniStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      <polygon
        points={STAR_POINTS}
        fill="#dc341e"
        stroke="#0f0d0a"
        strokeWidth="10"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarkerUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 34"
      preserveAspectRatio="none"
      className={`absolute -bottom-[0.14em] left-0 z-0 h-[0.3em] w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M7 19 C 62 7, 142 3, 221 9 C 256 12, 281 17, 296 24 L 294 32 C 269 25, 249 21, 218 18 C 145 11, 66 16, 9 29 Z"
        fill="#dc341e"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block font-display tracking-[-0.02em] ${className}`}>
      CODE STAR
      <MiniStar className="absolute -right-4 -top-2 h-3.5 w-3.5" />
    </span>
  );
}
