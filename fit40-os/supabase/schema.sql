-- Fit40 OS — Database Schema
-- Apply in Supabase SQL editor

create extension if not exists "pgcrypto";

-- ──────────────────────────────
-- PROFILES
-- ──────────────────────────────
create table if not exists public.user_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null,
  age             int not null check (age between 18 and 99),
  height_cm       numeric(5,1) not null,
  start_weight_kg numeric(5,2) not null,
  goal            text not null default 'cut'
                    check (goal in ('cut', 'recomp', 'lean_bulk')),
  level           text not null default 'intermediate'
                    check (level in ('beginner', 'intermediate', 'advanced')),
  training_days   int[] not null default '{1,2,4,5}',
  activity_level  text not null default 'light'
                    check (activity_level in ('sedentary','light','moderate','active','very_active')),
  injuries        text,
  food_prefs      text,
  body_fat_pct    numeric(4,1),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ──────────────────────────────
-- DAILY WEIGHT LOGS
-- ──────────────────────────────
create table if not exists public.daily_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  log_date        date not null,
  weight_kg       numeric(5,2) not null,
  notes           text,
  sleep_hours     numeric(3,1),
  energy_level    int check (energy_level between 1 and 5),
  created_at      timestamptz not null default now(),
  unique (user_id, log_date)
);

-- ──────────────────────────────
-- NUTRITION LOGS
-- ──────────────────────────────
create table if not exists public.nutrition_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  log_date        date not null,
  food_text       text not null,
  protein_g       numeric(6,1),
  carbs_g         numeric(6,1),
  fat_g           numeric(6,1),
  calories        numeric(7,1),
  ai_notes        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, log_date)
);

-- ──────────────────────────────
-- WORKOUT PLANS (templates)
-- ──────────────────────────────
create table if not exists public.workout_plans (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  day_of_week     int[] not null default '{1,2,4,5}',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create table if not exists public.plan_exercises (
  id              uuid primary key default gen_random_uuid(),
  plan_id         uuid not null references public.workout_plans(id) on delete cascade,
  name            text not null,
  muscle_group    text not null,
  sets            int not null default 3,
  rep_min         int not null default 6,
  rep_max         int not null default 12,
  order_index     int not null default 1,
  notes           text
);

-- ──────────────────────────────
-- WORKOUT SESSIONS (instances)
-- ──────────────────────────────
create table if not exists public.workout_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  plan_id         uuid references public.workout_plans(id) on delete set null,
  session_date    date not null,
  status          text not null default 'planned'
                    check (status in ('planned','in_progress','completed','skipped')),
  duration_min    int,
  overall_rpe     int check (overall_rpe between 1 and 10),
  notes           text,
  created_at      timestamptz not null default now()
);

create table if not exists public.exercise_logs (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.workout_sessions(id) on delete cascade,
  plan_exercise_id uuid references public.plan_exercises(id) on delete set null,
  name            text not null,
  muscle_group    text not null,
  order_index     int not null default 1,
  progression_flag text check (progression_flag in ('increase','maintain','decrease'))
);

create table if not exists public.set_logs (
  id              uuid primary key default gen_random_uuid(),
  exercise_log_id uuid not null references public.exercise_logs(id) on delete cascade,
  set_number      int not null,
  reps_done       int not null,
  weight_kg       numeric(5,2) not null,
  rpe             int check (rpe between 1 and 10),
  rest_seconds    int,
  notes           text
);

-- ──────────────────────────────
-- BODY MEASUREMENTS
-- ──────────────────────────────
create table if not exists public.body_measurements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  measured_at     date not null,
  chest_cm        numeric(5,1),
  waist_cm        numeric(5,1),
  hip_cm          numeric(5,1),
  arm_cm          numeric(5,1),
  thigh_cm        numeric(5,1),
  body_fat_pct    numeric(4,1),
  created_at      timestamptz not null default now()
);

-- ──────────────────────────────
-- PROGRESS PHOTOS
-- ──────────────────────────────
create table if not exists public.progress_photos (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  photo_date      date not null,
  storage_path    text not null,
  angle           text check (angle in ('front','side','back')),
  weight_kg       numeric(5,2),
  created_at      timestamptz not null default now()
);

-- ──────────────────────────────
-- AI RECOMMENDATIONS CACHE
-- ──────────────────────────────
create table if not exists public.ai_recommendations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  rec_date        date not null,
  recommendation  text not null,
  context_snapshot jsonb,
  created_at      timestamptz not null default now(),
  unique (user_id, rec_date)
);

-- ──────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────
alter table public.user_profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.workout_plans enable row level security;
alter table public.plan_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.set_logs enable row level security;
alter table public.body_measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.ai_recommendations enable row level security;

-- user_profiles
create policy "Users see own profile" on public.user_profiles for select using (id = auth.uid());
create policy "Users insert own profile" on public.user_profiles for insert with check (id = auth.uid());
create policy "Users update own profile" on public.user_profiles for update using (id = auth.uid());

-- daily_logs, nutrition_logs, workout_plans, workout_sessions, etc.
do $$ declare tbl text; begin
  foreach tbl in array array['daily_logs','nutrition_logs','workout_plans','workout_sessions','body_measurements','ai_recommendations'] loop
    execute format('create policy "Own data select %s" on public.%s for select using (user_id = auth.uid())', tbl, tbl);
    execute format('create policy "Own data insert %s" on public.%s for insert with check (user_id = auth.uid())', tbl, tbl);
    execute format('create policy "Own data update %s" on public.%s for update using (user_id = auth.uid())', tbl, tbl);
    execute format('create policy "Own data delete %s" on public.%s for delete using (user_id = auth.uid())', tbl, tbl);
  end loop;
end $$;

-- ──────────────────────────────
-- INDEXES
-- ──────────────────────────────
create index on public.daily_logs(user_id, log_date desc);
create index on public.nutrition_logs(user_id, log_date desc);
create index on public.workout_sessions(user_id, session_date desc);
create index on public.set_logs(exercise_log_id);
create index on public.ai_recommendations(user_id, rec_date desc);
