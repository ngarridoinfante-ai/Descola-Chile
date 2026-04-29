-- Descola Chile - Supabase initial schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.coupons (
  id text primary key,
  name text not null,
  partner text not null,
  category text not null,
  discount text not null,
  conditions text not null,
  address text default '',
  maps text default '',
  schedule text default '',
  valid_until date,
  image text default '',
  usage_limit integer not null default 1,
  active boolean not null default true,
  start_date date,
  qr_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  category text not null,
  contact text not null,
  email text,
  whatsapp text,
  address text,
  commission text,
  discount_offered text,
  status text not null default 'Activo',
  sales integer not null default 0,
  used_coupons integer not null default 0,
  estimated_amount bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  arrival date,
  departure date,
  status text not null default 'Activo',
  product text,
  unique_code text,
  last_use text,
  total_uses integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupon_usage (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  coupon text not null,
  partner text not null,
  datetime text not null,
  estimated_value bigint not null default 0,
  discount_applied text,
  estimated_commission bigint not null default 0,
  status text not null default 'No validado',
  created_at timestamptz not null default now()
);

create table if not exists public.metrics_snapshots (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key,
  membership_price bigint not null default 0,
  whatsapp_sales text default '',
  whatsapp_support text default '',
  esim_affiliate text default '',
  logo text default '',
  brand_primary text default '#0E8A5B',
  brand_accent text default '#F4A33C',
  legal_text text default '',
  terms_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id text primary key,
  name text not null,
  email text not null,
  whatsapp text not null,
  arrival date,
  departure date,
  product_id text,
  product_name text,
  price bigint not null default 0,
  code text not null,
  purchased_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

insert into public.settings (
  id,
  membership_price,
  whatsapp_sales,
  whatsapp_support,
  esim_affiliate,
  logo,
  brand_primary,
  brand_accent,
  legal_text,
  terms_url
)
values (
  'main',
  34900,
  'https://wa.me/56941079792',
  'https://wa.me/56941079792',
  'https://descolachile.com/esim-afiliado',
  '/favicon.svg',
  '#0E8A5B',
  '#F4A33C',
  'Servico digital, nao reembolsavel apos ativacao do acesso.',
  '/termos-condicoes'
)
on conflict (id) do nothing;

-- Optional trigger to keep updated_at fresh.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists trg_partners_updated_at on public.partners;
create trigger trg_partners_updated_at
before update on public.partners
for each row execute function public.set_updated_at();

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated_at on public.settings;
create trigger trg_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

-- Basic RLS scaffolding. Adjust to your auth model.
alter table public.coupons enable row level security;
alter table public.partners enable row level security;
alter table public.customers enable row level security;
alter table public.coupon_usage enable row level security;
alter table public.metrics_snapshots enable row level security;
alter table public.settings enable row level security;
alter table public.purchases enable row level security;
alter table public.admin_users enable row level security;

-- Example open read policy for coupons (public area).
drop policy if exists coupons_public_read on public.coupons;
create policy coupons_public_read on public.coupons
for select
using (active = true);

drop policy if exists purchases_public_insert on public.purchases;
create policy purchases_public_insert on public.purchases
for insert to anon, authenticated
with check (true);

drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read on public.admin_users
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists coupons_admin_all on public.coupons;
create policy coupons_admin_all on public.coupons
for all to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
);

drop policy if exists partners_admin_all on public.partners;
create policy partners_admin_all on public.partners
for all to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
);

drop policy if exists customers_admin_all on public.customers;
create policy customers_admin_all on public.customers
for all to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
);

drop policy if exists usage_admin_all on public.coupon_usage;
create policy usage_admin_all on public.coupon_usage
for all to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
);

drop policy if exists metrics_admin_all on public.metrics_snapshots;
create policy metrics_admin_all on public.metrics_snapshots
for all to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
);

drop policy if exists settings_admin_all on public.settings;
create policy settings_admin_all on public.settings
for all to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid() and au.role = 'admin'
  )
);

-- Replace these with role-based policies before production writes.
-- Example admin full access policy using authenticated users:
-- create policy admin_all_coupons on public.coupons
-- for all to authenticated
-- using (true)
-- with check (true);
