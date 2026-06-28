import type { ProviderConfig, ProviderId } from "./types";
import { providers } from "./mock-data";

export function getProvider(id: ProviderId): ProviderConfig {
  const provider = providers.find((item) => item.id === id);
  if (!provider) throw new Error(`Unknown provider: ${id}`);
  return provider;
}

export async function sealCredential(apiKey: string, secret: string) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const key = await crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(apiKey));
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
