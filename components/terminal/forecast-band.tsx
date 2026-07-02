import { Panel, SectionHeader } from "./panel";

interface Forecast {
  id: string;
  probability: number;
  horizon: string;
  summary: string;
  evidence: string[];
  topics: { name: string } | null;
}

export function ForecastBand({ forecasts }: { forecasts: Forecast[] }) {
  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Probability Distribution" title="Forecast Band" />
      {forecasts.length === 0 ? (
        <p className="text-sm text-rune-muted py-4">No forecasts yet.</p>
      ) : (
        <div className="space-y-4">
          {forecasts.map((forecast) => (
            <div key={forecast.id}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{forecast.topics?.name ?? ""}</span>
                <span>{forecast.probability}% · {forecast.horizon}</span>
              </div>
              <div className="h-2 bg-zinc-900">
                <div className="h-full bg-white" style={{ width: `${forecast.probability}%` }} />
              </div>
              <p className="mt-2 text-xs leading-5 text-rune-muted">{(forecast.evidence ?? []).join(" / ")}</p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
