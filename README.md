# Bloco Sambará

App de gestión de escuela de batucada. Web responsive (mobile-first) construida con React + Vite + Tailwind, con backend en Supabase.

Pensada como SaaS multi-tenant desde el día 1: misma codebase, branding por cliente vía CSS variables.
Camino claro a apps nativas iOS/Android en el futuro vía [Capacitor](https://capacitorjs.com/) sin reescribir.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| UI | React 18 + Vite + TypeScript |
| Estilos | Tailwind CSS (tokens de marca via CSS variables) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Iconos | lucide-react |
| Backend | Supabase (Auth + Postgres + Storage + RLS) |

---

## Setup local

### 1. Requisitos

- Node.js 20+ (probado con 22.x)
- Cuenta de Supabase (plan gratuito alcanza para desarrollo)

### 2. Clonar e instalar

```bash
git clone <repo-url>
cd bloco-sambara
npm install
```

### 3. Crear el proyecto en Supabase

1. Entrá a [app.supabase.com](https://app.supabase.com) y creá un proyecto nuevo (free tier).
2. Anotá `Project URL` y `anon public key` desde **Project Settings → API**.

### 4. Aplicar el schema

En **SQL Editor** del dashboard de Supabase, pegar y ejecutar en orden:

1. `supabase/migrations/0001_init.sql` — crea tablas, RLS y trigger de auth.
2. `supabase/seed.sql` — inserta el tenant `sambara`.

### 5. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con los valores reales:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_DEFAULT_TENANT_SLUG=sambara
```

> ⚠️ `.env.local` está gitignoreado. **Nunca** commitees claves reales.

### 6. Configurar Auth en Supabase

En el dashboard, **Authentication → Providers → Email** y **Authentication → URL Configuration**:

**Email confirmation** — decidí entre dos modos según tu caso:

| Modo | Cuándo | Cómo |
|------|--------|------|
| **Cerrado (recomendado para Sambará)** | El profe da de alta los alumnos. No hay self-signup público. | En **Authentication → Sign In / Providers → Email**, desactivá "Confirm email". Los users que cree el profe entran directamente. |
| **Abierto con confirmación** | Cuando habilites pre-inscripción desde la app. | Dejá "Confirm email" activo y configurá un SMTP custom (Resend, SendGrid) en **Project Settings → Auth → SMTP**. Sin SMTP custom, los emails de Supabase llegan al spam o tienen rate limits muy bajos. |

**URL Configuration** — esto es crítico para que el login funcione en producción:

- **Site URL**: la URL de tu app (en local `http://localhost:5173`, en prod la de Vercel)
- **Redirect URLs**: agregá tanto la local como la de producción + `/**` (ej. `https://tu-app.vercel.app/**`)

### 7. Crear el primer usuario (Jess, profe)

En el dashboard de Supabase: **Authentication → Users → Add user → Create new user**

- Email: el tuyo
- Password: el que quieras
- Auto Confirm User: ✅
- User Metadata: `{ "name": "Jess", "tenant_slug": "sambara" }`

El trigger `on_auth_user_created` crea automáticamente el `profile` con role `student` y status `pending`. Luego en **Table Editor → profiles** subimos a Jess a profe:

```sql
update public.profiles
   set role = 'teacher', status = 'active'
 where email = 'tu@email.com';
```

### 8. Levantar la app

```bash
npm run dev
```

Abrir http://localhost:5173 — login con el email/password creado.

---

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Dev server con HMR |
| `npm run build` | Typecheck + build de producción a `dist/` |
| `npm run preview` | Servir el build local (validar antes de deploy) |
| `npm run typecheck` | Solo TypeScript, sin emit |
| `npm run lint` | ESLint |

---

## Estructura de carpetas

```
bloco-sambara/
├── src/
│   ├── components/
│   │   ├── ui/              Design system (Button, Card, Pill, Avatar, Input, PageHeader, EmptyState)
│   │   └── layout/          AppLayout, TabBar
│   ├── features/
│   │   ├── auth/            AuthProvider, ProtectedRoute
│   │   └── tenant/          TenantProvider (carga branding)
│   ├── lib/                 supabase client, helpers
│   ├── pages/               Una página por ruta
│   ├── types/               Tipos de dominio
│   ├── App.tsx              Routing
│   └── main.tsx             Entry point
├── supabase/
│   ├── migrations/          Schema versionado (correr en orden)
│   └── seed.sql             Tenant inicial
├── .env.example             Plantilla de envs (copiar a .env.local)
├── tailwind.config.js       Tokens de marca (brand-* via CSS vars)
└── vite.config.ts
```

---

## Multi-tenant: cómo funciona

- Cada fila de cada tabla lleva `tenant_id`.
- RLS (Row Level Security) en Postgres separa los datos: cada usuario solo ve lo de su tenant.
- El branding (colores, logo, nombre) se guarda en `tenants.brand_colors` como JSON.
- Al iniciar la app, `TenantProvider` carga la config y inyecta los colores en `:root` como CSS variables (`--brand-50` ... `--brand-900`).
- Tailwind usa esas variables (`brand-500`, `brand-gradient`, etc.), así que **toda la UI cambia de marca cambiando el JSON del tenant** — sin tocar código.

Para agregar un cliente nuevo: insertar otra row en `tenants` con el slug, nombre y los colores RGB en formato `"R G B"` (ej. `"194 57 140"` para fucsia).

---

## Seguridad — buenas prácticas

- ✅ `.env.local` y `.env*` están gitignoreados.
- ✅ Solo usamos la **anon key** en el frontend (es pública por diseño, RLS hace cumplir los permisos).
- ❌ La **service_role key** **nunca** debe llegar al cliente. Solo para Edge Functions o scripts admin server-side.
- ✅ RLS habilitado en todas las tablas con `tenant_id`.
- ✅ Trigger `handle_new_auth_user` con `security definer` y `search_path` fijado.
- ✅ El `tenants` tiene SELECT público (necesario para mostrar branding antes del login), pero no permite INSERT/UPDATE/DELETE desde el cliente.

---

## Roadmap (próximas fases)

1. **Alumnos**: lista, ficha, inscripciones pendientes.
2. **Clases**: calendario, sesiones, pasar lista, recuperaciones automáticas.
3. **Multimedia**: subida con cascada de niveles, Storage de Supabase, RLS.
4. **Eventos**: crear, publicar, confirmar asistencia.
5. **Finanzas**: cuotas mensuales, saldo, transacciones.
6. **Tienda**: productos, pedidos, descuentos.
7. **PWA**: manifest, service worker, instalable en home screen.
8. **Apps nativas**: agregar Capacitor → iOS + Android desde el mismo bundle.

---

## Deploy

### Web (Vercel)

1. Importar el repo en [vercel.com](https://vercel.com/new).
2. Framework preset: **Vite** (auto-detectado).
3. Variables de entorno: agregar `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEFAULT_TENANT_SLUG`.
4. Deploy. URL pública lista.

### Apps nativas (futuro)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init
npx cap add ios
npx cap add android
npm run build && npx cap sync
npx cap open ios     # o android
```

---

## Licencia

Privado — Bloco Sambará.
