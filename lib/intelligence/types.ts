export type ProviderId = "openai" | "anthropic" | "gemini" | "groq" | "openrouter";

export type Signal = {
  id: string;
  topic: string;
  momentum: number;
  growth: string;
  confidence: number;
  sources: string[];
  velocity: number;
};

export type Forecast = {
  id: string;
  topic: string;
  probability: number;
  horizon: "30D" | "90D" | "180D";
  thesis: string;
  drivers: string[];
};

export type Anomaly = {
  id: string;
  title: string;
  severity: "watch" | "material" | "critical";
  observedAt: string;
  explanation: string;
};

export type ProviderConfig = {
  id: ProviderId;
  label: string;
  baseUrl: string;
  status: "connected" | "degraded" | "not_connected";
  capabilities: Array<"reasoning" | "forecasting" | "embeddings" | "vision" | "routing">;
};
