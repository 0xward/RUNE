import { TrendingUp, Zap } from "lucide-react";
import { anomalies, forecasts, realityMetrics, signals } from "@/lib/intelligence/mock-data";
import { Panel, SectionHeader } from "./panel";
import { SignalNetwork } from "./signal-network";
import { MetricCard } from "./metric-card";
import { SourceMonitor } from "./source-monitor";
import { EngineHealth } from "./engine-health";
import { IntelligenceDossier } from "./intelligence-dossier";
import { ForecastBand } from "./forecast-band";

export function OverviewTerminal() {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        {realityMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="mt-4">
        <IntelligenceDossier />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_420px]">
        <Panel className="p-4">
          <SectionHeader eyebrow="Relationship Map" title="Signal Network" />
          <SignalNetwork />
        </Panel>
        <Panel className="p-4">
          <SectionHeader eyebrow="Ranked by velocity" title="Signals" />
          {signals.map((signal) => (
            <div key={signal.id} className="mb-3 border border-rune-border p-4">
              <div className="flex justify-between gap-4"><h3 className="font-medium">{signal.topic}</h3><span>+{signal.momentum}%</span></div>
              <p className="mt-2 text-sm text-rune-muted">{signal.growth} · Confidence {signal.confidence}% · Velocity {signal.velocity}%</p>
            </div>
          ))}
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SourceMonitor />
        <EngineHealth />
      </div>
      <div className="mt-4">
        <ForecastBand />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel className="p-4">
          <SectionHeader title="Anomalies" action={<Zap className="h-4 w-4" />} />
          {anomalies.map((anomaly) => <p key={anomaly.id} className="border-t border-rune-border py-3 text-sm text-rune-muted">{anomaly.title}</p>)}
        </Panel>
        <Panel className="p-4">
          <SectionHeader title="Forecast" action={<TrendingUp className="h-4 w-4" />} />
          {forecasts.map((forecast) => (
            <div key={forecast.id} className="border-t border-rune-border py-3">
              <div className="text-2xl font-semibold">{forecast.probability}%</div>
              <p className="text-sm text-rune-muted">{forecast.thesis} · {forecast.horizon}</p>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
