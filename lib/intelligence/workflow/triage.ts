import type { Anomaly } from "../types";

export type TriageDecision = "monitor" | "escalate" | "create_watchlist";

export function recommendTriage(anomaly: Anomaly): TriageDecision {
  if (anomaly.severity === "critical") return "escalate";
  if (anomaly.severity === "material") return "create_watchlist";
  return "monitor";
}

export function buildTriageChecklist(anomaly: Anomaly) {
  return [
    `Verify source cluster for: ${anomaly.title}`,
    "Compare against 30D and 90D baseline velocity.",
    "Check provider consensus and contradiction notes.",
    `Recommended action: ${recommendTriage(anomaly).replace("_", " ")}.`,
  ];
}
