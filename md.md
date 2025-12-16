package.json:
{
  "name": "@hexlet/code",
  "version": "1.0.0",
  "description": "RSS agregator",
  "homepage": "https://github.com/dgapchenko4/frontend-project-11#readme",
  "bugs": {
    "url": "https://github.com/dgapchenko4/frontend-project-11/issues"
  },
  "repository": {
    "type": "module",
    "url": "git+https://github.com/dgapchenko4/frontend-project-11.git"
  },
  "license": "ISC",
  "author": "Dmitry Gapchenko",
  "type": "module",
  "main": "src/index.js",
  "dependencies": {
    "@popperjs/core": "^2.11.8",
    "ajv": "^8.17.1",
    "axios": "^1.8.1",
    "bootstrap": "^5.3.3",
    "i18next": "^24.2.2",
    "lodash": "^4.17.21",
    "on-change": "^5.0.1",
    "yup": "^1.6.1"
  },
  "devDependencies": {
    "@babel/core": "^7.26.10",
    "@babel/preset-env": "^7.26.9",
    "babel-loader": "^10.0.0",
    "css-loader": "^7.1.2",
    "eslint": "^8.57.1",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.31.0",
    "html-webpack-plugin": "^5.6.3",
    "postcss-loader": "^8.1.1",
    "sass": "^1.86.0",
    "sass-loader": "^16.0.5",
    "style-loader": "^4.0.0",
    "webpack": "5.98.0",
    "webpack-cli": "6.0.1",
    "webpack-dev-server": "5.2.0"
  }
}


import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                // Игнорировать предупреждения
                quietDeps: true,
              },
            },
          },
        ],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: 'asset/resource', // Используем встроенный asset/resource вместо url-loader
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        type: 'asset/resource', // Используем встроенный asset/resource вместо file-loader
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // Убедитесь, что файл index.html существует
    }),
  ],
  output: {
    clean: true,
  },
  devServer: {
    static: './dist', // Указываем директорию для статических файлов
    open: true,
  },
};


@use "bootstrap" as *;

.text-muted {
    color: #6c757d !important;
}


import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');

  // Просто проверяем что основные элементы есть на странице
  await expect(page.locator('h1:has-text("RSS агрегатор")')).toBeVisible();
  await expect(page.locator('#url-input')).toBeVisible();
  await expect(page.locator('button:has-text("Добавить")')).toBeVisible();
  await expect(page.locator('text=Пример: https://lorem-rss.hexlet.app/feed')).toBeVisible();
});


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
    const input = page.locator('#url-input');
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

    await expect(feedback).toHaveText('Ссылка должна быть валидным URL');
  });

  test('Успешное добавление RSS', async ({ page }) => {
    const input = page.locator('#url-input');
    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    await input.fill('https://lorem-rss.hexlet.app/feed');
    await button.click();

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


"dev": "webpack --mode development",
  test('Ошибка: невалидный RSS (сайт без RSS)', async ({ page }) => {
    const input = page.locator('#url-input');
    const button = page.locator('button:has-text("Добавить")');
    const feedback = page.locator('.feedback');

    await input.fill('https://google.com');
    await button.click();

    await expect(feedback).toHaveText('Ресурс не содержит валидный RSS');
  });