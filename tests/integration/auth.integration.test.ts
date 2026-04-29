import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { adminClient } from './helpers/client';
import { createTestTenant, deleteTestTenant, type TestTenant } from './helpers/tenant';

/**
 * Tests del trigger `handle_new_auth_user` definido en supabase/migrations/0001_init.sql.
 *
 * El trigger se dispara cuando alguien se da de alta en auth.users y debería:
 * 1. Crear automáticamente una fila en public.profiles
 * 2. Asociarla al tenant según raw_user_meta_data.tenant_slug
 * 3. Defaultear name al prefijo del email si no viene
 * 4. Defaultear role='student', status='pending'
 * 5. Fallar si el tenant_slug no existe
 */
describe('Trigger handle_new_auth_user', () => {
  let tenant: TestTenant;

  beforeAll(async () => {
    tenant = await createTestTenant('auth-trigger');
  });

  afterAll(async () => {
    await deleteTestTenant(tenant.id);
  });

  it('crea automáticamente una fila en profiles cuando se registra un nuevo auth user', async () => {
    const email = `it_${randomUUID().slice(0, 8)}@example.test`;
    const name = 'María Test';

    const { data: authData, error } = await adminClient.auth.admin.createUser({
      email,
      password: randomUUID(),
      email_confirm: true,
      user_metadata: { name, tenant_slug: tenant.slug },
    });

    expect(error).toBeNull();
    expect(authData.user).toBeDefined();
    const userId = authData.user!.id;

    try {
      const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('id, tenant_id, email, name, role, status, level')
        .eq('id', userId)
        .single();

      expect(profileError).toBeNull();
      expect(profile).toMatchObject({
        id: userId,
        tenant_id: tenant.id,
        email,
        name,
        role: 'student',
        status: 'pending',
        level: null,
      });
    } finally {
      await adminClient.auth.admin.deleteUser(userId);
    }
  });

  it('usa el prefijo del email como name cuando no viene en metadata', async () => {
    const prefix = `fallback_${randomUUID().slice(0, 8)}`;
    const email = `${prefix}@example.test`;

    const { data: authData, error } = await adminClient.auth.admin.createUser({
      email,
      password: randomUUID(),
      email_confirm: true,
      // metadata sin "name" — debe defaultear al prefijo
      user_metadata: { tenant_slug: tenant.slug },
    });

    expect(error).toBeNull();
    const userId = authData.user!.id;

    try {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('name')
        .eq('id', userId)
        .single();

      expect(profile?.name).toBe(prefix);
    } finally {
      await adminClient.auth.admin.deleteUser(userId);
    }
  });

  it('falla cuando tenant_slug en metadata apunta a un tenant inexistente', async () => {
    const email = `notenant_${randomUUID().slice(0, 8)}@example.test`;
    const fakeSlug = `slug_que_no_existe_${randomUUID().slice(0, 6)}`;

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password: randomUUID(),
      email_confirm: true,
      user_metadata: { tenant_slug: fakeSlug },
    });

    // El trigger lanza una excepción → el create falla.
    // Supabase wrappea el error del trigger en un mensaje genérico
    // ("Database error creating new user") así que no podemos hacer match
    // del texto específico del raise. Lo importante es: el create falla
    // y el user NO queda creado.
    expect(error).toBeTruthy();
    expect(data.user).toBeNull();

    // Verificación: no quedó profile con ese email (si el create hubiese leakeado
    // user a auth.users, el trigger habría creado el profile asociado)
    const { data: profiles } = await adminClient.from('profiles').select('id').eq('email', email);
    expect(profiles).toEqual([]);
  });
});
