import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { anomalies } from "@/lib/intelligence/mock-data";
import { buildTriageChecklist } from "@/lib/intelligence/workflow/triage";

export default function AnomaliesPage() {
  return (
    <TerminalShell active="Anomalies">
      <PageTitle eyebrow="Outlier Detection" title="Anomalies" subtitle="Unusual movement, source-cluster breaks, and evidence that deviates from baseline reality." />
      <Panel className="p-4">
        <SectionHeader eyebrow="Detected events" title="Anomaly Queue" />
        {anomalies.map((anomaly) => (
          <article key={anomaly.id} className="border-t border-rune-border py-5">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center"><h2 className="font-medium">{anomaly.title}</h2><span className="text-xs uppercase tracking-[0.22em] text-rune-muted">{anomaly.severity}</span></div>
            <p className="mt-2 text-sm leading-6 text-rune-muted">{anomaly.explanation}</p>
            <p className="mt-2 text-xs text-rune-muted">Observed {new Date(anomaly.observedAt).toUTCString()}</p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {buildTriageChecklist(anomaly).map((item) => <p key={item} className="border border-rune-border px-3 py-2 text-xs text-rune-muted">{item}</p>)}
            </div>
          </article>
        ))}
      </Panel>
    </TerminalShell>
  );
}
