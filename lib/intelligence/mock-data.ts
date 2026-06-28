import type { Anomaly, Forecast, ProviderConfig, Signal } from "./types";

export const navItems = ["Overview", "Signals", "Radar", "Anomalies", "Forecast", "Watchlists", "Providers", "Settings"] as const;

export const realityMetrics = [
  { label: "Reality Score", value: 87, suffix: "", detail: "Composite market + source agreement", trend: [71, 73, 76, 78, 81, 83, 87] },
  { label: "Confidence", value: 92, suffix: "%", detail: "Cross-provider consensus", trend: [84, 85, 86, 88, 89, 91, 92] },
  { label: "Signal Strength", value: 81, suffix: "%", detail: "Source diversity adjusted", trend: [62, 66, 68, 72, 75, 79, 81] },
  { label: "Trend Velocity", value: 74, suffix: "%", detail: "7D acceleration vs baseline", trend: [48, 51, 59, 63, 65, 70, 74] },
];

export const signals: Signal[] = [
  { id: "sig-ai-agents", topic: "AI Agents", momentum: 43, growth: "18.4k mentions", confidence: 91, velocity: 74, sources: ["GitHub", "arXiv", "X", "HN"] },
  { id: "sig-local-models", topic: "On-device Models", momentum: 28, growth: "7.1k commits", confidence: 84, velocity: 61, sources: ["GitHub", "Supply Chain", "Patents"] },
  { id: "sig-synthetic-data", topic: "Synthetic Data", momentum: 19, growth: "3.2k papers", confidence: 79, velocity: 52, sources: ["arXiv", "SEC", "Jobs"] },
  { id: "sig-compute-routing", topic: "Model Routing", momentum: 34, growth: "2.8k deployments", confidence: 86, velocity: 68, sources: ["Vercel", "Cloudflare", "OpenRouter"] },
];

export const anomalies: Anomaly[] = [
  { id: "ano-browser", title: "Unexpected GitHub growth across browser automation repos", severity: "material", observedAt: "2026-06-28T04:20:00Z", explanation: "Repository stars, forks, and issue velocity moved 3.1σ above the 30-day baseline." },
  { id: "ano-hardware", title: "New local inference hardware procurement cluster", severity: "watch", observedAt: "2026-06-28T03:55:00Z", explanation: "Procurement language shifted from training capacity to edge inference and private deployment." },
  { id: "ano-chain", title: "Abnormal on-chain activity near AI compute baskets", severity: "watch", observedAt: "2026-06-28T02:10:00Z", explanation: "Wallet clustering suggests coordinated repositioning rather than retail flow." },
];

export const forecasts: Forecast[] = [
  { id: "fc-agents-90", topic: "AI Agents", probability: 76, horizon: "90D", thesis: "AI agent workflows continue compounding as browser automation and model-routing infrastructure mature.", drivers: ["Developer tooling velocity", "Enterprise pilots", "Workflow replacement pressure"] },
  { id: "fc-byok-180", topic: "BYOK Intelligence", probability: 62, horizon: "180D", thesis: "Model-agnostic BYOK products gain share as teams optimize cost, privacy, and redundancy.", drivers: ["Provider fragmentation", "Procurement scrutiny", "Latency arbitrage"] },
  { id: "fc-edge-30", topic: "Private Edge Inference", probability: 58, horizon: "30D", thesis: "Local inference demand rises as regulated teams seek data-boundary guarantees.", drivers: ["Compliance", "Hardware availability", "Distilled models"] },
];

export const providers: ProviderConfig[] = [
  { id: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", status: "connected", capabilities: ["reasoning", "forecasting", "embeddings", "vision"] },
  { id: "anthropic", label: "Anthropic", baseUrl: "https://api.anthropic.com", status: "connected", capabilities: ["reasoning", "forecasting", "vision"] },
  { id: "gemini", label: "Gemini", baseUrl: "https://generativelanguage.googleapis.com", status: "degraded", capabilities: ["reasoning", "embeddings", "vision"] },
  { id: "groq", label: "Groq", baseUrl: "https://api.groq.com/openai/v1", status: "connected", capabilities: ["reasoning"] },
  { id: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", status: "connected", capabilities: ["routing", "reasoning", "forecasting", "vision"] },
];
