import { anomalies, forecasts, realityMetrics, signals } from "./mock-data";
import type { IntelligenceSnapshot } from "./engine";

export function getMockSnapshot(): IntelligenceSnapshot {
  return {
    score: realityMetrics[0]?.value ?? 0,
    confidence: realityMetrics[1]?.value ?? 0,
    signals,
    anomalies,
    forecasts,
  };
}
