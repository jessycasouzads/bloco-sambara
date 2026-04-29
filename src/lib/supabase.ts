import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Falta configuración de Supabase. Copia .env.example a .env.local y completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
  );
}

// Nota: cuando estabilicemos el schema, generamos los tipos con
// `npx supabase gen types typescript` y los pasamos como genérico aquí.
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
