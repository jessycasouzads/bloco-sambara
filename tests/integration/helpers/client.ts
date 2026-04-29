import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceRoleKey) {
  throw new Error(
    'Faltan credenciales del proyecto Supabase de test. ' +
      'Copia .env.test.example a .env.test.local y completá los 3 valores.',
  );
}

const noPersistAuth = {
  auth: { autoRefreshToken: false, persistSession: false },
};

/**
 * Cliente con service_role: bypassa RLS.
 * Usar SOLO para setup/cleanup en tests (crear tenants/users, limpiar).
 * NUNCA usar para verificar comportamiento de RLS — para eso, usar un anon client logueado.
 */
export const adminClient: SupabaseClient = createClient(url, serviceRoleKey, noPersistAuth);

/**
 * Cliente nuevo con anon key.
 * Usalo para impersonar a un usuario logueado (signInWithPassword) y verificar RLS real.
 * Cada test debería crear su propio anon client para evitar leakage entre tests.
 */
export function createAnonClient(): SupabaseClient {
  return createClient(url!, anonKey!, noPersistAuth);
}
