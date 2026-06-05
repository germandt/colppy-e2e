import { test as base, expect, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

// Fixture worker-scoped: login una sola vez por worker y comparte el contexto de sesión
const test = base.extend<object, { loggedInContext: BrowserContext }>({
  loggedInContext: [async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.COLPPY_EMAIL!, process.env.COLPPY_PASSWORD!);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.close();
    await use(context);
    await context.close();
  }, { scope: 'worker' }],

  page: async ({ loggedInContext }, use) => {
    const page = await loggedInContext.newPage();
    await use(page);
    await page.close();
  },
});

async function goToClientes(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Esperar a que el sidebar esté listo antes de navegar
  await expect(page.getByRole('button', { name: /^clientes$/i })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: /^clientes$/i }).click();
  await expect(page.getByText('Lista de clientes')).toBeVisible({ timeout: 15000 });
}

test.describe('Flujo de Clientes', () => {
  test('puede navegar a la sección de clientes', async ({ page }) => {
    await goToClientes(page);
    await expect(page.getByRole('heading', { name: /clientes/i }).first()).toBeVisible();
  });

  test('lista de clientes se carga correctamente', async ({ page }) => {
    await goToClientes(page);
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 });
  });

  test('puede buscar un cliente', async ({ page }) => {
    await goToClientes(page);
    await page.locator('label:has-text("Buscar cliente") + input, input[placeholder*="buscar" i], div:has(> label:has-text("Buscar")) input').first().fill('test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(page.getByText('Lista de clientes')).toBeVisible();
  });

  test('puede crear un nuevo cliente', async ({ page }) => {
    await goToClientes(page);
    await page.getByRole('button', { name: /nuevo cliente/i }).click();
    await page.waitForTimeout(1000);
    const formulario = page.locator('form').or(page.locator('[role="dialog"], .modal'));
    await expect(formulario.first()).toBeVisible({ timeout: 8000 });
  });

  test('puede ver el detalle de un cliente', async ({ page }) => {
    await goToClientes(page);
    await page.getByText('Consumidor Final').first().click();
    await expect(page.getByText('Seleccionar cliente de la lista')).toBeHidden({ timeout: 8000 });
  });
});
