create table if not exists public.source_events (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  connector_id text not null,
  source text not null,
  source_url text,
  observed_value numeric,
  baseline_value numeric,
  credibility numeric,
  payload jsonb not null default '{}',
  observed_at timestamptz not null default now()
);

create table if not exists public.provider_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider_name text not null,
  purpose text not null,
  prompt_hash text not null,
  status text not null default 'queued',
  latency_ms integer,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.provider_requests enable row level security;
alter table public.audit_logs enable row level security;

create policy provider_requests_owner_all on public.provider_requests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy audit_logs_owner_select on public.audit_logs for select using (auth.uid() = user_id);

create index if not exists source_events_connector_observed_idx on public.source_events(connector_id, observed_at desc);
create index if not exists provider_requests_user_created_idx on public.provider_requests(user_id, created_at desc);
create index if not exists audit_logs_user_created_idx on public.audit_logs(user_id, created_at desc);
