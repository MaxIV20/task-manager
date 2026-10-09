# Frontend style guide

Руководство по архитектуре и правилам разработки Vue 3 SPA.

---

## Структура приложения

```text
src/
├── app/                    # запуск, провайдеры и роутер
├── assets/                 # стили, шрифты, изображения и прочая статика
├── pages/                  # тонкие компоненты маршрутов
├── layouts/                # повторно используемые каркасы страниц
├── widgets/                # крупные законченные блоки интерфейса
├── features/               # самостоятельные действия пользователя
├── entities/               # предметные данные, серверное состояние и доменная логика
├── shared/                 # переиспользуемый код без связи с доменом
└── utils/                  # глобальная техническая инфраструктура
```

Проект использует FSD. Код другого слайса доступен только через его корневой
публичный `index.ts`.

| Слой       | Ответственность                                                                 |
| ---------- | ------------------------------------------------------------------------------- |
| `app`      | Собирает приложение, подключает роутер, провайдеры и глобальную инфраструктуру. |
| `assets`   | Хранит статические ресурсы, используемые сборкой: стили, шрифты и изображения.  |
| `pages`    | Композирует конкретный маршрут без бизнес-логики.                               |
| `layouts`  | Задаёт повторно используемый каркас нескольких страниц.                         |
| `widgets`  | Формирует законченный функциональный блок интерфейса.                           |
| `features` | Реализует самостоятельное намерение пользователя.                               |
| `entities` | Хранит предметные типы, серверное состояние и чистую доменную логику.           |
| `shared`   | Содержит код, не связанный с конкретной предметной областью.                    |
| `utils`    | Содержит глобальную техническую инфраструктуру.                                 |

### Направления импортов

| Кто импортирует | Разрешённые зависимости                                                  |
| --------------- | ------------------------------------------------------------------------ |
| `app`           | `pages`, `layouts`, `widgets`, `features`, `entities`, `shared`, `utils` |
| `pages`         | `layouts`, `widgets`, `features`, `entities`, `shared`, `utils`          |
| `layouts`       | `widgets`, `features`, `entities`, `shared`, `utils`                     |
| `widgets`       | `features`, `entities`, `shared`, `utils`                                |
| `features`      | `entities`, `shared`, `utils`                                            |
| `entities`      | `shared`, `utils`                                                        |
| `shared`        | `utils`                                                                  |
| `utils`         | Не импортирует FSD-слои                                                  |

Импорты вверх по таблице и циклические зависимости запрещены.

---

## Сегменты слайса

Создавайте только необходимые сегменты. Пустые директории не добавляются.

```text
<layer>/<slice>/
├── api/                    # API-функции и Vue Query-хуки, если нужны
├── constants/              # неизменяемые словари и списки
├── model/                  # Vue composables, состояние и ViewModel-логика
├── ui/                     # Vue-компоненты и CSS Modules
├── utils/                  # чистые функции, схемы, мапперы, форматтеры
└── index.ts                # публичный API слайса
```

- `ui` содержит отображение и обработчики, полученные из `model` или
  публичных Vue Query-composables. Запросы, правила доступности и подготовка
  данных выносятся из компонента.
- `utils` содержит чистые функции без реактивного состояния: мапперы,
  форматтеры, схемы валидации и преобразования данных.
- Mapper или formatter, используемый одним слайсом, хранится в `utils` этого
  слайса. Нейтральная переиспользуемая функция живёт в `shared/utils`.
- `constants` содержит неизменяемые данные слайса: словари отображения,
  варианты контролов, breakpoints и статическую конфигурацию. Функции,
  фабрики, query-конфигурации и локальные результаты вычислений не относятся к
  `constants`, даже если объявлены через `const`.
- Каждый непустой сегмент `ui`, `model`, `utils` и `constants` содержит свой
  `index.ts` для импортов между сегментами одного слайса.

### `model` — состояние и ViewModel-логика

`model` отвечает за состояние и поведение одного слайса, не зависящие от его
разметки. Реактивную логику во Vue оформляйте composable-файлами с именем,
начинающимся с `use`, например `use-resource-view-model.ts`. В `model` также
допустимы предметные классы и value objects, если они инкапсулируют данные и
правила работы с ними.

