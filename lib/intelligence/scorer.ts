import type { RawItem } from "./sources";

export interface ScoredSignal {
  topic: string;
  momentum: number;
  velocity: number;
  confidence: number;
  strength: number;
  growth: string;
  sources: string[];
  topItems: RawItem[];
  itemCount: number;
}

export function scoreSignal(topic: string, items: RawItem[]): ScoredSignal {
  if (items.length === 0) {
    return { topic, momentum: 0, velocity: 0, confidence: 0, strength: 0, growth: "0 items", sources: [], topItems: [], itemCount: 0 };
  }

  const now = Date.now();
  const sources = [...new Set(items.map((i) => i.source))];

  const scored = items.map((item) => {
    const ageMs = now - new Date(item.publishedAt).getTime();
    const ageDays = ageMs / 86400000;
    const recency = Math.max(0, 1 - ageDays / 7);
    return item.score * (0.4 + 0.6 * recency);
  });

  const total = scored.reduce((a, b) => a + b, 0);
  const diversityBonus = Math.min(sources.length / 3, 1) * 20;
  const momentum = Math.min(100, Math.round(Math.log1p(total) * 8 + diversityBonus));

  const avgAgeDays =
    items.reduce((sum, item) => sum + (now - new Date(item.publishedAt).getTime()) / 86400000, 0) /
    items.length;
  const velocity = Math.min(100, Math.round(Math.max(0, 1 - avgAgeDays / 3) * 100));

  const confidence = Math.min(
    100,
    Math.round(
      (sources.length / 3) * 40 +
        Math.min(items.length / 15, 1) * 40 +
        (total / items.length > 50 ? 20 : 10)
    )
  );

  const strength = Math.round((momentum + velocity + confidence) / 3);
  const growth = `${items.length} items · ${sources.join(", ")}`;

  return { topic, momentum, velocity, confidence, strength, growth, sources, topItems: items.slice(0, 5), itemCount: items.length };
}

export function detectAnomaly(signal: ScoredSignal): {
  isAnomaly: boolean;
  severity: "watch" | "material" | "critical";
  explanation: string;
} {
  if (signal.velocity > 85 && signal.confidence > 70) {
    return {
      isAnomaly: true,
      severity: "critical",
      explanation: `Velocity ${signal.velocity} — activity spiked sharply above baseline across ${signal.sources.join(", ")}. Coordinated or viral movement likely.`,
    };
  }
  if (signal.momentum > 70 && signal.confidence > 60) {
    return {
      isAnomaly: true,
      severity: "material",
      explanation: `Momentum ${signal.momentum} — sustained above-average engagement from ${signal.sources.length} independent sources signals structural shift.`,
    };
  }
  if (signal.momentum > 50) {
    return {
      isAnomaly: true,
      severity: "watch",
      explanation: `Momentum ${signal.momentum} — elevated activity worth monitoring. Within normal variance but trending upward.`,
    };
  }
  return { isAnomaly: false, severity: "watch", explanation: "" };
}
