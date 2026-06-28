import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { signals } from "@/lib/intelligence/mock-data";

export default function SignalsPage() {
  return (
    <TerminalShell active="Signals">
      <PageTitle eyebrow="Signal Registry" title="Signals" subtitle="Ranked source movement with momentum, confidence, velocity, and provenance." />
      <Panel className="p-4">
        <SectionHeader eyebrow="Live topics" title="Signal Table" />
        <div className="divide-y divide-rune-border">
          {signals.map((signal) => (
            <div key={signal.id} className="grid gap-3 py-4 md:grid-cols-[1fr_120px_140px_160px] md:items-center">
              <div><h2 className="font-medium">{signal.topic}</h2><p className="text-sm text-rune-muted">{signal.sources.join(" / ")}</p></div>
              <div className="text-sm">+{signal.momentum}% momentum</div>
              <div className="text-sm text-rune-muted">{signal.confidence}% confidence</div>
              <div className="h-1.5 bg-zinc-900"><div className="h-full bg-white" style={{ width: `${signal.velocity}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>
    </TerminalShell>
  );
}
