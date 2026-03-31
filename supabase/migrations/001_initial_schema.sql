-- Beauty Prospect Research — initial schema
-- Apply via Supabase dashboard SQL editor or `supabase db push`

-- ── Companies ──────────────────────────────────────────────────────────

create table companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  ticker      text,
  sec_cik     text,
  website     text not null,
  linkedin_url text,
  ir_page_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger companies_updated_at
  before update on companies
  for each row execute function update_updated_at();

-- ── Signals ────────────────────────────────────────────────────────────

create table signals (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid not null references companies(id) on delete cascade,
  signal_type        text not null,
  summary            text not null,
  ai_relevance_score double precision not null,
  low_relevance      boolean not null default false,
  published_date     timestamptz,
  source_url         text not null,
  created_at         timestamptz not null default now()
);

create index idx_signals_company_id on signals(company_id);

-- ── Contacts ───────────────────────────────────────────────────────────

create table contacts (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references companies(id) on delete cascade,
  name         text,
  title        text,
  region       text,
  linkedin_url text,
  email        text,
  source_url   text not null,
  created_at   timestamptz not null default now()
);

create index idx_contacts_company_id on contacts(company_id);

-- ── Revenue Records ────────────────────────────────────────────────────

create table revenue_records (
  id                uuid primary key default gen_random_uuid(),
  company_id        uuid not null references companies(id) on delete cascade,
  year              integer not null,
  revenue           double precision,
  currency          text,
  revenue_growth_pct double precision,
  segment           text,
  source_url        text not null,
  created_at        timestamptz not null default now()
);

create index idx_revenue_records_company_id on revenue_records(company_id);

-- ── Failed URLs (debugging stale sources) ──────────────────────────────

create table failed_urls (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  reason     text not null,
  context    text,
  created_at timestamptz not null default now()
);
