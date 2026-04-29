import { randomUUID } from 'node:crypto';
import { adminClient } from './client';

export interface TestTenant {
  id: string;
  slug: string;
  name: string;
}

/**
 * Crea un tenant ficticio con slug único. Cleanup vía deleteTestTenant
 * (cascade borra profiles y demás dependientes).
 */
export async function createTestTenant(label = 'integration'): Promise<TestTenant> {
  const slug = `test_${label}_${randomUUID().slice(0, 8)}`;
  const name = `Test Tenant ${slug}`;

  const { data, error } = await adminClient
    .from('tenants')
    .insert({ slug, name })
    .select('id, slug, name')
    .single();

  if (error || !data) {
    throw new Error(`createTestTenant falló: ${error?.message ?? 'sin data'}`);
  }
  return data as TestTenant;
}

/**
 * Borra el tenant. CASCADE limpia profiles y demás FKs.
 * Los auth.users hay que borrarlos aparte (los profiles tienen FK a auth.users con cascade
 * pero el tenant no es FK directa de auth.users).
 */
export async function deleteTestTenant(id: string): Promise<void> {
  const { error } = await adminClient.from('tenants').delete().eq('id', id);
  if (error) throw new Error(`deleteTestTenant falló: ${error.message}`);
}
