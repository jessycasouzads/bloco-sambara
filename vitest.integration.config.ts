import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Integration tests corren en Node, no en JSDOM (no hay DOM, son llamadas a Supabase)
    environment: 'node',
    globals: true,
    include: ['tests/integration/**/*.test.ts'],
    setupFiles: ['./tests/integration/setup.ts'],

    // Network calls — más generoso que los unit tests
    testTimeout: 30_000,
    hookTimeout: 30_000,

    // Tests serializados para evitar conflictos de rate limit / quotas en Supabase free
    fileParallelism: false,
    pool: 'forks',
  },
});
