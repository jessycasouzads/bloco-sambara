import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
  test('renders title, form fields and submit button', async ({ page }) => {
    await page.goto('/login');

    // Marca visible
    await expect(page.getByRole('heading', { name: /Bloco Sambará/i })).toBeVisible();

    // Inputs accesibles por su label
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();

    // CTA principal
    await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
  });

  test('redirects unauthenticated users to /login when visiting protected routes', async ({
    page,
  }) => {
    await page.goto('/alumnos');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('shows error feedback when submitting wrong credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('noexisto@example.com');
    await page.getByLabel('Contraseña').fill('contraseña-mala');
    await page.getByRole('button', { name: /Entrar/i }).click();

    // Supabase responde con un error que se renderiza en role="alert"
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 });
  });
});