В `model` хранятся реактивное состояние слайса и связанная с ним логика. В нём
нет Vue-компонентов, CSS и прямых API-вызовов.

ViewModel — паттерн MVVM. Такой composable служит адаптером
между данными и Vue-представлением: объединяет
данные из API или store, преобразует их для экрана и отдаёт UI-состояние и
обработчики. В этом случае используйте имя `use<Something>ViewModel`.

Если composable делает одно понятное действие, MVVM не вводится: используйте
обычное имя `use<Something>`, например `useSearch`, `useModal` или `useTheme`.
Query hooks и Pinia stores сохраняют специальные суффиксы: `useTasksQuery` и
`useUserStore`.

### Pinia stores

Для общего реактивного состояния используйте Pinia. Экземпляр Pinia создаётся
и подключается один раз в `src/app/main.ts`; повторно создавать `createPinia()`
в слайсах нельзя.

- Store хранится в `model` слайса-владельца: например,
  `entities/user/model/use-user-store.ts`,
  `features/change-language/model/use-language-store.ts` или
  `shared/modal/model/use-modal-store.ts`.
- Не создавайте глобальную папку `src/stores/`: она стирает границы владения
  состоянием.
- Используйте setup stores: `defineStore('store-id', () => { ... })`.
  Идентификатор store стабилен и именует состояние, а файл называется
  `use-<slice>-store.ts`.
- Store нужен, только если реактивное состояние и действия разделяются между
  несколькими компонентами или слайсами. Состояние одного компонента остаётся
  в его composable или SFC.

---

## Pages, маршруты и layouts

Page — верхнеуровневая композиция маршрута без запросов, mutation, валидации
или сложной разметки.

Статические маршруты объявляются централизованно в `src/app/router`.
Динамические маршруты регистрирует код слайса-владельца при необходимости.
Статические URL-сегменты используют `kebab-case`, а имена параметров маршрута
— `camelCase`.

Layout независим от маршрута. Он содержит общую навигацию, отступы или
визуальную структуру и принимает контент через `<slot />`. Layout может
компоновать публичные widgets и features: например, `Sidebar`, `AppHeader` или
кнопку авторизации. Бизнес-логика и внутренняя реализация этих слайсов в layout
не переносятся.

---

## Widgets, features и entities

Выбирайте слой по ответственности, а не по числу компонентов.

### Features — действия пользователя

Feature отвечает на вопрос: «что пользователь может сделать?». Она содержит
валидацию, правила доступности, локальное состояние и действия, необходимые
для одного самостоятельного намерения.

Примеры features:

- `features/search` — строка поиска, debounce, синхронизация с URL и т.п.
- `features/filter-content` — выбор фильтров, их локальное состояние и
  преобразование параметров для списка.
- `features/switch-theme` — переключение темы и сохранение выбранного режима.
- `features/change-language` — выбор языка и применение локали.

```text
features/search/
├── model/                  # useSearch: query, debounce и действия пользователя
├── ui/                     # SearchInput.vue
└── index.ts                # export { SearchInput } from './ui'
```

Не выносите в feature простой компонент, который только отображает данные и
не выражает самостоятельное действие пользователя. `NavigationItem.vue`
остаётся частью sidebar, если не используется в нескольких независимых местах.
При повторном использовании нейтральный компонент переезжает в `shared/ui`;
feature нужен только для отдельного пользовательского намерения, а не из-за
наличия логики.

### Widgets — законченные блоки интерфейса

Widget отвечает на вопрос: «какой функциональный блок пользователь видит на
экране?». Он может объединять features, entities, состояния загрузки и
несколько собственных UI-компонентов, но не создаёт новое бизнес-действие.

Компоненты, нужные только одному widget для его отображения, остаются внутри
этого widget и не становятся отдельными features.

Примеры widgets:

- `widgets/sidebar` — логотип, навигация, пользовательское меню и кнопка
  сворачивания; это законченная часть интерфейса, а не отдельное действие.
- `widgets/app-header` — глобальная навигация, поиск, действия пользователя и
  адаптивное меню.
- `widgets/content-list` — заголовок, фильтры, загрузка, пустое состояние и
  список данных; он использует feature `filter-content`.

