import { supabase } from "@/lib/supabase/server";
import { fetchAllSources } from "./sources";
import { scoreSignal, detectAnomaly } from "./scorer";
import { callProvider } from "./llm";
import { unsealCredential } from "./crypto";
import type { Signal, Anomaly, Forecast } from "./types";

const ENCRYPTION_SECRET = process.env.CREDENTIAL_ENCRYPTION_SECRET ?? "development-only-secret";

// ── Get first available decrypted API key from DB ────────────────────────────

async function getActiveProviderKey(): Promise<{ provider: string; apiKey: string } | null> {
  const { data } = await supabase
    .from("providers")
    .select("name, api_keys(encrypted_key, iv)")
    .eq("status", "connected")
    .limit(1)
    .single();

  if (!data) return null;

  const keyRow = Array.isArray((data as Record<string, unknown>).api_keys)
    ? ((data as Record<string, unknown>).api_keys as Array<{ encrypted_key: string; iv: string }>)[0]
    : null;

  if (!keyRow) return null;

  try {
    const apiKey = await unsealCredential(keyRow.encrypted_key, keyRow.iv, ENCRYPTION_SECRET);
    return { provider: (data as unknown as { name: string }).name, apiKey };
  } catch {
    return null;
  }
}

// ── Get or create topic in DB ────────────────────────────────────────────────

async function upsertTopic(name: string): Promise<string> {
  const { data, error } = await supabase
    .from("topics")
    .upsert({ name }, { onConflict: "name" })
    .select("id")
    .single();
  if (error || !data) throw new Error(`Failed to upsert topic: ${name}`);
  return (data as Record<string, string>).id;
}

// ── Run full pipeline for one topic ─────────────────────────────────────────

async function runTopicPipeline(
  topicName: string,
  providerKey: { provider: string; apiKey: string } | null
) {
  const topicId = await upsertTopic(topicName);

  // 1. Fetch raw items
  const items = await fetchAllSources(topicName);

  // 2. Score
  const signal = scoreSignal(topicName, items);

  // 3. Persist signals to DB
  if (items.length > 0) {
    const rows = items.slice(0, 20).map((item) => ({
      topic_id: topicId,
      title: item.title,
      source: item.source,
      source_url: item.url,
      payload: { score: item.score },
      observed_at: item.publishedAt,
    }));
    const { data: inserted } = await supabase.from("signals").insert(rows).select("id");

    // 4. Persist scores
    if (inserted && inserted.length > 0) {
      await supabase.from("signal_scores").insert(
        (inserted as Array<{ id: string }>).map((s) => ({
          signal_id: s.id,
          momentum: signal.momentum,
          confidence: signal.confidence,
          strength: signal.strength,
          velocity: signal.velocity,
        }))
      );
    }
  }

  // 5. Anomaly detection
  const { isAnomaly, severity, explanation } = detectAnomaly(signal);
  if (isAnomaly) {
    await supabase.from("anomalies").insert({
      topic_id: topicId,
      severity,
      summary: `${topicName}: ${severity} signal detected`,
      explanation,
    });
  }

  // 6. Trend history bucket
  const bucket = new Date();
  bucket.setMinutes(0, 0, 0);
  await supabase.from("trend_history").upsert(
    { topic_id: topicId, value: signal.momentum, bucket: bucket.toISOString() },
    { onConflict: "topic_id,bucket" }
  );

  // 7. LLM forecast (only if we have a key)
  if (providerKey && signal.itemCount >= 3) {
    const prompt = `You are RUNE, an intelligence terminal. Generate a concise probabilistic forecast.

Topic: "${topicName}"
Momentum: ${signal.momentum}/100
Velocity: ${signal.velocity}/100
Confidence: ${signal.confidence}/100
Sources: ${signal.sources.join(", ")}
Recent items: ${signal.topItems.slice(0, 3).map((i) => i.title).join(" | ")}

Respond ONLY as valid JSON, no markdown:
{
  "probability": <0-100 integer>,
  "horizon": "90D",
  "summary": "<one sentence thesis>",
  "drivers": ["<driver1>", "<driver2>", "<driver3>"]
}`;

    try {
      const { text } = await callProvider(
        prompt,
        providerKey.provider as Parameters<typeof callProvider>[1],
        providerKey.apiKey
      );
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean) as { probability: number; horizon: string; summary: string; drivers: string[] };

      await supabase.from("forecasts").insert({
        topic_id: topicId,
        probability: parsed.probability,
        horizon: parsed.horizon,
        summary: parsed.summary,
        model_provider: providerKey.provider,
        evidence: parsed.drivers,
      });
    } catch {
      // Forecast generation failed — skip silently, don't break pipeline
    }
  }

  return { topicId, signal };
}

