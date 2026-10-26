/** Animated backdrop: drifting gradient blobs, grid, and floating CV sheets. */
const SHEETS = [
  { left: "6%", top: "18%", rot: "-12deg", delay: "0s", scale: 1 },
  { left: "86%", top: "12%", rot: "10deg", delay: "-2s", scale: 0.85 },
  { left: "90%", top: "62%", rot: "-8deg", delay: "-4s", scale: 1.1 },
  { left: "3%", top: "70%", rot: "9deg", delay: "-1s", scale: 0.9 },
];

function Sheet() {
  return (
    <div className="w-24 h-32 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 space-y-2">
      <div className="h-2 w-10 rounded bg-gradient-to-r from-indigo-400/70 to-violet-400/70" />
      <div className="h-1.5 w-full rounded bg-white/15" />
      <div className="h-1.5 w-4/5 rounded bg-white/15" />
      <div className="h-1.5 w-full rounded bg-white/10" />
      <div className="h-1.5 w-3/5 rounded bg-white/10" />
      <div className="h-1.5 w-4/5 rounded bg-white/10" />
    </div>
  );
}

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#07070d]" aria-hidden>
      <div className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-indigo-600/30 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-violet-600/25 blur-[130px] animate-blob-slow" />
      <div className="absolute -bottom-52 left-1/4 w-[34rem] h-[34rem] rounded-full bg-cyan-500/20 blur-[130px] animate-blob" />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <div className="hidden md:block">
        {SHEETS.map((s, i) => (
          <div
            key={i}
            className="absolute animate-floaty"
            style={
              {
                left: s.left,
                top: s.top,
                animationDelay: s.delay,
                "--r": s.rot,
                scale: String(s.scale),
              } as React.CSSProperties
            }
          >
            <Sheet />
          </div>
        ))}
      </div>
    </div>
  );
}
