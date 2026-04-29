# CLAUDE.md — Instrucciones de trabajo

Este archivo es para Claude. Define cómo trabajar en este repo. Vos (humana) no necesitás leerlo, pero podés revisarlo y editarlo cuando quieras cambiar las reglas.

---

## Contexto del proyecto

- **Qué**: app SaaS multi-tenant para gestión de escuelas de batucada
- **Estado**: solo cliente activo es **Sambará**. Pensado para multi-tenant desde el día 1
- **Stack**: React + Vite + TS + Tailwind + Supabase, deploy en Vercel
- **Plataforma**: web responsive (mobile-first) hoy → apps nativas vía Capacitor en el futuro
- **Equipo**: solo dev (Jess)
- **Lenguaje**: español castellano de España, "tú" en lugar de "vos" en la UI

---

## Stack guardrails (no cambiar sin discutirlo)

| Capa                 | Herramienta                                             |
| -------------------- | ------------------------------------------------------- |
| UI                   | React 18, TypeScript estricto, Tailwind                 |
| Build                | Vite                                                    |
| State                | Zustand + React Context                                 |
| Forms                | React Hook Form + Zod                                   |
| Iconos               | lucide-react                                            |
| Backend              | Supabase (Auth, Postgres, Storage, RLS, Edge Functions) |
| Tests unit/component | Vitest + @testing-library/react                         |
| Tests E2E            | Playwright                                              |
| API docs             | OpenAPI 3.1 + Scalar (en `/api-docs`)                   |
| Deploy               | Vercel (web), Capacitor (nativo, futuro)                |

Si algo cambia (ej. cambiar zustand por jotai), levantar la pregunta antes de implementar.

---

## Multi-tenant: regla no-negociable

1. **Toda** tabla nueva DEBE tener `tenant_id uuid not null references tenants(id)`.
2. **Toda** RLS policy DEBE filtrar por `current_tenant_id()`.
3. **Todo** test de integración DEBE verificar aislamiento entre tenants (un usuario del tenant A no puede leer/escribir nada del tenant B).
4. Nunca hardcodear el tenant en el frontend — siempre via `useTenant()`.

---

## Coverage targets (diferenciados)

Coverage no es una métrica única. Targets distintos según qué código es:

| Path                                                              | Target                   | Por qué                                            |
| ----------------------------------------------------------------- | ------------------------ | -------------------------------------------------- |
| `src/lib/**` (lógica de dominio: cascadas, recuperaciones, saldo) | **95%**                  | Acá viven los bugs caros                           |
| `src/features/**/use*.ts` (hooks custom)                          | **90%**                  | Lógica reutilizada, hay que cubrir branches        |
| `src/components/**` (componentes con interacción)                 | **80%**                  | Comportamiento, no estilos                         |
| `src/stores/**` (Zustand stores)                                  | **90%**                  | Estado compartido                                  |
| RLS policies + triggers SQL                                       | **100% de los policies** | No-negociable. Integration tests los cubren todos. |
| E2E (Playwright)                                                  | Por escenario, no por %  | Cubrir happy paths críticos                        |

**Excluido del coverage** (no aporta testearlos):

- `src/main.tsx`, `src/App.tsx` (entry/routing puros)
- `src/types/**` (solo tipos)
- `src/vite-env.d.ts`
- `src/**/*.test.{ts,tsx}`
- `src/test/**` (helpers de testing)
- `*.config.{ts,js}`

---

## Definition of Done para CADA feature

Un feature no se considera terminado hasta que TODO esto esté hecho:

### Backend

- [ ] Migración SQL en `supabase/migrations/` con comments explicativos
- [ ] RLS policies completas para CADA tabla nueva: SELECT, INSERT, UPDATE, DELETE
- [ ] Tests de integración cubriendo cada policy + multi-tenant isolation
- [ ] Tests para triggers y RPC functions
- [ ] Tipos TS regenerados (`npm run gen:types`)

### Frontend

- [ ] Componentes con tests RTL: render correcto, interacciones, estados de error y loading
- [ ] Hooks custom con tests cubriendo todos los branches
- [ ] Lógica de dominio en `src/lib/` con coverage al target

### E2E

- [ ] Al menos un escenario Playwright cubriendo el happy path principal del feature

### Documentación

- [ ] `docs/openapi.yaml` actualizado: nuevos endpoints, schemas, RPC, response codes, ejemplos
- [ ] Inline SQL comments en lo no obvio (RLS, triggers, funciones)
- [ ] README actualizado si cambia el setup local

### Verificación CI (todo verde)

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run format:check`
- [ ] `npm run test` (con coverage cumpliendo targets)
- [ ] `npm run test:e2e`
- [ ] `npm run build`

---

## Conventions

### Commits & branches

- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `ci:`, `style:`
- **Una branch por feature**: `feature/<nombre>`, `fix/<nombre>`
- **Una PR por feature** — debe pasar CI antes de mergear (branch protection lo enforza)
- **No push directo a main** — siempre via PR

### Código

- TypeScript strict, evitar `any`
- Default a NO escribir comentarios — buen naming primero
- Comentarios solo cuando el WHY no es obvio (regla de negocio rara, workaround documentado)
- Un componente por archivo (excepto helpers internos pequeños)
- Hooks en archivo separado del Provider (HMR-safe)
- Imports absolutos via `@/` para todo lo que no sea hermano

### UI

- Mobile-first siempre — empezar con mobile, agregar `lg:` para desktop
- Reutilizar el design system (`Button`, `Card`, `Pill`, `Avatar`, etc.) antes de crear componentes nuevos
- Branding via CSS variables — nunca hardcodear `#a82876`, usar `bg-brand-600`
- Empty states con dibujito + mensaje + CTA

---

## Prohibido

- ❌ `console.log` committeado (`console.warn/error` permitidos)
- ❌ `TODO`/`FIXME` sin link a issue de tracking
- ❌ `--no-verify` en commits sin emergencia documentada + issue de follow-up
- ❌ Disabling tests para que CI pase — siempre root-cause el fallo
- ❌ Hardcodear el tenant — usar `useTenant()`
- ❌ Commitear `.env.local`, claves, o cualquier secret
- ❌ Agregar deps sin justificación en el PR description
- ❌ Service role key de Supabase en frontend — solo Edge Functions / scripts admin

---

## Workflow para un feature nuevo

1. Crear branch: `git checkout -b feature/alumnos`
2. Schema first: migración SQL + RLS + comments
3. Tipos: `npm run gen:types` (regenera `src/types/database.ts`)
4. Tests de integración del schema (RLS, multi-tenant, triggers)
5. Lógica de dominio en `src/lib/` + tests unitarios
6. Componentes + tests RTL
7. Páginas + integración con el resto
8. E2E del happy path
9. Actualizar `docs/openapi.yaml`
10. PR con descripción siguiendo el template, CI verde, mergear

---

## Notas operativas

- **Idioma de la UI**: español castellano de España. "Tú" no "vos".
- **Color primario**: fucsia `#a82876` (default), branded por tenant via CSS vars.
- **Tipografías**: Fraunces (titles), Plus Jakarta Sans (body).
- **Naming**: nombres en español para entidades de dominio (`alumnos`, `clases`, `recuperaciones`), inglés para conceptos técnicos (`tenant_id`, `created_at`).
