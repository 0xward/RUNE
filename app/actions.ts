"use server";

import { sealCredential } from "@/lib/intelligence/providers";

export async function connectProviderAction(formData: FormData) {
  const provider = String(formData.get("provider") ?? "");
  const apiKey = String(formData.get("apiKey") ?? "");
  if (!provider || !apiKey) return { ok: false, message: "Provider and API key are required." };
  const sealed = await sealCredential(apiKey, process.env.CREDENTIAL_ENCRYPTION_SECRET ?? "development-only-secret");
  return { ok: true, provider, keyHint: `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}`, sealed };
}
