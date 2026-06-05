import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const authFile = path.join(__dirname, '../.auth/user.json');

setup('autenticarse en Colppy', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.COLPPY_EMAIL!,
    process.env.COLPPY_PASSWORD!,
  );
  await loginPage.isLoggedIn();

  await page.context().storageState({ path: authFile });
  console.log('✅ Sesión guardada en', authFile);
});
