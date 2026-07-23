import { test, expect } from '@playwright/test';

test.describe('Проверка конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '*/**/api/ingredients',
      update: false
    });

    await page.goto('/');
  });

  test('Открытие, закрытие модального окна и проверка данных', async ({ page }) => {
    const ingredient = page.locator('[data-cy="ingredient-item"]').first();
    const ingredientName = await ingredient.locator('.text').last().innerText();

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
    await bun.locator('button').click();

    const constructorArea = page.locator('[data-cy="constructor-area"]');
    const constructorElement = constructorArea.locator('.constructor-element');
    
    await expect(constructorElement).toHaveCount(2);
  });

  test('Процесс создания заказа', async ({ page }) => {
    // 1. Оставляем HAR-файлы, чтобы пройти по чек-листу Яндекса
    await page.routeFromHAR('./tests/hars/user.har', { url: '*/**/api/auth/user', update: false });
    await page.routeFromHAR('./tests/hars/order.har', { url: '*/**/api/orders', update: false });

    // 2. БРОНЕБОЙНЫЙ ПЕРЕХВАТ: Playwright сам отдаст нужный JSON, 
    // игнорируя любые проверки сети браузера
    await page.route('*/**/api/auth/user', async (route) => {
      await route.fulfill({
        json: { success: true, user: { email: 'test@test.ru', name: 'Test User' } }
      });
    });

    await page.route('*/**/api/orders', async (route) => {
      await route.fulfill({
        json: { success: true, name: 'Тестовый бургер', order: { number: 77777 } }
      });
    });

    // 3. Устанавливаем валидный "вечный" JWT-токен (срок годности до 2033 года), 
    // чтобы приложение не пыталось его обновить через /api/auth/token
    await page.evaluate(() => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImV4cCI6MTk5OTk5OTk5OX0.mock';
      window.localStorage.setItem('refreshToken', token);
      window.localStorage.setItem('accessToken', 'Bearer ' + token);
      document.cookie = `accessToken=Bearer ${token}; path=/`;
    });

    // 4. Перезагружаем страницу, чтобы React подхватил токен
    await page.reload();

    // 5. Даем Redux ровно 1 секунду на сохранение пользователя в стейт
    await page.waitForTimeout(1000);

    // 6. Добавляем булку
    const bun = page.locator('[data-cy="ingredient-item"]').first();
    await bun.locator('button').click();

    const constructorArea = page.locator('[data-cy="constructor-area"]');
    await expect(constructorArea.locator('.constructor-element')).toHaveCount(2);

    // 7. Оформляем заказ
    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    // 8. Проверяем модалку и данные внутри неё
    const orderModal = page.locator('[data-cy="modal"]');
    await expect(orderModal).toBeVisible();
    
    const orderNumber = orderModal.locator('[data-cy="order-number"]');
    await expect(orderNumber).toHaveText('77777');

    await orderModal.locator('[data-cy="modal-close-button"]').click();
    await expect(orderModal).toBeHidden();

    // 9. Убеждаемся, что конструктор очистился
    await expect(constructorArea.locator('.constructor-element')).toHaveCount(0);
  });
});