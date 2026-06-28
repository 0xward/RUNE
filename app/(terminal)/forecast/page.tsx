import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { forecasts } from "@/lib/intelligence/mock-data";

export default function ForecastPage() {
  return (
    <TerminalShell active="Forecast">
      <PageTitle eyebrow="Predictive Layer" title="Forecast" subtitle="Probabilistic theses generated from signal strength, source diversity, trend velocity, and provider consensus." />
      <div className="grid gap-4 xl:grid-cols-3">
        {forecasts.map((forecast) => (
          <Panel key={forecast.id} className="p-5">
            <SectionHeader eyebrow={forecast.horizon} title={forecast.topic} />
            <div className="text-5xl font-semibold">{forecast.probability}%</div>
            <p className="mt-4 text-sm leading-6 text-rune-muted">{forecast.thesis}</p>
            <div className="mt-5 border-t border-rune-border pt-4">
              {forecast.drivers.map((driver) => <p key={driver} className="py-1 text-sm text-rune-muted">→ {driver}</p>)}
            </div>
          </Panel>
        ))}
      </div>
    </TerminalShell>
  );
}
