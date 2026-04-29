-- =============================================================
-- Seed inicial — solo el tenant Sambará.
-- Los usuarios se crean a través de auth (Supabase Studio o signup).
-- Luego se hace UPDATE para promover a Jess a teacher.
-- =============================================================

insert into public.tenants (slug, name, logo_url, brand_colors)
values (
  'sambara',
  'Bloco Sambará',
  null,
  '{
    "50":  "253 242 248",
    "100": "252 231 243",
    "200": "251 207 232",
    "300": "249 168 212",
    "400": "232 121 173",
    "500": "194 57 140",
    "600": "168 40 118",
    "700": "138 31 96",
    "800": "111 26 77",
    "900": "90 22 62"
  }'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  brand_colors = excluded.brand_colors;
