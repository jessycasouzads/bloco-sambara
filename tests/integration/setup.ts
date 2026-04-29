/// <reference types="vitest/globals" />
import { config } from 'dotenv';

// Carga .env.test.local antes de que cualquier helper lea process.env.
// override:true para que valores en el archivo ganen sobre vars del shell.
config({ path: '.env.test.local', override: true });

// Sanity check: si faltan las 3 vars, fallar acá con mensaje claro
// en vez de mensajes confusos en mitad de los tests.
const required = ['SUPABASE_TEST_URL', 'SUPABASE_TEST_ANON_KEY', 'SUPABASE_TEST_SERVICE_ROLE_KEY'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno para tests de integración: ${missing.join(', ')}.\n` +
      `Asegurate de tener .env.test.local con esos valores, ` +
      `o setealos como GitHub Secrets si esto corre en CI.`,
  );
}
