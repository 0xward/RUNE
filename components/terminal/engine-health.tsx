import { supabase } from "@/lib/supabase/server";
import { Panel, SectionHeader } from "./panel";

const PIPELINE_STAGES = [
  "Signal Collection",
  "Signal Scoring",
  "Trend Detection",
  "Anomaly Detection",
  "Forecast Generation",
  "Confidence Calculation",
];

async function getPipelineStats() {
  const since = new Date(Date.now() - 86400000).toISOString();
  const [signals, anomalies, forecasts] = await Promise.all([
    supabase.from("signals").select("*", { count: "exact", head: true }).gte("observed_at", since),
    supabase.from("anomalies").select("*", { count: "exact", head: true }).gte("detected_at", since),
    supabase.from("forecasts").select("*", { count: "exact", head: true }).gte("created_at", since),
  ]);
  return {
    signals: signals.count ?? 0,
    anomalies: anomalies.count ?? 0,
    forecasts: forecasts.count ?? 0,
  };
}

export async function EngineHealth() {
  const stats = await getPipelineStats();
  const stageCounts = [stats.signals, stats.signals, stats.signals, stats.anomalies, stats.forecasts, stats.forecasts];

  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Pipeline" title="Engine Health" />
      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage, index) => (
          <div key={stage} className="grid grid-cols-[28px_1fr_auto] gap-3 text-sm items-center">
            <div className="flex h-7 w-7 items-center justify-center border border-rune-border text-xs">
              {index + 1}
            </div>
            <p className="leading-6 text-rune-muted">{stage}</p>
            <span className="text-xs text-rune-muted tabular-nums">
              {stageCounts[index] > 0 ? (
                <span className="text-white">{stageCounts[index]}</span>
              ) : (
                <span className="opacity-40">—</span>
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-rune-border pt-3">
        <p className="text-[10px] text-rune-muted">
          24h · {stats.signals} signals · {stats.anomalies} anomalies · {stats.forecasts} forecasts
        </p>
      </div>
    </Panel>
  );
}
