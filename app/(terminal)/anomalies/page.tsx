import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { supabase } from "@/lib/supabase/server";
import { buildTriageChecklist } from "@/lib/intelligence/workflow/triage";
import type { Anomaly } from "@/lib/intelligence/types";

export const revalidate = 300;

async function getAnomalies() {
  const since = new Date(Date.now() - 86400000 * 7).toISOString();
  const { data } = await supabase
    .from("anomalies")
    .select("id, severity, summary, explanation, detected_at, topics(name)")
    .gte("detected_at", since)
    .order("detected_at", { ascending: false })
    .limit(20);
  return (data ?? []) as unknown as Array<{
    id: string;
    severity: Anomaly["severity"];
    summary: string;
    explanation: string;
    detected_at: string;
    topics: { name: string } | null;
  }>;
}

export default async function AnomaliesPage() {
  const anomalies = await getAnomalies();

  return (
    <TerminalShell active="Anomalies">
      <PageTitle eyebrow="Outlier Detection" title="Anomalies" subtitle="Unusual movement, source-cluster breaks, and evidence that deviates from baseline reality." />
      <Panel className="p-4">
        <SectionHeader eyebrow={`${anomalies.length} detected`} title="Anomaly Queue" />
        {anomalies.length === 0 ? (
          <p className="py-8 text-sm text-rune-muted text-center">No anomalies detected in the past 7 days.</p>
        ) : (
          anomalies.map((anomaly) => {
            const asAnomaly: Anomaly = {
              id: anomaly.id,
              title: anomaly.summary,
              severity: anomaly.severity,
              observedAt: anomaly.detected_at,
              explanation: anomaly.explanation,
            };
            return (
              <article key={anomaly.id} className="border-t border-rune-border py-5">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <h2 className="font-medium">{anomaly.topics?.name ?? ""} — {anomaly.summary}</h2>
                  <span className="text-xs uppercase tracking-[0.22em] text-rune-muted">{anomaly.severity}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-rune-muted">{anomaly.explanation}</p>
                <p className="mt-2 text-xs text-rune-muted">Observed {new Date(anomaly.detected_at).toUTCString()}</p>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  {buildTriageChecklist(asAnomaly).map((item) => (
                    <p key={item} className="border border-rune-border px-3 py-2 text-xs text-rune-muted">{item}</p>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </Panel>
    </TerminalShell>
  );
}
