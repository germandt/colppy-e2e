import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.getByPlaceholder(/correo/i).fill(email);
    await this.page.getByPlaceholder(/contrase/i).fill(password);
    await this.page.getByRole('button', { name: /ingresar/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn() {
    await expect(this.page).not.toHaveURL(/login/i);
  }
}
