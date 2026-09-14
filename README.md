# LandSight Frontend

Веб-приложение для анализа земельных участков: пользователь рисует/выбирает полигон на карте, задаёт имя, запускает анализ и отслеживает статус.

## Стек

- **React 19** — только как слой рендеринга (без Redux и без хуков для состояния приложения).
- **Reatom v1001** (`@reatom/core`, `@reatom/react`) — состояние, вычисляемые значения, сайд-эффекты, роутинг. Это основной «мозг» приложения.
- **TypeScript** — статическая типизация.
- **Vite 7** — сборка и dev-сервер с проксированием `/api` на бэкенд (`localhost:8000`).
- **Material-UI (MUI) 7** — UI-компоненты, иконки, тема.
- **Leaflet + react-leaflet + leaflet-draw** — карта и рисование полигонов.
- **axios** — HTTP-клиент (`baseURL: /api/v1`, Bearer-токен + авто-refresh).
- **SASS/SCSS** + BEM (`@bem-react/classname`) — стили.

## Почему Reatom

Reatom — реактивный стейт-менеджер, который в этом проекте заменяет и Redux, и data-fetching-слой, и форму-менеджер. Что это даёт:

- **Атомарность состояния.** `atom` — минимальная единица; из неё `computed` строят производные значения, а `action` — единственный способ менять состояние.
- **Вычисляемая валидация.** Правила — это `computed`-атомы (`isUsernameValidAtom`, `isAnalysisNameValidAtom`, `analysisNameErrorAtom`), а не логика внутри компонентов. UI просто читает готовый результат.
- **Асинхронность из коробки.** `withAsyncData`/`withAsync` дают статус (`isPending`, `ready`), а `parseError` централизованно превращает ошибки API в уведомления (`getApiErrorMessage`) — компоненты этим не занимаются.
- **Тонкие компоненты.** `reatomComponent` подписывается на нужные атомы, `reatomFactoryComponent` используется там, где нужны эффекты; действия вызываются через `wrap`. Никаких `useAtom`/`useAction`/`useSelector`/`useDispatch` в фичах.
- **Роутинг как часть стейта.** `reatomRoute` связывает URL, лейауты и гарды (например, редирект неавторизованных) с тем же реактивным графом.
- **Предсказуемость и тестируемость.** Граф атомов описывает поведение декларативно, а действия можно вызывать вне React.

## Архитектура

Разделение по функциональным модулям (feature-sliced):

```
src/
├── app/                     # Ядро приложения
│   ├── routes/              # Reatom-роуты (routes.tsx) и конфиг меню
│   ├── layouts/             # AuthLayout, MainLayout, Sidebar
│   ├── App.tsx              # Корневой компонент + restoreSession
│   └── theme.ts             # Тема MUI
├── features/
│   ├── auth/                # api, components, models (auth, authForm)
│   ├── map/                 # components (MapView, DrawingControls, ...), models (drawing, layer)
│   ├── parcels/             # api, components, models
│   └── analyses/            # api, components (table, filters, dialog/form), models
├── pages/                   # LoginPage, RegisterPage, MapPage, AnalysesPage
├── shared/
│   ├── api/                 # axios-клиент, работа с токеном, разбор ошибок
│   ├── lib/bem.ts           # cn() для BEM
│   ├── styles/              # переменные и глобальные стили
│   ├── types/               # общие типы (parcel, geometry)
│   └── ui/notification/     # стек уведомлений (Reatom)
└── main.tsx
```

Псевдонимы импорта: `#/` и `@/` → `src/`.

### Модели (Reatom)

Модели лежат в `features/*/models` и содержат `atom`/`computed`/`action`. Компоненты в `features/*/components` — только представление: читают атомы и вызывают действия.

## Маршрутизация

Реализована на `reatomRoute` (`src/app/routes`):

- `/login`, `/register` — публичные (под `AuthLayout`), при активной сессии редиректят на карту.
- `/map`, `/analyses` — защищённые (под `MainLayout`); при отсутствии пользователя редиректят на `/login`.
- Меню сайдбара строится из `routesConfig`.

## Работа с API

- `shared/api/client.ts` — единый `axios`-инстанс (`baseURL: /api/v1`), добавляет `Authorization: Bearer <token>` и при `401` один раз пробует `POST /identity/auth/refresh`.
- Ошибки API возвращаются в виде `{ "detail": "...", "errors": [ { "key": "...", "message": "..." } ] }`. Разбор — в `shared/api/errors.ts` (`getApiErrorMessage`), вызывается из `parseError` действий, а не из компонентов.
- Список анализов обновляется **polling'ом** (каждые 3 c, пока есть `pending`/`running`); WebSocket/SSE пока не подключены.

## Карта

`MapView` на `react-leaflet`; рисование полигонов — `leaflet-draw`. Состояние рисования и выбранные слои хранятся в Reatom-моделях (`features/map/models`).

## Запуск

Требования: Node.js 18+ и pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:5173, /api проксируется на http://localhost:8000
```

Сборка и просмотр:

```bash
pnpm build
pnpm preview
```

## Скрипты

| Скрипт         | Назначение                             |
| -------------- | -------------------------------------- |
| `dev`          | dev-сервер Vite                        |
| `build`        | сборка (`tsc -b` + `vite build`)       |
| `preview`      | просмотр собранной версии              |
| `type-check`   | проверка типов (`tsc --noEmit`)        |
| `lint`         | ESLint (`--max-warnings 0`)            |
| `lint:fix`     | автоисправление ESLint                 |
| `format`       | Prettier (запись)                      |
| `format:check` | Prettier (проверка)                    |
| `check`        | `type-check` + `lint` + `format:check` |

## Качество кода

ESLint + Prettier, сортировка импортов (`simple-import-sort`), Husky + `lint-staged` (перед коммитом `eslint --fix` и `prettier --write` для изменённых файлов). Коммиты — по Conventional Commits.

Тесты пока не настроены.

## Дальнейшее развитие

- Реалтайм-обновление статусов анализа (SSE/WebSocket вместо polling).
- Просмотр метрик/отчёта по анализу.
- Оптимизация: lazy-loading страниц, мемоизация карты.
