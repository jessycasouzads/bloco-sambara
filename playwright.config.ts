import { defineConfig, devices } from '@playwright/test';

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  // Cada test es independiente — paralelizamos por archivo
  fullyParallel: true,
  // En CI no permitimos tests con .only — bloqueamos PRs
  forbidOnly: !!process.env.CI,
  // Reintenta una vez en CI por flaky network
  retries: process.env.CI ? 1 : 0,
  // En CI un worker para evitar conflictos contra el dev server
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: BASE_URL,
    // Captura screenshot solo cuando falla
    screenshot: 'only-on-failure',
    // Captura el video solo cuando falla
    video: 'retain-on-failure',
    // Captura trace para debug en CI
    trace: 'on-first-retry',
  },

  projects: [
    // Mobile-first: probamos primero en mobile viewport
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
    // Desktop para verificar que el sidebar/responsive funciona
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Levanta el dev server antes de correr los tests
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
