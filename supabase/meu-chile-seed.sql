-- Meu Chile seed data (safe to re-run)
-- Run this after schema.sql + meu-chile-schema.sql.

begin;

-- Demo user
insert into public.users (
  id,
  auth_user_id,
  full_name,
  first_name,
  email,
  whatsapp,
  locale
)
values (
  '11111111-1111-4111-8111-111111111111',
  null,
  'Camila Souza',
  'Camila',
  'camila.demo@descolachile.com',
  '+55 11 98888-7777',
  'pt-BR'
)
on conflict (id) do update set
  full_name = excluded.full_name,
  first_name = excluded.first_name,
  email = excluded.email,
  whatsapp = excluded.whatsapp,
  locale = excluded.locale,
  updated_at = now();

-- Demo trip
insert into public.trips (
  id,
  user_id,
  destination,
  trip_type,
  mood,
  budget_level,
  start_date,
  end_date,
  status
)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Santiago',
  'casal',
  'gastronomico',
  'medio',
  '2026-05-06',
  '2026-05-10',
  'active'
)
on conflict (id) do update set
  user_id = excluded.user_id,
  destination = excluded.destination,
  trip_type = excluded.trip_type,
  mood = excluded.mood,
  budget_level = excluded.budget_level,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  status = excluded.status,
  updated_at = now();

-- Itinerary days
insert into public.itineraries (id, trip_id, day_index, day_label, travel_date)
values
  (
    '33333333-3333-4333-8333-333333333331',
    '22222222-2222-4222-8222-222222222222',
    1,
    'Dia 1 - Centro e Lastarria',
    '2026-05-06'
  ),
  (
    '33333333-3333-4333-8333-333333333332',
    '22222222-2222-4222-8222-222222222222',
    2,
    'Dia 2 - Neve e jantar especial',
    '2026-05-07'
  )
on conflict (id) do update set
  day_index = excluded.day_index,
  day_label = excluded.day_label,
  travel_date = excluded.travel_date,
  updated_at = now();

-- Itinerary items day 1
insert into public.itinerary_items (
  id,
  itinerary_id,
  period,
  item_order,
  name,
  suggested_time,
  eta_minutes,
  distance_km,
  human_tip,
  cta_label,
  cta_url,
  discount_text
)
values
  (
    '44444444-4444-4444-8444-444444444411',
    '33333333-3333-4333-8333-333333333331',
    'manha',
    1,
    'Café no Lastarria + caminhada cultural',
    '09:00',
    12,
    3.2,
    'Leve uma camada extra: o vento muda rapido pela manha.',
    'Ver mapa',
    'https://maps.google.com/?q=Lastarria,Santiago',
    '15% OFF em cafe + doce'
  ),
  (
    '44444444-4444-4444-8444-444444444412',
    '33333333-3333-4333-8333-333333333331',
    'almoco',
    2,
    'Almoço em bistrô parceiro',
    '13:00',
    8,
    1.4,
    'Reserve antes de sair do passeio para evitar fila.',
    'Reservar',
    'https://wa.me/56941079792',
    '10% OFF menu executivo'
  ),
  (
    '44444444-4444-4444-8444-444444444413',
    '33333333-3333-4333-8333-333333333331',
    'tarde',
    3,
    'Sky Costanera no melhor horario',
    '17:30',
    22,
    6.8,
    'Chegue 30 min antes do por do sol para fotos sem fila.',
    'Abrir rota',
    'https://maps.google.com/?q=Sky+Costanera',
    'Fila rapida com parceiro'
  ),
  (
    '44444444-4444-4444-8444-444444444414',
    '33333333-3333-4333-8333-333333333331',
    'noite',
    4,
    'Jantar romântico em Providencia',
    '20:00',
    15,
    4.1,
    'Peça mesa interna para ambiente mais tranquilo.',
    'Ver restaurante',
    'https://maps.google.com/?q=Providencia,Santiago',
    '12% OFF para membros Descola'
  )
on conflict (id) do update set
  period = excluded.period,
  item_order = excluded.item_order,
  name = excluded.name,
  suggested_time = excluded.suggested_time,
  eta_minutes = excluded.eta_minutes,
  distance_km = excluded.distance_km,
  human_tip = excluded.human_tip,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url,
  discount_text = excluded.discount_text,
  updated_at = now();

-- Itinerary items day 2
insert into public.itinerary_items (
  id,
  itinerary_id,
  period,
  item_order,
  name,
  suggested_time,
  eta_minutes,
  distance_km,
  human_tip,
  cta_label,
  cta_url,
  discount_text
)
values
  (
    '44444444-4444-4444-8444-444444444421',
    '33333333-3333-4333-8333-333333333332',
    'manha',
    1,
    'Transfer para Valle Nevado',
    '06:30',
    75,
    46.0,
    'Saia cedo para evitar transito na subida da montanha.',
    'Confirmar pickup',
    'https://wa.me/56941079792',
    '15% OFF no day pass'
  ),
  (
    '44444444-4444-4444-8444-444444444422',
    '33333333-3333-4333-8333-333333333332',
    'tarde',
    2,
    'Almoço de montanha + fotos',
    '13:30',
    5,
    0.5,
    'Hidrate-se bem: o clima seco engana.',
    'Ver dica',
    'https://www.descolachile.com/valle-nevado-inverno.html',
    'Combo parceiro no restaurante'
  ),
  (
    '44444444-4444-4444-8444-444444444423',
    '33333333-3333-4333-8333-333333333332',
    'noite',
    3,
    'Jantar de fechamento no centro',
    '20:30',
    18,
    7.5,
    'Ative seu QR antes de entrar no restaurante.',
    'Abrir beneficios',
    'https://www.descolachile.com/meus-descontos.html',
    '10% OFF jantar'
  )
