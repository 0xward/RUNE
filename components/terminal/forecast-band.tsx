import { forecasts } from "@/lib/intelligence/mock-data";
import { Panel, SectionHeader } from "./panel";

export function ForecastBand() {
  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Probability Distribution" title="Forecast Band" />
      <div className="space-y-4">
        {forecasts.map((forecast) => (
          <div key={forecast.id}>
            <div className="mb-2 flex justify-between text-sm"><span>{forecast.topic}</span><span>{forecast.probability}% · {forecast.horizon}</span></div>
            <div className="h-2 bg-zinc-900"><div className="h-full bg-white" style={{ width: `${forecast.probability}%` }} /></div>
            <p className="mt-2 text-xs leading-5 text-rune-muted">{forecast.drivers.join(" / ")}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
