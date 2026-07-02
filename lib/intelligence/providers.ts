import type { ProviderConfig, ProviderId } from "./types";
import { sealCredential, unsealCredential } from "./crypto";

export { sealCredential, unsealCredential };

export const PROVIDER_CONFIGS: Record<ProviderId, Omit<ProviderConfig, "status">> = {
  openai:     { id: "openai",     label: "OpenAI",      baseUrl: "https://api.openai.com/v1",                    capabilities: ["reasoning", "forecasting", "embeddings", "vision"] },
  anthropic:  { id: "anthropic",  label: "Anthropic",   baseUrl: "https://api.anthropic.com",                    capabilities: ["reasoning", "forecasting", "vision"] },
  gemini:     { id: "gemini",     label: "Gemini",      baseUrl: "https://generativelanguage.googleapis.com",    capabilities: ["reasoning", "embeddings", "vision"] },
  groq:       { id: "groq",       label: "Groq",        baseUrl: "https://api.groq.com/openai/v1",               capabilities: ["reasoning"] },
  openrouter: { id: "openrouter", label: "OpenRouter",  baseUrl: "https://openrouter.ai/api/v1",                 capabilities: ["routing", "reasoning", "forecasting", "vision"] },
};

export function getProviderConfig(id: ProviderId): Omit<ProviderConfig, "status"> {
  const cfg = PROVIDER_CONFIGS[id];
  if (!cfg) throw new Error(`Unknown provider: ${id}`);
  return cfg;
}
