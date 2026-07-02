import { TrendingUp, Zap } from "lucide-react";
import { Panel, SectionHeader } from "./panel";
import { SignalNetwork } from "./signal-network";
import { MetricCard } from "./metric-card";
import { SourceMonitor } from "./source-monitor";
import { EngineHealth } from "./engine-health";
import { ForecastBand } from "./forecast-band";
import { supabase } from "@/lib/supabase/server";

async function getOverviewData() {
  const since3d = new Date(Date.now() - 86400000 * 3).toISOString();
  const since7d = new Date(Date.now() - 86400000 * 7).toISOString();

  const [signalRes, anomalyRes, forecastRes] = await Promise.all([
    supabase
      .from("signals")
      .select("topic_id, source, topics(name), signal_scores(momentum, confidence, velocity)")
      .gte("observed_at", since3d)
      .order("observed_at", { ascending: false })
      .limit(40),
    supabase
      .from("anomalies")
      .select("id, severity, summary, explanation, topics(name)")
      .gte("detected_at", since7d)
      .order("detected_at", { ascending: false })
      .limit(5),
    supabase
      .from("forecasts")
      .select("id, probability, horizon, summary, evidence, topics(name)")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  return {
    signalRows: (signalRes.data ?? []) as unknown as Array<{
      topic_id: string;
      source: string;
      topics: { name: string } | null;
      signal_scores: Array<{ momentum: number; confidence: number; velocity: number }> | null;
    }>,
    anomalies: (anomalyRes.data ?? []) as unknown as Array<{
      id: string;
      severity: string;
      summary: string;
      explanation: string;
      topics: { name: string } | null;
    }>,
    forecasts: (forecastRes.data ?? []) as unknown as Array<{
      id: string;
      probability: number;
      horizon: string;
      summary: string;
      evidence: string[];
      topics: { name: string } | null;
    }>,
  };
}

export async function OverviewTerminal() {
  const { signalRows, anomalies, forecasts } = await getOverviewData();

  // Aggregate signals by topic
  const topicMap = new Map<string, { name: string; scores: number[]; sources: Set<string> }>();
  for (const row of signalRows) {
    const name = row.topics?.name ?? "Unknown";
    if (!topicMap.has(name)) topicMap.set(name, { name, scores: [], sources: new Set() });
    const entry = topicMap.get(name)!;
    entry.sources.add(row.source);
    if (row.signal_scores?.[0]) entry.scores.push(row.signal_scores[0].momentum);
  }

  const signals = [...topicMap.values()].map((t) => ({
    id: t.name,
    topic: t.name,
    momentum: t.scores.length ? Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) : 0,
    confidence: Math.min(100, t.scores.length * 5 + 60),
    velocity: Math.min(100, t.scores.length * 4 + 50),
    growth: `${t.scores.length} signals`,
    sources: [...t.sources],
  })).sort((a, b) => b.momentum - a.momentum);

  const avgMomentum = signals.length ? Math.round(signals.reduce((a, s) => a + s.momentum, 0) / signals.length) : 0;
  const avgConfidence = signals.length ? Math.round(signals.reduce((a, s) => a + s.confidence, 0) / signals.length) : 0;

  const realityMetrics = [
    { label: "Reality Score", value: avgMomentum, suffix: "", detail: signals.length > 0 ? "live pipeline active" : "no data yet", trend: [40, 50, 45, 60, avgMomentum] },
    { label: "Active Signals", value: signals.length, suffix: "", detail: `${signalRows.length} raw items collected`, trend: [1, 2, 3, signals.length, signals.length] },
    { label: "Anomalies", value: anomalies.length, suffix: "", detail: "detected past 7 days", trend: [0, 0, 1, anomalies.length, anomalies.length] },
    { label: "Avg Confidence", value: avgConfidence, suffix: "%", detail: `${forecasts.length} forecasts generated`, trend: [50, 55, 60, 65, avgConfidence] },
  ];

  // Dossier
  const topSignal = signals[0];
  const topAnomaly = anomalies[0];
  const topForecast = forecasts[0];

  const dossierRows = [
    {
      label: "What changed",
      value: topSignal
        ? `${topSignal.topic} momentum at +${topSignal.momentum}% across ${topSignal.sources.join(", ")}.`
        : "No signal data yet — add topics to your watchlist.",
    },
    {
      label: "Why it matters",
      value: topForecast
        ? topForecast.summary
        : "Run the intelligence pipeline to generate AI-powered analysis.",
    },
    {
      label: "What is unusual",
      value: topAnomaly
        ? topAnomaly.explanation
        : "No anomalies detected. All topics within normal range.",
    },
    {
      label: "Next likely move",
      value: topForecast
        ? `${topForecast.probability}% probability — ${topForecast.evidence?.[0] ?? topForecast.summary}`
        : "Connect a provider to enable forecasting.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {realityMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Intelligence Dossier */}
      <Panel className="p-4">
        <SectionHeader eyebrow="Executive Synthesis" title="Intelligence Dossier" />
        <div className="grid gap-3 xl:grid-cols-2">
          {dossierRows.map((row) => (
            <div key={row.label} className="border border-rune-border p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-rune-muted">{row.label}</p>
              <p className="mt-3 text-sm leading-6 text-white">{row.value}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Signal Network + Signals list */}
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-4">
          <SectionHeader eyebrow="Relationship Map" title="Signal Network" />
          <SignalNetwork topics={signals.map((s) => ({ id: s.id, label: s.topic, momentum: s.momentum }))} />
        </Panel>
        <Panel className="p-4">
          <SectionHeader eyebrow="Ranked by velocity" title="Signals" />
          <div className="mt-3 space-y-2">
            {signals.length === 0 ? (
              <p className="text-sm text-rune-muted py-4">No signals yet.</p>
            ) : signals.map((signal) => (
              <div key={signal.id} className="border border-rune-border p-3 hover:bg-rune-panel/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium">{signal.topic}</h3>
                  <span className="shrink-0 font-semibold">+{signal.momentum}%</span>
                </div>
                <p className="mt-1.5 text-xs text-rune-muted">
                  {signal.growth} · Confidence {signal.confidence}% · Velocity {signal.velocity}%
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Source Monitor + Engine Health */}
      <div className="grid gap-4 xl:grid-cols-2">
        <SourceMonitor />
        <EngineHealth />
      </div>

      {/* Forecast Band */}
      <ForecastBand forecasts={forecasts} />

      {/* Anomalies + Forecast */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="p-4">
          <SectionHeader title="Anomalies" action={<Zap className="h-4 w-4" />} />
          <div className="mt-3 space-y-0">
            {anomalies.length === 0 ? (
              <p className="text-sm text-rune-muted py-4">No anomalies detected.</p>
            ) : anomalies.map((anomaly) => (
              <div key={anomaly.id} className="border-t border-rune-border py-3 first:border-t-0">
                <p className="text-sm">{anomaly.topics?.name} — {anomaly.summary}</p>
                <p className="mt-1 text-xs text-rune-muted">{anomaly.explanation}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-4">
          <SectionHeader title="Forecast" action={<TrendingUp className="h-4 w-4" />} />
          <div className="mt-3 space-y-0">
            {forecasts.length === 0 ? (
              <p className="text-sm text-rune-muted py-4">No forecasts yet.</p>
            ) : forecasts.map((forecast) => (
              <div key={forecast.id} className="border-t border-rune-border py-4 first:border-t-0">
                <div className="text-3xl font-semibold">{forecast.probability}%</div>
                <p className="mt-1 text-sm text-rune-muted">{forecast.summary}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-rune-muted">{forecast.horizon}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
