import { randomUUID } from 'node:crypto';
import { adminClient } from './client';

export type TestRole = 'student' | 'teacher' | 'both';
export type TestLevel = 'iniciacion' | 'intermedio' | 'bloco';
export type TestStatus = 'active' | 'pending' | 'inactive';

export interface CreateTestUserOpts {
  tenantSlug: string;
  name?: string;
  role?: TestRole;
  status?: TestStatus;
  level?: TestLevel | null;
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  tenantSlug: string;
}

/**
 * Crea un usuario en auth.users. El trigger handle_new_auth_user se encarga
 * de crear la fila en profiles automáticamente. Si querés overridear role/status/level,
 * lo hacemos con un UPDATE post-creación.
 */
export async function createTestUser(opts: CreateTestUserOpts): Promise<TestUser> {
  const password = randomUUID();
  const email = `test_${randomUUID().slice(0, 12)}@example.test`;
  const name = opts.name ?? 'Test User';

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      tenant_slug: opts.tenantSlug,
    },
  });

  if (error || !data.user) {
    throw new Error(`createTestUser falló al crear auth.user: ${error?.message ?? 'sin user'}`);
  }

  const id = data.user.id;

  // Override role/status/level si se pidió (el trigger setea defaults: student/pending/null)
  const updates: Record<string, unknown> = {};
  if (opts.role) updates.role = opts.role;
  if (opts.status) updates.status = opts.status;
  if ('level' in opts) updates.level = opts.level;

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await adminClient.from('profiles').update(updates).eq('id', id);

    if (updateError) {
      // cleanup: si el update falla, borramos el user para no dejar basura
      await adminClient.auth.admin.deleteUser(id);
      throw new Error(`createTestUser falló al actualizar profile: ${updateError.message}`);
    }
  }

  return { id, email, password, tenantSlug: opts.tenantSlug };
}

/** Borra el auth.user. CASCADE en profiles limpia la fila correspondiente. */
export async function deleteTestUser(id: string): Promise<void> {
  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) throw new Error(`deleteTestUser falló: ${error.message}`);
}