// ── Main snapshot builder ────────────────────────────────────────────────────

export async function buildRealSnapshot(): Promise<{
  score: number;
  confidence: number;
  signals: Signal[];
  anomalies: Anomaly[];
  forecasts: Forecast[];
}> {
  // Get active topics from watchlists + topics table
  const { data: topicsData } = await supabase
    .from("topics")
    .select("id, name")
    .order("created_at", { ascending: false })
    .limit(12);

  const topics: Array<{ id: string; name: string }> = (topicsData ?? []) as Array<{ id: string; name: string }>;

  // If no topics in DB, use defaults
  const topicNames =
    topics.length > 0
      ? topics.map((t) => t.name)
      : ["AI Agents", "On-device Models", "Synthetic Data", "Model Routing"];

  const providerKey = await getActiveProviderKey();

  // Run pipeline for all topics in parallel (max 4 at a time)
  const BATCH = 4;
  for (let i = 0; i < topicNames.length; i += BATCH) {
    await Promise.all(topicNames.slice(i, i + BATCH).map((t) => runTopicPipeline(t, providerKey)));
  }

  // Read back latest signals from DB
  const { data: signalRows } = await supabase
    .from("signals")
    .select(`
      id, topic_id, title, source,
      topics(name),
      signal_scores(momentum, confidence, strength, velocity)
    `)
    .gte("observed_at", new Date(Date.now() - 86400000 * 3).toISOString())
    .order("observed_at", { ascending: false })
    .limit(60);

  // Aggregate per topic
  const topicMap = new Map<string, { name: string; scores: number[]; sources: Set<string> }>();
  for (const row of (signalRows ?? []) as Array<Record<string, unknown>>) {
    const topicName = (row.topics as { name: string } | null)?.name ?? "";
    const scores = row.signal_scores as Array<{ momentum: number; confidence: number; velocity: number }> | null;
    const score = scores?.[0];
    if (!topicName || !score) continue;
    if (!topicMap.has(topicName)) {
      topicMap.set(topicName, { name: topicName, scores: [], sources: new Set() });
    }
    const entry = topicMap.get(topicName)!;
    entry.scores.push(score.momentum);
    entry.sources.add(String(row.source));
  }

  const signals: Signal[] = [...topicMap.entries()].map(([id, t], i) => ({
    id: `sig-${i}`,
    topic: t.name,
    momentum: Math.round(t.scores.reduce((a, b) => a + b, 0) / (t.scores.length || 1)),
    growth: `${t.scores.length} signals`,
    confidence: Math.min(100, t.scores.length * 5 + 60),
    velocity: Math.min(100, t.scores.length * 4 + 50),
    sources: [...t.sources],
  }));

  // Read back anomalies
  const { data: anomalyRows } = await supabase
    .from("anomalies")
    .select("id, severity, summary, explanation, detected_at, topics(name)")
    .gte("detected_at", new Date(Date.now() - 86400000).toISOString())
    .order("detected_at", { ascending: false })
    .limit(10);

  const anomalies: Anomaly[] = ((anomalyRows ?? []) as Array<Record<string, unknown>>).map((a) => ({
    id: String(a.id),
    title: String(a.summary),
    severity: a.severity as Anomaly["severity"],
    observedAt: String(a.detected_at),
    explanation: String(a.explanation ?? ""),
  }));

  // Read back forecasts
  const { data: forecastRows } = await supabase
    .from("forecasts")
    .select("id, probability, horizon, summary, evidence, topics(name)")
    .order("created_at", { ascending: false })
    .limit(6);

  const forecasts: Forecast[] = ((forecastRows ?? []) as Array<Record<string, unknown>>).map((f) => ({
    id: String(f.id),
    topic: (f.topics as { name: string } | null)?.name ?? "",
    probability: Number(f.probability),
    horizon: String(f.horizon) as Forecast["horizon"],
    thesis: String(f.summary),
    drivers: (f.evidence as string[]) ?? [],
  }));

  // Reality score = avg momentum across topics
  const avgMomentum =
    signals.length > 0
      ? Math.round(signals.reduce((a, s) => a + s.momentum, 0) / signals.length)
      : 0;

  const avgConfidence =
    signals.length > 0
      ? Math.round(signals.reduce((a, s) => a + s.confidence, 0) / signals.length)
      : 0;

  return { score: avgMomentum, confidence: avgConfidence, signals, anomalies, forecasts };
}
