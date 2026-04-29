# Supabase integration - Descola Chile

This project can run in two modes:

1. Local mock mode (default).
2. Supabase mode (optional, production path).

## 1) Create database objects

Run [schema.sql](schema.sql) in Supabase SQL Editor.

## 2) Add frontend config

1. Copy [supabase-config.example.js](supabase-config.example.js) to `/supabase-config.js`.
2. Fill your project URL and anon key.
3. Set `enabled: true`.

## 3) Include scripts in pages

Include these scripts before `platform-data.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/supabase-config.js"></script>
```

Then keep:

```html
<script src="/platform-data.js"></script>
```

`platform-data.js` now auto-detects Supabase and switches provider.

## 4) Security note

RLS is enabled in schema with admin role policies.

Before production:

1. Avoid exposing service role keys in browser.
2. Keep only anon key in frontend.
3. Manage admin access via Supabase Auth + `admin_users` table.

## 5) Admin auth setup

1. Create admin user in Supabase Auth (email/password).
2. Get the user id (`auth.users.id`).
3. Insert that id in `public.admin_users`:

```sql
insert into public.admin_users (user_id, email, role)
values ('YOUR_AUTH_USER_UUID', 'admin@descolachile.com', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Only users present in `admin_users` with role `admin` can read/write admin tables.

Public checkout writes to `purchases` are enabled via RLS insert policy.

## 6) Current provider methods backed by Supabase

- `getCoupons`
- `getPartners`
- `getCustomers`
- `getCouponUsage`
- `getMetrics`
- `getSettings`
- `saveSettings`
- `saveCoupon`
- `deleteCoupon`
- `savePurchase`

If config/sdk is missing, it falls back to local mocks automatically.
