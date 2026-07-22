import { test, expect } from '@playwright/test';

test.describe('Проверка конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '*/**/api/ingredients',
      update: false
    });

    await page.goto('/');
  });

  test('Открытие, закрытие модального окна и проверка данных', async ({
    page
  }) => {
    const ingredient = page.locator('[data-cy="ingredient-item"]').first();
    const ingredientName = await ingredient.locator('.text').innerText(); //

    await ingredient.click();

    const modal = page.locator('[data-cy="modal"]');
    await expect(modal).toBeVisible();

    const modalTitle = modal.locator('[data-cy="ingredient-details-name"]');
    await expect(modalTitle).toHaveText(ingredientName);

    const closeButton = page.locator('[data-cy="modal-close-button"]');
    await closeButton.click();

    await expect(modal).toBeHidden();
  });

  test('Добавление ингредиента в конструктор', async ({ page }) => {
    const bun = page.locator('[data-cy="ingredient-item"]').first();

    const constructorArea = page.locator('[data-cy="constructor-area"]');

    await bun.click();

    const constructorElement = constructorArea.locator('.constructor-element'); //
    await expect(constructorElement).toHaveCount(2);
  });

  test('Процесс создания заказа', async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
      document.cookie = 'accessToken=Bearer mock-access-token; path=/';
    });

    await page.route('*/**/api/orders', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          name: 'Тестовый бургер',
          order: { number: 77777 }
        }
      });
    });

    await page.locator('[data-cy="ingredient-item"]').first().click();

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    const modal = page.locator('[data-cy="modal"]');
    await expect(modal).toBeVisible();
    const orderNumber = modal.locator('[data-cy="order-number"]');
    await expect(orderNumber).toHaveText('77777');

    await modal.locator('[data-cy="modal-close-button"]').click();
    await expect(modal).toBeHidden();

    const constructorArea = page.locator('[data-cy="constructor-area"]');
    await expect(constructorArea.locator('.constructor-element')).toHaveCount(
      0
    );
  });
});
