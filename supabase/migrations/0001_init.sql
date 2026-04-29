-- =============================================================
-- Bloco Sambará — Schema inicial
-- Multi-tenant: cada fila tiene tenant_id, RLS hace la separación.
-- =============================================================

-- ---------- Extensiones ----------
create extension if not exists "uuid-ossp";

-- ---------- Enums ----------
do $$ begin
  create type level as enum ('iniciacion', 'intermedio', 'bloco');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('teacher', 'student', 'both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_status as enum ('active', 'pending', 'inactive');
exception when duplicate_object then null; end $$;

-- ---------- Tabla: tenants ----------
create table if not exists public.tenants (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  name         text not null,
  logo_url     text,
  brand_colors jsonb,            -- { "50": "253 242 248", ..., "900": "..." }
  config       jsonb default '{}'::jsonb,
  created_at   timestamptz default now()
);

-- ---------- Tabla: profiles ----------
-- Extiende auth.users con datos de dominio. id == auth.users.id.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  email       text not null,
  name        text not null,
  phone       text,
  avatar_url  text,
  role        user_role not null default 'student',
  level       level,
  status      user_status not null default 'pending',
  join_date   date not null default current_date,
  created_at  timestamptz default now()
);

create index if not exists idx_profiles_tenant   on public.profiles(tenant_id);
create index if not exists idx_profiles_role     on public.profiles(role);
create index if not exists idx_profiles_level    on public.profiles(level);

-- ---------- Helper: tenant del usuario actual ----------
-- Se usa en las policies para filtrar por tenant sin queries extras.
create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

-- ---------- Helper: rol del usuario actual ----------
create or replace function public.current_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- RLS ----------
alter table public.tenants  enable row level security;
alter table public.profiles enable row level security;

-- Tenants: cualquier usuario logueado puede leer el suyo (para branding).
-- La lectura pública del tenant por slug se permite porque el TenantProvider
-- hace la query antes del login (necesita el branding en la pantalla de login).
drop policy if exists tenants_read_by_slug on public.tenants;
create policy tenants_read_by_slug
  on public.tenants for select
  using (true);

-- Solo modificable desde el panel admin (futuro). Por ahora, sin INSERT/UPDATE/DELETE
-- desde el cliente — se hace via Supabase Studio o service role.

-- Profiles: el usuario lee/edita el suyo, y los del mismo tenant.
drop policy if exists profiles_read_same_tenant on public.profiles;
create policy profiles_read_same_tenant
  on public.profiles for select
  using (tenant_id = public.current_tenant_id());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Profesor del mismo tenant puede actualizar otros perfiles (asignar nivel, etc).
drop policy if exists profiles_update_by_teacher on public.profiles;
create policy profiles_update_by_teacher
  on public.profiles for update
  using (
    tenant_id = public.current_tenant_id()
    and public.current_role() in ('teacher', 'both')
  )
  with check (tenant_id = public.current_tenant_id());

-- INSERT de profiles: lo hace el trigger de auth.users (ver más abajo) o el profe
-- al aprobar inscripciones (futuro). Por ahora bloqueado desde el cliente.

-- ---------- Trigger: crear profile al registrar un auth.user ----------
-- El user se registra con metadata { tenant_slug, name, role? }.
-- El trigger crea el row en profiles con status 'pending' y role 'student' por default.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_slug      text;
  v_name      text;
begin
  v_slug := coalesce(new.raw_user_meta_data->>'tenant_slug', 'sambara');
  v_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  select id into v_tenant_id from public.tenants where slug = v_slug;
  if v_tenant_id is null then
    raise exception 'Tenant % no existe', v_slug;
  end if;

  insert into public.profiles (id, tenant_id, email, name, role, status)
  values (new.id, v_tenant_id, new.email, v_name, 'student', 'pending');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
