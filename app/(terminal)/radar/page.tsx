import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { SignalNetwork } from "@/components/terminal/signal-network";
import { signals } from "@/lib/intelligence/mock-data";

export default function RadarPage() {
  return (
    <TerminalShell active="Radar">
      <PageTitle eyebrow="Relationship Intelligence" title="Radar" subtitle="Map the adjacency between topics, infrastructure, sources, and second-order consequences." />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Panel className="p-4"><SectionHeader eyebrow="Graph" title="Topic Relationships" /><SignalNetwork /></Panel>
        <Panel className="p-4">
          <SectionHeader eyebrow="Proximity" title="Nearest Movers" />
          {signals.map((signal) => <div key={signal.id} className="border-t border-rune-border py-3"><p className="font-medium">{signal.topic}</p><p className="text-sm text-rune-muted">Velocity {signal.velocity}% · Confidence {signal.confidence}%</p></div>)}
        </Panel>
      </div>
    </TerminalShell>
  );
}
