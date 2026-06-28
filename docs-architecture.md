# RUNE Architecture Notes

## Principle

RUNE is an intelligence terminal. The core interaction is not chat; it is operating a live map of reality. Every surface should answer one of four questions:

1. What is changing?
2. Why is it changing?
3. How unusual is the change?
4. What is likely to happen next?

## Runtime Layers

- **Terminal UI:** Three-column desktop-first interface with responsive collapse for mobile.
- **Intelligence Domain:** Strong TypeScript contracts for signals, forecasts, anomalies, and providers.
- **Provider Control Plane:** BYOK registry with encrypted key ingestion, request normalization, prompt contracts, and model-agnostic routing.
- **Connector Layer:** Source collectors normalize repositories, papers, markets, filings, social streams, and on-chain movement into observations.
- **Source/Data Plane:** Supabase Postgres tables for topics, observations, scores, trend history, forecasts, and alerts.
- **Engine Pipeline:** Collection, scoring, trend detection, anomaly detection, forecasting, confidence calculation.

## Data Flow

```txt
connectors -> observations -> scoring -> anomalies -> triage -> forecasts -> snapshot/provider APIs -> terminal surfaces
```

## Next Milestones

- Persist provider configuration through Supabase RLS-protected tables.
- Add source connectors and scheduled ingestion jobs.
- Add D3 forecast confidence bands and React Flow clustering by topic category.
- Add TanStack Query data hooks once API routes/server actions return persisted snapshots.

## Provider Request Strategy

RUNE should not leak product behavior into provider-specific call sites. Provider adapters normalize request construction while the intelligence engine owns prompts, evidence packets, and confidence interpretation. This makes OpenAI-compatible providers, Anthropic, Gemini, Groq, and OpenRouter replaceable at the routing layer.

## Operational Workflow

Anomalies should move through a small workflow: monitor, create watchlist, or escalate. This keeps RUNE from becoming another passive dashboard and turns signal detection into decisions.
