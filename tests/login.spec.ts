import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Login', () => {
  test('muestra la pantalla de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('rechaza credenciales incorrectas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpassword');

    const error = page.getByText(/inválido|incorrect|error|invalid/i)
      .or(page.locator('.error, .alert-danger, [role="alert"]'));
    await expect(error.first()).toBeVisible({ timeout: 8000 });
  });

  test('login exitoso con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.COLPPY_EMAIL!,
      process.env.COLPPY_PASSWORD!,
    );
    await loginPage.isLoggedIn();
    await expect(page).not.toHaveURL(/login/i);
  });
});
