import type { Anomaly, Forecast, Signal } from "./types";

export type SourceObservation = {
  topic: string;
  source: string;
  current: number;
  baseline: number;
  credibility: number;
  observedAt: string;
};

export function calculateMomentum(current: number, baseline: number) {
  if (baseline <= 0) return 0;
  return Math.round(((current - baseline) / baseline) * 100);
}

export function calculateConfidence(sourceCount: number, averageCredibility: number, volatility: number) {
  const diversity = Math.min(sourceCount / 5, 1) * 35;
  const credibility = Math.min(Math.max(averageCredibility, 0), 1) * 45;
  const stability = Math.max(0, 1 - volatility) * 20;
  return Math.round(diversity + credibility + stability);
}

export function scoreObservation(observation: SourceObservation): Signal {
  const momentum = calculateMomentum(observation.current, observation.baseline);
  const confidence = calculateConfidence(3, observation.credibility, Math.min(Math.abs(momentum) / 200, 1));
  return {
    id: `sig-${observation.topic.toLowerCase().replaceAll(" ", "-")}`,
    topic: observation.topic,
    momentum,
    growth: `${observation.current.toLocaleString()} observations`,
    confidence,
    velocity: Math.min(Math.abs(momentum), 100),
    sources: [observation.source],
  };
}

export function detectAnomaly(signal: Signal): Anomaly | null {
  if (signal.velocity < 65 || signal.confidence < 70) return null;
  return {
    id: `ano-${signal.id}`,
    title: `${signal.topic} moved ${signal.velocity}% above baseline`,
    severity: signal.velocity > 85 ? "critical" : "material",
    observedAt: new Date().toISOString(),
    explanation: `Momentum and confidence crossed RUNE's anomaly threshold with ${signal.sources.length} contributing source cluster(s).`,
  };
}

export function generateForecast(signal: Signal): Forecast {
  const probability = Math.min(88, Math.max(42, Math.round((signal.confidence * 0.55) + (signal.velocity * 0.35) + 8)));
  return {
    id: `fc-${signal.id}-90d`,
    topic: signal.topic,
    probability,
    horizon: "90D",
    thesis: `${signal.topic} is likely to remain directionally relevant if source diversity and velocity persist for the next two collection windows.`,
    drivers: ["Momentum persistence", "Source diversity", "Provider consensus"],
  };
}
