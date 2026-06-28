import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { engineStages } from "@/lib/intelligence/engine";

export default function SettingsPage() {
  return (
    <TerminalShell active="Settings">
      <PageTitle eyebrow="Terminal Configuration" title="Settings" subtitle="Configure source weighting, confidence thresholds, forecast horizons, and alert delivery." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="p-5"><SectionHeader eyebrow="Engine" title="Pipeline Stages" />{engineStages.map((stage) => <p key={stage} className="border-t border-rune-border py-3 text-sm leading-6 text-rune-muted">{stage}</p>)}</Panel>
        <Panel className="p-5"><SectionHeader eyebrow="Defaults" title="Operating Parameters" />{["Minimum confidence: 72%", "Anomaly threshold: 2.5σ", "Forecast horizons: 30D / 90D / 180D", "Provider consensus: majority weighted"].map((item) => <p key={item} className="border-t border-rune-border py-3 text-sm text-rune-muted">{item}</p>)}</Panel>
      </div>
    </TerminalShell>
  );
}
