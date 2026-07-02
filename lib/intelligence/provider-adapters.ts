import type { ProviderId } from "./types";
import { getProviderConfig as getProvider } from "./providers";

export type ProviderRequest = {
  provider: ProviderId;
  model: string;
  system: string;
  prompt: string;
  temperature?: number;
};

export type NormalizedProviderRequest = {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
};

export function buildProviderRequest(request: ProviderRequest, apiKey: string): NormalizedProviderRequest {
  const provider = getProvider(request.provider);
  const commonHeaders = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };

  if (request.provider === "anthropic") {
    return {
      url: `${provider.baseUrl}/v1/messages`,
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: { model: request.model, system: request.system, messages: [{ role: "user", content: request.prompt }], max_tokens: 1200, temperature: request.temperature ?? 0.2 },
    };
  }

  if (request.provider === "gemini") {
    return {
      url: `${provider.baseUrl}/v1beta/models/${request.model}:generateContent?key=${apiKey}`,
      headers: { "Content-Type": "application/json" },
      body: { systemInstruction: { parts: [{ text: request.system }] }, contents: [{ role: "user", parts: [{ text: request.prompt }] }] },
    };
  }

  return {
    url: `${provider.baseUrl}/chat/completions`,
    headers: commonHeaders,
    body: { model: request.model, messages: [{ role: "system", content: request.system }, { role: "user", content: request.prompt }], temperature: request.temperature ?? 0.2 },
  };
}

export function buildForecastPrompt(topic: string, evidence: string[]) {
  return `Assess the next 90 days for ${topic}. Evidence:\n${evidence.map((item, index) => `${index + 1}. ${item}`).join("\n")}\nReturn probability, drivers, counter-signals, and confidence.`;
}
