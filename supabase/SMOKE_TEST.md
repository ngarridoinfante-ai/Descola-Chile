# Supabase Smoke Test (10 minutos)

Objetivo: validar que el sitio usa Supabase correctamente en publico y admin, con seguridad por rol.

## 0) Precondiciones

1. Ejecutaste `supabase/schema.sql` en SQL Editor.
2. Completaste `supabase-config.js` con:
   - `enabled: true`
   - `url`
   - `anonKey`
3. Creaste al menos 1 usuario admin en Supabase Auth.
4. Insertaste su `auth.users.id` en `public.admin_users` con rol `admin`.

SQL sugerido:

```sql
insert into public.admin_users (user_id, email, role)
values ('YOUR_AUTH_USER_UUID', 'admin@descolachile.com', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

## 1) Prueba de login admin

1. Abre `/admin`.
2. Inicia sesion con el usuario admin de Supabase Auth.
3. Resultado esperado:
   - Entras al dashboard.
   - No aparece mensaje de credenciales mock.

### Prueba negativa (seguridad)

1. Inicia sesion con un usuario autenticado SIN fila en `admin_users`.
2. Resultado esperado:
   - El acceso admin es rechazado.
   - Se cierra sesion automaticamente o vuelve a login.

## 2) Prueba CRUD de cupones (RLS admin)

1. Entra a `/admin/cupons`.
2. Crea un cupon nuevo.
3. Edita ese cupon.
4. Elimina ese cupon.
5. Resultado esperado:
   - Las operaciones funcionan desde UI.
   - Se reflejan en tabla `public.coupons`.

## 3) Prueba de configuracion (RLS admin)

1. Entra a `/admin/configuracoes`.
2. Cambia un valor simple (ej. `membershipPrice`).
3. Guarda.
4. Resultado esperado:
   - UI confirma guardado.
   - Se refleja en `public.settings` (`id = 'main'`).

## 4) Prueba de flujo publico checkout

1. Abre `/checkout`.
2. Completa el formulario.
3. Continua a `/success`.
4. Resultado esperado:
   - Compra confirmada en UI.
   - Registro creado en `public.purchases`.

## 5) Prueba de catalogo publico

1. Abre `/meus-descontos`.
2. Resultado esperado:
   - Carga cupones activos desde Supabase.
   - Filtros y busqueda funcionan.

## 6) Validacion SQL rapida

Ejecuta en SQL Editor:

```sql
select count(*) from public.coupons;
select count(*) from public.purchases;
select id, membership_price from public.settings where id = 'main';
select user_id, role from public.admin_users;
```

## 7) Criterio de aprobado

Checklist final:

- [ ] Admin login solo permite usuarios con rol admin.
- [ ] Usuario autenticado sin rol admin NO entra al panel.
- [ ] CRUD de cupones funciona desde admin.
- [ ] Configuracion guarda en `settings`.
- [ ] Checkout publico inserta en `purchases`.
- [ ] Catalogo publico carga cupones activos.

## 8) Fallas tipicas y solucion rapida

1. Error de permisos en admin:
   - Revisar fila en `admin_users` para ese `auth.uid()`.
   - Confirmar que `role = 'admin'`.
2. Error de conexion Supabase:
   - Revisar `supabase-config.js` (`url`, `anonKey`, `enabled`).
3. Nada cambia en UI:
   - Hard refresh del navegador para limpiar cache de scripts.
4. Checkout no inserta en `purchases`:
   - Verificar politica `purchases_public_insert` en RLS.
