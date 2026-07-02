export interface LLMResult {
  text: string;
}

type Provider = "openai" | "anthropic" | "gemini" | "groq" | "openrouter";

const BASE_URLS: Record<Provider, string> = {
  openai:      "https://api.openai.com/v1",
  groq:        "https://api.groq.com/openai/v1",
  openrouter:  "https://openrouter.ai/api/v1",
  gemini:      "https://generativelanguage.googleapis.com/v1beta/openai",
  anthropic:   "https://api.anthropic.com",
};

const MODELS: Record<Provider, string> = {
  openai:      "gpt-4o-mini",
  groq:        "llama3-8b-8192",
  openrouter:  "openai/gpt-4o-mini",
  gemini:      "gemini-1.5-flash",
  anthropic:   "claude-haiku-4-5-20251001",
};

export async function callProvider(
  prompt: string,
  provider: Provider,
  apiKey: string
): Promise<LLMResult> {
  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELS.anthropic,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
    const data = await res.json() as { content: Array<{ text: string }> };
    return { text: data.content[0]?.text ?? "" };
  }

  // OpenAI-compatible (openai, groq, openrouter, gemini)
  const res = await fetch(`${BASE_URLS[provider]}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODELS[provider],
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`${provider} error ${res.status}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return { text: data.choices[0]?.message?.content ?? "" };
}
