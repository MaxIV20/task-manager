# Vue 3 Starter

Базовый проект для Vue 3-приложений на TypeScript с Vue Router, Pinia, TanStack Vue Query и архитектурой FSD.

Подробные правила разработки находятся в [руководстве по стилю](style-guide.md).

## Установка и запуск

Нужна актуальная LTS-версия Node.js и npm.

```bash
npm install
npm run dev
```

После запуска Vite выведет адрес локального сервера. Для production-сборки и её просмотра используйте:

```bash
npm run build
npm run preview
```

## Команды

| Команда                | Назначение                                           |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Запускает сервер разработки Vite.                    |
| `npm run build`        | Проверяет типы и создаёт production-сборку.          |
| `npm run preview`      | Отдаёт собранный проект локально для проверки.       |
| `npm run check-types`  | Проверяет TypeScript и Vue SFC без генерации файлов. |
| `npm run lint`         | Проверяет исходный код ESLint.                       |
| `npm run format`       | Форматирует проект с помощью Prettier.               |
| `npm run format:check` | Проверяет форматирование без изменения файлов.       |
