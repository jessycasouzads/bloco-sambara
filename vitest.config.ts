import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // globals: true es requerido por Vitest 4 para que el setup file pueda
      // registrar afterEach. En tests preferimos imports explícitos igual.
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/App.tsx',
          'src/types/**',
          'src/test/**',
          'src/**/*.test.{ts,tsx}',
          'src/vite-env.d.ts',
        ],
      },
    },
  }),
);
