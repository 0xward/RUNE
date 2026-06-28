import type { SourceConnector } from "./types";

export const connectorRegistry: SourceConnector[] = [
  {
    id: "github-trends",
    label: "GitHub Trend Velocity",
    kind: "repository",
    enabled: true,
    collect: async () => [{ topic: "AI Agents", source: "GitHub", current: 18400, baseline: 12800, credibility: 0.92, observedAt: new Date().toISOString() }],
  },
  {
    id: "research-papers",
    label: "Research Paper Momentum",
    kind: "paper",
    enabled: true,
    collect: async () => [{ topic: "Synthetic Data", source: "arXiv", current: 3200, baseline: 2700, credibility: 0.86, observedAt: new Date().toISOString() }],
  },
  {
    id: "market-language",
    label: "Market Narrative Shift",
    kind: "market",
    enabled: false,
    collect: async () => [],
  },
];
