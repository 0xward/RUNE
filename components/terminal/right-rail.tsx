"use client";

import { Activity, Bell, Shield, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function RailSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-rune-border px-5 py-5 last:border-b-0">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-rune-muted">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h3>
      {children}
    </div>
  );
}

interface SignalSummary { topic: string; momentum: number }
interface AnomalySummary { id: string; title: string }
interface ProviderSummary { id: string; name: string; status: string }
interface ForecastSummary { id: string; probability: number; thesis: string; horizon: string }

export function RightRail() {
  const [signals, setSignals] = useState<SignalSummary[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalySummary[]>([]);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [forecasts, setForecasts] = useState<ForecastSummary[]>([]);

  useEffect(() => {
    fetch("/api/signals")
      .then((r) => r.json())
      .then((res) => {
        const rows = (res.data ?? []) as Array<{ topics: { name: string } | null; signal_scores: Array<{ momentum: number }> | null }>;
        const map = new Map<string, number[]>();
        for (const row of rows) {
          const name = row.topics?.name ?? "Unknown";
          if (!map.has(name)) map.set(name, []);
          if (row.signal_scores?.[0]) map.get(name)!.push(row.signal_scores[0].momentum);
        }
        const agg = [...map.entries()]
          .map(([topic, scores]) => ({ topic, momentum: Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1)) }))
          .sort((a, b) => b.momentum - a.momentum)
          .slice(0, 4);
        setSignals(agg);
      })
      .catch(() => setSignals([]));

    fetch("/api/anomalies")
      .then((r) => r.json())
      .then((res) => {
        const rows = (res.data ?? []) as Array<{ id: string; summary: string }>;
        setAnomalies(rows.slice(0, 4).map((a) => ({ id: a.id, title: a.summary })));
      })
      .catch(() => setAnomalies([]));

    fetch("/api/providers")
      .then((r) => r.json())
      .then((res) => {
        const rows = (res.data ?? []) as Array<{ id: string; name: string; status: string }>;
        setProviders(rows);
      })
      .catch(() => setProviders([]));

    fetch("/api/forecasts")
      .then((r) => r.json())
      .then((res) => {
        const rows = (res.data ?? []) as Array<{ id: string; probability: number; summary: string; horizon: string }>;
        setForecasts(rows.slice(0, 1).map((f) => ({ id: f.id, probability: f.probability, thesis: f.summary, horizon: f.horizon })));
      })
      .catch(() => setForecasts([]));
  }, []);

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto border-l border-rune-border bg-rune-bg">
      <div className="border-b border-rune-border px-5 py-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-rune-muted">Live Context</p>
        <h2 className="mt-1 text-base font-semibold">Intelligence Summary</h2>
      </div>

      <RailSection icon={TrendingUp} title="Emerging Signals">
        {signals.length === 0 ? (
          <p className="text-sm text-rune-muted">No signals yet.</p>
        ) : (
          <div className="space-y-2">
            {signals.map((signal) => (
              <div key={signal.topic} className="flex items-center justify-between">
                <span className="text-sm text-rune-muted">{signal.topic}</span>
                <span className="text-sm font-medium">+{signal.momentum}%</span>
              </div>
            ))}
          </div>
        )}
      </RailSection>

      <RailSection icon={Bell} title="Latest Alerts">
        {anomalies.length === 0 ? (
          <p className="text-sm text-rune-muted">No anomalies detected.</p>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="border-l-2 border-rune-border pl-3">
                <p className="text-xs leading-4 text-rune-muted">{anomaly.title}</p>
              </div>
            ))}
          </div>
        )}
      </RailSection>

      <RailSection icon={Shield} title="Provider Status">
        {providers.length === 0 ? (
          <p className="text-sm text-rune-muted">None connected yet.</p>
        ) : (
          <div className="space-y-2.5">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <span className="text-sm capitalize">{provider.name}</span>
                <span className="flex items-center gap-1.5 text-[10px] text-rune-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    provider.status === "connected" ? "bg-white" : "bg-zinc-700"
                  }`} />
                  {provider.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </RailSection>

      <div className="px-5 py-5">
        <h3 className="mb-4 text-[10px] uppercase tracking-[0.2em] text-rune-muted">Top Forecast</h3>
        {forecasts.length === 0 ? (
          <p className="text-sm text-rune-muted">No forecasts yet.</p>
        ) : (
          forecasts.map((fc) => (
            <div key={fc.id}>
              <div className="text-3xl font-semibold">{fc.probability}%</div>
              <p className="mt-2 text-xs leading-5 text-rune-muted">{fc.thesis}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-rune-muted">{fc.horizon}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