on conflict (id) do update set
  period = excluded.period,
  item_order = excluded.item_order,
  name = excluded.name,
  suggested_time = excluded.suggested_time,
  eta_minutes = excluded.eta_minutes,
  distance_km = excluded.distance_km,
  human_tip = excluded.human_tip,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url,
  discount_text = excluded.discount_text,
  updated_at = now();

-- Smart alerts
insert into public.alerts (
  id,
  trip_id,
  user_id,
  alert_type,
  severity,
  title,
  message,
  trigger_source,
  is_read
)
values
  (
    '55555555-5555-4555-8555-555555555551',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'weather',
    'medium',
    'Frio intenso hoje',
    'Temperatura abaixo de 4C na tarde. Leve segunda camada e luvas.',
    'weather_api',
    false
  ),
  (
    '55555555-5555-4555-8555-555555555552',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'traffic',
    'high',
    'Janela ideal para retorno',
    'Saia de Valle Nevado ate 16:10 para evitar congestionamento na descida.',
    'maps_traffic',
    false
  ),
  (
    '55555555-5555-4555-8555-555555555553',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'coupon',
    'low',
    'Cupom com melhor horario',
    'Seu beneficio de jantar rende mais hoje entre 19:00 e 20:00.',
    'rules_engine',
    true
  )
on conflict (id) do update set
  severity = excluded.severity,
  title = excluded.title,
  message = excluded.message,
  trigger_source = excluded.trigger_source,
  is_read = excluded.is_read;

-- Preferences
insert into public.user_preferences (
  id,
  user_id,
  preferred_moods,
  budget_level,
  travel_pace,
  food_profile,
  accessibility_notes,
  push_opt_in,
  geolocation_opt_in,
  analytics_opt_in
)
values (
  '66666666-6666-4666-8666-666666666666',
  '11111111-1111-4111-8111-111111111111',
  array['gastronomico', 'romantico'],
  'medio',
  'balanced',
  'wine_and_local_food',
  null,
  true,
  false,
  true
)
on conflict (user_id) do update set
  preferred_moods = excluded.preferred_moods,
  budget_level = excluded.budget_level,
  travel_pace = excluded.travel_pace,
  food_profile = excluded.food_profile,
  accessibility_notes = excluded.accessibility_notes,
  push_opt_in = excluded.push_opt_in,
  geolocation_opt_in = excluded.geolocation_opt_in,
  analytics_opt_in = excluded.analytics_opt_in,
  updated_at = now();

-- Partners for benefits
insert into public.partners (
  id,
  category,
  company,
  district,
  benefit_summary,
  status,
  qr_mode,
  metadata
)
values
  (
    '77777777-7777-4777-8777-777777777771',
    'Restaurantes',
    'Bistro Andino',
    'Providencia',
    'Beneficios exclusivos para jantar e almoco.',
    'active',
    'single_use',
    '{"source":"seed"}'::jsonb
  ),
  (
    '77777777-7777-4777-8777-777777777772',
    'Neve',
    'Nevado Express',
    'Las Condes',
    'Passeios e day pass para neve.',
    'active',
    'single_use',
    '{"source":"seed"}'::jsonb
  )
on conflict (id) do update set
  category = excluded.category,
  company = excluded.company,
  district = excluded.district,
  benefit_summary = excluded.benefit_summary,
  status = excluded.status,
  qr_mode = excluded.qr_mode,
  metadata = excluded.metadata,
  updated_at = now();

-- Benefits consumed by Meu Chile cards
insert into public.benefits (
  id,
  partner_id,
  category,
  title,
  benefit_text,
  status,
  metadata
)
values
  (
    '88888888-8888-4888-8888-888888888881',
    '77777777-7777-4777-8777-777777777771',
    'restaurantes',
    'Jantar com desconto exclusivo',
    '12% OFF no menu principal para membros Descola.',
    'active',
    '{"ctaLabel":"usar beneficio"}'::jsonb
  ),
  (
    '88888888-8888-4888-8888-888888888882',
    '77777777-7777-4777-8777-777777777772',
    'neve',
    'Day pass com condicao especial',
    '15% OFF no day pass + prioridade no atendimento.',
    'active',
    '{"ctaLabel":"ativar agora"}'::jsonb
  ),
  (
    '88888888-8888-4888-8888-888888888883',
    null,
    'servicos',
    'eSIM viagem sem stress',
    '25% OFF no plano de dados para toda a viagem.',
    'active',
    '{"ctaLabel":"ver plano"}'::jsonb
  )
on conflict (id) do update set
  partner_id = excluded.partner_id,
  category = excluded.category,
  title = excluded.title,
  benefit_text = excluded.benefit_text,
  status = excluded.status,
  metadata = excluded.metadata,
  updated_at = now();

commit;
