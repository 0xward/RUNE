create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null check (name in ('openai','anthropic','gemini','groq','openrouter')),
  status text not null default 'disconnected',
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  encrypted_key text not null,
  iv text not null,
  key_hint text,
  created_at timestamptz not null default now(),
  rotated_at timestamptz
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.signals (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  title text not null,
  source text not null,
  source_url text,
  payload jsonb not null default '{}',
  observed_at timestamptz not null default now()
);

create table public.signal_scores (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid not null references public.signals(id) on delete cascade,
  momentum numeric not null,
  confidence numeric not null,
  strength numeric not null,
  velocity numeric not null,
  scored_at timestamptz not null default now()
);

create table public.trend_history (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  value numeric not null,
  bucket timestamptz not null,
  unique (topic_id, bucket)
);

create table public.forecasts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  probability numeric not null,
  horizon text not null,
  summary text not null,
  model_provider text not null,
  evidence jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table public.anomalies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  severity text not null,
  summary text not null,
  explanation text,
  detected_at timestamptz not null default now()
);

create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  topic_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  anomaly_id uuid references public.anomalies(id) on delete set null,
  title text not null,
  payload jsonb not null default '{}',
  delivered_at timestamptz
);

create index signals_topic_observed_idx on public.signals(topic_id, observed_at desc);
create index signal_scores_signal_scored_idx on public.signal_scores(signal_id, scored_at desc);
create index trend_history_topic_bucket_idx on public.trend_history(topic_id, bucket desc);
create index forecasts_topic_created_idx on public.forecasts(topic_id, created_at desc);
create index anomalies_topic_detected_idx on public.anomalies(topic_id, detected_at desc);