```text
widgets/sidebar/
├── model/                  # useSidebarViewModel: открытие и состояние sidebar
├── ui/
│   ├── Sidebar.vue         # корневой компонент виджета
│   ├── NavigationItem.vue  # приватный компонент пункта навигации
│   └── index.ts
└── index.ts                # export { Sidebar } from './ui'
```

Widget может собирать features, но не копирует их внутреннюю логику. Например,
`app-header` рендерит публичный `SearchInput` из `features/search`, а не
реализует поиск повторно.

### Entities — данные и доменная логика

Entity содержит предметные типы, API-функции, Vue Query-хуки и чистую логику,
которая не зависит от экранной компоновки.

---

## Типы

Типы хранятся рядом с кодом, для которого они нужны, и группируются по
назначению, а не в общем сегменте `types/`.

```text
entities/resource/
├── model/
│   ├── resource.types.ts          # предметные типы и состояние слайса
│   └── use-resource-view-model.ts
└── ui/
    └── ResourceCard.vue           # props одного компонента — в SFC
```

- Выносите типы в отдельный файл с суффиксом `.types.ts`, только если они
  нужны нескольким модулям или исходный файл с логикой становится перегруженным.
- Props одного Vue-компонента описывайте в `<script setup lang="ts">`.
- Предметные типы, состояние и типы ViewModel слайса размещайте в
  `model/*.types.ts`.
- Общие типы для всего приложения размещайте в `shared` по назначению:
  транспортные — в `shared/api`, конфигурационные — в `shared/config`, типы
  общих UI-компонентов — рядом с ними в `shared/ui`.
- Используйте `type` для всех типов: DTO, props, карт endpoint-ов, alias,
  union, tuple, mapped/conditional и производных типов.
- Не создавайте `src/types/` или `shared/types/` как хранилище несвязанных
  типов.

---

## Именование

| Что                              | Стиль                           | Пример                           |
| -------------------------------- | ------------------------------- | -------------------------------- |
| Папки и utils                    | `kebab-case`                    | `use-resource.ts`                |
| Composables                      | `use` + PascalCase              | `useResource`                    |
| Vue-компоненты                   | PascalCase с расширением `.vue` | `ResourceList.vue`               |
| Экспортируемые компоненты и типы | PascalCase                      | `ResourceList`, `ResourceSearch` |
| Константы                        | UPPER_SNAKE_CASE                | `SCOPE`, `STATUS_OPTIONS`        |

---

## Barrel-экспорты (`index.ts`)

`index.ts` — публичный контракт директории. Он экспортирует только то, что
нужно её потребителям; внутренние компоненты, composables, utils и API-функции
не раскрываются автоматически.

- Корневой `index.ts` слайса — единственная точка импорта для других слайсов.
- `index.ts` сегмента (`ui`, `model`, `utils`, `constants`) собирает выбранный
  API для остальных сегментов того же слайса.
- Используйте `export *`, когда все exports модуля входят в публичный API.
  Если среди них есть внутренние детали, экспортируйте нужные значения и типы
  по имени.

---

## API и Vue Query

### Общая инфраструктура

`utils/api/api-client` — глобальный API-клиент приложения. Используйте
экспортируемый `api` с одним из методов `get`, `post`, `put`, `patch`,
`delete`.

```text
utils/api/
├── index.ts              # публичный экспорт инфраструктуры API
├── api-client/
│   ├── client.ts         # api, getApiBaseUrl, normalizeError
│   ├── schema.ts         # ApiEndpoint и вспомогательные типы
│   ├── types.ts          # ApiError, RequestOptions, QueryParamValue
│   └── index.ts
└── vue-query/
    ├── query-client.ts   # единственный QueryClient приложения
    ├── query-keys.ts     # Key.for и Key.scope
    └── index.ts
```

Глобальный API-клиент собирает запрос из пути, query-параметров, заголовков,
JSON-body и `AbortSignal`, безопасно читает ответ и приводит ошибки к единой
форме.

### Контракт endpoint

`ApiEndpoint` — единственный источник правды для HTTP-метода, пути, тела
запроса и ответа.

```ts
import type { ApiEndpoint } from '@/utils/api';

type CreateTaskEndpoint = ApiEndpoint<
  'POST',
  '/tasks',
  { id: string; title: string },
  { title: string }
>;
```

