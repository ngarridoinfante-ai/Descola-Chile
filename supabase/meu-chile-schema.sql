-- Meu Chile backend schema (MVP ready)
-- This file is additive and can be applied in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  first_name text,
  email text unique,
  whatsapp text,
  locale text default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  destination text not null default 'Santiago',
  trip_type text,
  mood text,
  budget_level text,
  start_date date not null,
  end_date date not null,
  status text not null default 'planning',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_index int not null,
  day_label text,
  travel_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, day_index)
);

create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  period text not null,
  item_order int not null default 1,
  name text not null,
  suggested_time time,
  eta_minutes int,
  distance_km numeric(6,2),
  human_tip text,
  cta_label text,
  cta_url text,
  discount_text text,
  partner_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  company text not null,
  district text,
  benefit_summary text,
  status text default 'active',
  qr_mode text default 'single_use',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete set null,
  category text not null,
  title text not null,
  benefit_text text not null,
  status text not null default 'active',
  starts_at timestamptz,
  ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  benefit_id uuid references public.benefits(id) on delete cascade,
  code text not null unique,
  qr_payload text,
  redemption_limit int not null default 1,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete set null,
  redeemed_at timestamptz not null default now(),
  value_before numeric(12,2),
  discount_amount numeric(12,2),
  value_after numeric(12,2),
  status text not null default 'validated',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  alert_type text not null,
  severity text not null default 'medium',
  title text not null,
  message text not null,
  trigger_source text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  preferred_moods text[] not null default '{}'::text[],
  budget_level text,
  travel_pace text,
  food_profile text,
  accessibility_notes text,
  push_opt_in boolean not null default true,
  geolocation_opt_in boolean not null default false,
  analytics_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  moment_type text not null,
  title text,
  notes text,
  media_url text,
  happened_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  score int check (score between 1 and 5),
  source text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_trips_user on public.trips(user_id);
create index if not exists idx_itineraries_trip on public.itineraries(trip_id);
create index if not exists idx_items_itinerary on public.itinerary_items(itinerary_id);
create index if not exists idx_benefits_partner on public.benefits(partner_id);
create index if not exists idx_redemptions_coupon on public.coupon_redemptions(coupon_id);
create index if not exists idx_redemptions_user on public.coupon_redemptions(user_id);
create index if not exists idx_alerts_trip on public.alerts(trip_id);
create index if not exists idx_moments_trip on public.moments(trip_id);
create index if not exists idx_feedback_trip on public.feedback(trip_id);

-- Minimal RLS starter policies (customize before production)
alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.user_preferences enable row level security;
alter table public.alerts enable row level security;
alter table public.moments enable row level security;
alter table public.feedback enable row level security;

-- Example ownership policy based on auth.uid() relationship through users.auth_user_id.
create policy if not exists "users_select_own" on public.users
for select using (auth_user_id = auth.uid());

create policy if not exists "trips_select_own" on public.trips
for select using (
  user_id in (
    select id from public.users where auth_user_id = auth.uid()
  )
);

-- Add equivalent insert/update/delete policies per table during integration.
