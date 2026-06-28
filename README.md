# RUNE — Signal Over Noise

RUNE is a Reality Intelligence Terminal. It is intentionally not an AI chatbot: the product helps users understand reality through signals, trends, anomalies, forecasts, provider consensus, and workflow.

## Product Architecture

- **App:** Next.js 15 App Router, TypeScript, TailwindCSS, Framer Motion-ready motion layer, React Flow relationship maps, D3-ready data visualization modules.
- **State/Data:** Zustand for client-side terminal state, TanStack Query planned for async source/provider data, Server Actions for secure mutations.
- **Data Plane:** Supabase Postgres schema for users, providers, encrypted API keys, topics, signals, scores, trend history, forecasts, anomalies, watchlists, and alerts.
- **Provider Layer:** Model-agnostic BYOK registry for OpenAI, Anthropic, Gemini, Groq, and OpenRouter.
- **Intelligence Engine:** collection → scoring → trend detection → anomaly detection → forecast generation → confidence calculation.

## Folder Structure

```txt
app/                    App Router pages and server actions
components/terminal/    Intelligence terminal shell and UI modules
lib/intelligence/       Provider registry, scoring logic, connectors, engine contracts, mock data
lib/supabase/           Supabase runtime configuration
supabase/schema.sql     Production database schema
supabase/migrations/     RLS and follow-on database migrations
docs-architecture.md    Product and systems architecture notes
.github/workflows/      Vercel-compatible CI checks
```

## Local Development

```bash
npm install
npm run dev
```

## Deployment

1. Create a Supabase project and run `supabase/schema.sql`.
2. Configure `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CREDENTIAL_ENCRYPTION_SECRET` in Vercel.
3. Deploy with the Vercel Next.js preset.

## Current Terminal Surfaces

- Overview: live reality score, signal network, signals, anomalies, and forecasts.
- Signals: source-backed topic momentum table.
- Radar: relationship intelligence and adjacency mapping.
- Anomalies: outlier queue with observed timestamps and explanations.
- Forecast: probabilistic theses with drivers.
- Watchlists: persistent monitoring groups.
- Providers: BYOK control plane and encrypted key submission scaffold.
- Settings: engine stages and operating parameters.

## API Surface

- `GET /api/intelligence/snapshot` returns the current intelligence snapshot contract used by terminal surfaces.
- `GET /api/providers` returns the model-agnostic provider registry for BYOK setup.

## Security Notes

- BYOK credentials flow through a Server Action and are sealed before persistence.
- Supabase RLS migration scopes provider credentials, watchlists, and alerts to the owning user.
- `.env.example` documents required deployment secrets and provider keys.

## Intelligence Engine Contracts

- `lib/intelligence/scoring.ts` converts raw observations into scored signals, anomaly decisions, and forecast drafts.
- `lib/intelligence/provider-adapters.ts` normalizes OpenAI-compatible, Anthropic, and Gemini request shapes behind a provider-agnostic interface.
- `lib/intelligence/workflow/triage.ts` turns anomalies into operational triage recommendations.
