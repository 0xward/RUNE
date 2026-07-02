export function HeroAgent() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden border border-rune-border bg-rune-panel shadow-terminal">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[42%_42%_46%_46%] border border-white/20 bg-black/40 animate-[agentFloat_6s_ease-in-out_infinite]">
        <div className="absolute -left-[18%] top-[14%] h-[24%] w-[34%] -rotate-12 border border-white/20 bg-rune-bg/80 clip-wing" />
        <div className="absolute -right-[18%] top-[14%] h-[24%] w-[34%] rotate-12 border border-white/20 bg-rune-bg/80 clip-wing" />
        <div className="absolute left-1/2 top-[18%] h-px w-[62%] -translate-x-1/2 bg-white/30" />
        <div className="absolute left-[22%] top-[38%] h-[12%] w-[18%] rounded-full border border-white/30 bg-white animate-[agentBlink_5s_ease-in-out_infinite]" />
        <div className="absolute right-[22%] top-[38%] h-[12%] w-[18%] rounded-full border border-white/30 bg-white animate-[agentBlink_5s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-[57%] h-[12%] w-px -translate-x-1/2 bg-white/30" />
        <div className="absolute left-1/2 top-[72%] h-px w-[26%] -translate-x-1/2 bg-white/60" />
        <div className="absolute left-1/2 top-[7%] h-[10%] w-[46%] -translate-x-1/2 rounded-t-full border border-white/20" />
      </div>
      <div className="absolute inset-x-8 bottom-8 grid grid-cols-4 gap-2 opacity-70">
        {[42, 68, 54, 86].map((height, index) => <div key={index} className="bg-white/70 animate-[agentBars_2.8s_ease-in-out_infinite]" style={{ height: `${height}px`, animationDelay: `${index * 160}ms` }} />)}
      </div>
      <div className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.32em] text-rune-muted">Hermes-class Signal Agent</div>
    </div>
  );
}
