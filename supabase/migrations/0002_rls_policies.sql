alter table public.providers enable row level security;
alter table public.api_keys enable row level security;
alter table public.watchlists enable row level security;
alter table public.alerts enable row level security;

create policy providers_owner_select on public.providers for select using (auth.uid() = user_id);
create policy providers_owner_insert on public.providers for insert with check (auth.uid() = user_id);
create policy providers_owner_update on public.providers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy providers_owner_delete on public.providers for delete using (auth.uid() = user_id);

create policy api_keys_owner_select on public.api_keys for select using (
  exists (select 1 from public.providers where providers.id = api_keys.provider_id and providers.user_id = auth.uid())
);
create policy api_keys_owner_insert on public.api_keys for insert with check (
  exists (select 1 from public.providers where providers.id = api_keys.provider_id and providers.user_id = auth.uid())
);

create policy watchlists_owner_all on public.watchlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy alerts_owner_all on public.alerts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
