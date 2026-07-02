"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/server";
import { sealCredential } from "@/lib/intelligence/crypto";

const ENCRYPTION_SECRET = process.env.CREDENTIAL_ENCRYPTION_SECRET ?? "development-only-secret";

export async function connectProviderAction(formData: FormData) {
  const provider = String(formData.get("provider") ?? "");
  const apiKey = String(formData.get("apiKey") ?? "");
  if (!provider || !apiKey) return { ok: false as const, message: "Provider and API key are required." };

  // Seal the credential
  const sealed = await sealCredential(apiKey, ENCRYPTION_SECRET);
  const keyHint = `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}`;

  // Upsert provider row
  const { data: providerRow, error: provErr } = await supabase
    .from("providers")
    .upsert({ name: provider, status: "connected" }, { onConflict: "user_id,name" })
    .select("id")
    .single();

  if (provErr || !providerRow) {
    // Supabase may not have user_id yet in MVP — insert without user_id
    const { data: inserted, error: insErr } = await supabase
      .from("providers")
      .insert({ name: provider, status: "connected" })
      .select("id")
      .single();
    if (insErr || !inserted) return { ok: false as const, message: "Failed to save provider." };

    await supabase.from("api_keys").insert({
      provider_id: (inserted as { id: string }).id,
      encrypted_key: sealed.ciphertext,
      iv: sealed.iv,
      key_hint: keyHint,
    });
  } else {
    await supabase.from("api_keys").insert({
      provider_id: (providerRow as { id: string }).id,
      encrypted_key: sealed.ciphertext,
      iv: sealed.iv,
      key_hint: keyHint,
    });
  }

  return { ok: true as const, provider, keyHint };
}

export async function saveWatchlistAction(formData: FormData) {
  const name = String(formData.get("name") ?? "My Watchlist");
  const topicsRaw = String(formData.get("topics") ?? "");
  const topicNames = topicsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  if (topicNames.length === 0) return { ok: false as const, message: "At least one topic required." };

  // Upsert topics and collect IDs
  const topicIds: string[] = [];
  for (const topicName of topicNames) {
    const { data } = await supabase
      .from("topics")
      .upsert({ name: topicName }, { onConflict: "name" })
      .select("id")
      .single();
    if (data) topicIds.push((data as { id: string }).id);
  }

  // Save watchlist
  const { error } = await supabase
    .from("watchlists")
    .insert({ name, topic_ids: topicIds });

  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const, topicCount: topicIds.length };
}

export async function completeOnboardingAction() {
  const cookieStore = await cookies();
  cookieStore.set("rune_onboarded", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return { ok: true };
}
