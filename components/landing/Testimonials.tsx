type Tail = "left" | "center" | "right";

const TAIL: Record<Tail, { ink: string; white: string; row: string }> = {
  left: {
    ink: "left-[30px]",
    white: "left-[34px]",
    row: "self-start",
  },
  center: {
    ink: "left-1/2 -translate-x-1/2",
    white: "left-1/2 -translate-x-1/2",
    row: "self-center",
  },
  right: {
    ink: "right-[30px]",
    white: "right-[34px]",
    row: "self-end",
  },
};

const QUOTES: {
  quote: string;
  name: string;
  role: string;
  initial: string;
  avatar: string;
  tail: Tail;
}[] = [
  {
    quote: "“CODE STAR reads a repo once and every module already has its answer.”",
    name: "Syed Muhammad Azan",
    role: "Team Lead — AI Engineer & Researcher",
    initial: "S",
    avatar: "bg-signal",
    tail: "left",
  },
  {
    quote: "“Cold Cases turned our bug backlog into something we actually finish.”",
    name: "Isbah Ali",
    role: "Backend Developer",
    initial: "I",
    avatar: "bg-process",
    tail: "right",
  },
  {
    quote: "“Mood Ring caught a crunch week before it hit the sprint.”",
    name: "Mariam Zuberi",
    role: "Frontend Developer & AI",
    initial: "M",
    avatar: "bg-ink",
    tail: "left",
  },
  {
    quote: "“Food Chain pointed straight at the fragile modules nobody wanted to touch.”",
    name: "Muhammad Safwan",
    role: "Backend AI & ML",
    initial: "M",
    avatar: "bg-signal",
    tail: "right",
  },
];

export function Testimonials() {
  return (
    <section className="bg-sun">
      <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-center font-display text-[clamp(32px,5vw,60px)] uppercase leading-[0.95] tracking-[-0.03em]">
          Word on the street
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-10 xl:grid-cols-4 xl:gap-8">
          {QUOTES.map((item) => {
            const tail = TAIL[item.tail];
            return (
              <figure key={item.name} className="flex flex-col">
                <blockquote className="relative rounded-2xl border-[3px] border-ink bg-white p-6 shadow-hard-sm">
                  <p className="text-base font-semibold leading-relaxed text-ink">{item.quote}</p>
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-[22px] h-0 w-0 border-x-[11px] border-t-[22px] border-x-transparent border-t-ink ${tail.ink}`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-[14px] h-0 w-0 border-x-[7px] border-t-[14px] border-x-transparent border-t-white ${tail.white}`}
                  />
                </blockquote>

                <figcaption
                  className={`mt-9 flex items-center gap-3 ${tail.row} ${
                    item.tail === "right" ? "flex-row-reverse text-right" : ""
                  }`}
                >
                  <span
                    className={`relative block h-14 w-14 shrink-0 overflow-hidden rounded-full border-[3px] border-ink ${item.avatar}`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-ink/25"
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-white">
                      {item.initial}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold text-ink">{item.name}</span>
                    <span className="block text-xs font-semibold text-ink/60">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
