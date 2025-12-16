import { test, expect } from '@playwright/test';

test.describe('RSS агрегатор - тесты валидации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Базовый тест - проверка элементов на странице', async ({ page }) => {
    await expect(page.locator('h1:has-text("RSS агрегатор")')).toBeVisible();
    await expect(page.locator('#url-input')).toBeVisible();
    await expect(page.locator('button:has-text("Добавить")')).toBeVisible();
    await expect(page.locator('text=Пример: https://lorem-rss.hexlet.app/feed')).toBeVisible();
  });

  test('Ошибка: пустое поле', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Отключаем HTML5 валидацию
    await page.evaluate(() => {
      document.querySelector('form').setAttribute('novalidate', '');
    });

    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    await button.click();
    await expect(feedback).toHaveText('Не должно быть пустым');
  });

  test('Ошибка: невалидный URL', async ({ page }) => {
    const input = page.locator('#url-input');
    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    await input.fill('неправильный-url');
    await button.click();

    // Ждем появления ошибки
    await expect(feedback).toHaveText('Ссылка должна быть валидным URL');
  });

  test('Успешное добавление RSS', async ({ page }) => {
    const input = page.locator('#url-input');
    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    await input.fill('https://lorem-rss.hexlet.app/feed');
    await button.click();

    // Ждем успешного сообщения
    await expect(feedback).toHaveText('RSS успешно загружен');
  });

  test('Ошибка: дубликат RSS', async ({ page }) => {
    const input = page.locator('#url-input');
    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    // Первое добавление
    await input.fill('https://lorem-rss.hexlet.app/feed');
    await button.click();
    await expect(feedback).toHaveText('RSS успешно загружен');

    // Ждем немного перед вторым добавлением
    await page.waitForTimeout(1000);

    // Второе добавление того же URL
    await input.fill('https://lorem-rss.hexlet.app/feed');
    await button.click();

    await expect(feedback).toHaveText('RSS уже существует');
  });

  test('Ошибка: невалидный RSS (сайт без RSS)', async ({ page }) => {
    const input = page.locator('#url-input');
    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    await input.fill('https://google.com');
    await button.click();

    await expect(feedback).toHaveText('Ресурс не содержит валидный RSS');
  });
});
