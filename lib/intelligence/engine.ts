import type { Anomaly, Forecast, Signal } from "./types";

export type IntelligenceSnapshot = {
  score: number;
  confidence: number;
  signals: Signal[];
  anomalies: Anomaly[];
  forecasts: Forecast[];
};

export const engineStages = [
  "Signal Collection: ingest source events from APIs, feeds, code repositories, filings, markets, and user watchlists.",
  "Signal Scoring: normalize momentum, source diversity, credibility, novelty, and recency into comparable metrics.",
  "Trend Detection: compare current velocity with historical baselines and peer topics.",
  "Anomaly Detection: flag statistical outliers, coordinated movement, and source-cluster breaks.",
  "Forecast Generation: ask selected BYOK providers for probabilistic theses using shared evidence packets.",
  "Confidence Calculation: blend model agreement, source quality, volatility, and contradiction penalties.",
] as const;