Каждый срез с API хранит свои контракты в
`<layer>/<slice>/api/shared/schema.ts`. Типы, нужные за пределами API-слоя,
остаются доменными: размещайте их в `model/*.types.ts` или рядом с сущностью;
не импортируйте API-схему напрямую в `ui`, `widgets` или `pages`.

```ts
// entities/task/api/shared/schema.ts
import type { ApiEndpoint } from '@/utils/api';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Endpoints = {
  list: ApiEndpoint<'GET', '/tasks', Task[]>;
  create: ApiEndpoint<'POST', '/tasks', Task, { title: string }>;
};
```

`schema.ts` реэкспортируется из `api/shared/index.ts`, а затем — из
`api/index.ts`, если этот контракт действительно нужен другим сегментам
текущего среза. За пределы среза выходит только его корневой `index.ts`.

### Endpoint-функции

Каждый файл в `api/endpoints/` соответствует одному HTTP-запросу. В нём есть
стабильный `name` для query key, `path`, типы `Data` и, при необходимости,
`Payload`, а также одна функция вызова.

- Функция чтения начинается с `get`: `getTasks`, `getTaskById`.
- Изменяющая функция описывает действие: `createTask`, `updateTask`,
  `deleteTask`.
- Путь проверяется через `satisfies Endpoint['path']`; типы результата и
  payload выводятся из endpoint-контракта.
- Endpoint-файлы приватны для API-сегмента: не добавляйте к ним общий
  `index.ts` и не импортируйте их из UI.

```ts
// entities/task/api/endpoints/get-tasks.ts
import { api, type RequestOptions } from '@/utils/api';
import type { Endpoints } from '../shared';

type Endpoint = Endpoints['list'];

export const name = 'list';
export const path = '/tasks' satisfies Endpoint['path'];
export type Data = Endpoint['response'];

export function getTasks(options?: RequestOptions): Promise<Data> {
  return api.get<Endpoint>(path, options);
}
```

```ts
// entities/task/api/endpoints/create-task.ts
import { api } from '@/utils/api';
import type { Endpoints } from '../shared';

type Endpoint = Endpoints['create'];

export const name = 'create';
export const path = '/tasks' satisfies Endpoint['path'];
export type Data = Endpoint['response'];
export type Payload = Endpoint['body'];

export function createTask(payload: Payload): Promise<Data> {
  return api.post<Endpoint>(path, { body: payload });
}
```

### Vue Query

Каждый файл в `api/vue-query/` содержит один `useQuery` или `useMutation`
hook.

Компоненты, widgets и features используют только эти hooks, а не endpoint-функции напрямую.

У каждого среза есть константа `SCOPE` в `api/shared/index.ts`, например
`'entity:task'`.

Query key начинается с этого scope и завершается именем endpoint; параметры добавляются отдельными элементами массива. Ключи должны быть детерминированными, чтобы инвалидация затрагивала ровно нужные данные.

Создавайте их через `Key` из `@/utils/api`: `Key.for` формирует ключ endpoint-а и принимает реактивные параметры, а `Key.scope` создаёт ключ всего среза для осознанной полной инвалидации.

Не объявляйте query keys прямыми массивами: для каждого endpoint-запроса и точечной инвалидации используйте `Key.for`.

```ts
// entities/task/api/vue-query/use-tasks-query.ts
import { useQuery } from '@tanstack/vue-query';
import { Key } from '@/utils/api';
import { getTasks, name } from '../endpoints/get-tasks';
import { SCOPE } from '../shared';

export function useTasksQuery() {
  return useQuery({
    queryKey: Key.for(SCOPE, name),
    queryFn: () => getTasks(),
  });
}
```

Для параметризованного запроса ключ включает реактивный параметр, а запрос включается через `enabled` только когда параметр валиден.

Для mutation инвалидируйте конкретный ключ списка или детали, а не весь кэш и не все ключи среза без причины.

```ts
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Key } from '@/utils/api';
import { createTask } from '../endpoints/create-task';
import { SCOPE } from '../shared';

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  const listQueryKey = Key.for(SCOPE, 'list');

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: listQueryKey }),
  });
}
```

---
