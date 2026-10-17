---
title: Management API
feature_ids:
  - plugin.management-api.register-management
  - plugin.management-handler.handle-management
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Management API

На этой странице два публичных интерфейса, уже назначенных сюда: `ManagementAPI` регистрирует маршруты, а `ManagementHandler` обрабатывает попавший запрос.

## 1. Какую задачу решает этот раздел

Под префиксом, который дал хост, плагин объявляет точные маршруты управления и маршруты браузерных ресурсов и при поступлении запроса возвращает код состояния, заголовки и тело.

## 2. Когда применимо и чего здесь нет

Собственный API управления хоста он не реализует. `BasePath` в запросе регистрации — единственный префикс, под которым плагин может повесить маршруты управления. Значение — `/v0/management`. `ResourceBasePath` — это `/v0/resource/plugins/` плюс ID плагина.

Маршруты ресурсов не проходят аутентификацию управления. Объявление управления GET с непустым `Menu` одновременно не регистрирует конечную точку управления. Оно регистрируется только как маршрут ресурса.

## 3. Как настроить или вызвать

Задайте `capabilities.management_api` равным true.

```go
RegisterManagement(context.Context, ManagementRegistrationRequest) (ManagementRegistrationResponse, error)
HandleManagement(context.Context, ManagementRequest) (ManagementResponse, error)
```

Имена методов ABI — `management.register` и `management.handle`. `Handler` каждого `ManagementRoute` и `ResourceRoute` реализует второй интерфейс.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.management-api.register-management | `RegisterManagement`, ABI `management.register`. |  | Параметр `ManagementRegistrationRequest`. |
| plugin.management-handler.handle-management | `HandleManagement`, ABI `management.handle`. |  | Параметр `ManagementRequest`, возврат `ManagementResponse`. |
| ManagementRegistrationRequest.Plugin | Метаданные плагина. |  | `Metadata`. |
| ManagementRegistrationRequest.BasePath | Префикс маршрутов управления. |  | Фиксирован как `/v0/management`. |
| ManagementRegistrationRequest.ResourceBasePath | Префикс ресурсов. |  | `/v0/resource/plugins/<pluginID>`. |
| ManagementRegistrationResponse.Routes | Точные маршруты управления, которые нужно открыть. |  | `[]ManagementRoute`. |
| ManagementRegistrationResponse.Resources | Браузерные ресурсы. |  | Вешаются под префиксом ресурсов. |
| ManagementRoute.Method | Метод HTTP. |  | Пустое значение считается GET. Пробел делает весь маршрут недействительным. |
| ManagementRoute.Path | Точный путь. |  | Относительному пути добавляется `/`, затем он вешается под `/v0/management`. У пути, который уже имеет этот префикс, префикс сначала снимается, затем путь вешается снова. |
| ManagementRoute.Menu | Заголовок меню ресурса старого вида. |  | Если метод GET и значение непустое, конечная точка `/v0/management` не регистрируется. Регистрация идёт только как маршрут ресурса. |
| ManagementRoute.Description | Описание меню старого вида. |  | Строка. |
| ManagementRoute.Handler | Объект, обрабатывающий этот маршрут. |  | Не может быть пустым, иначе маршрут недействителен. |
| ResourceRoute.Path | Точный путь ресурса. |  | Вешается под префиксом ресурсов этого плагина. |
| ResourceRoute.Menu | Заголовок меню интерфейса управления. |  | Запрос ресурса — GET. |
| ResourceRoute.Description | Описание интерфейса. |  | Строка. |
| ResourceRoute.Handler | Объект обработки ресурса. |  | Не может быть пустым. Запрос ресурса не несёт аутентификацию управления. |
| ManagementRequest.Method | Фактический метод HTTP. |  | Строка. |
| ManagementRequest.Path | Путь запроса. |  | Строка. |
| ManagementRequest.Headers | Заголовки запроса. |  | `http.Header`. |
| ManagementRequest.Query | Параметры запроса. |  | `url.Values`. |
| ManagementRequest.Body | Исходное тело. |  | `[]byte`. GET ресурса тело не использует. |
| ManagementResponse.StatusCode | Код состояния HTTP. |  | 0 считается 200. |
| ManagementResponse.Headers | Заголовки ответа. |  | `http.Header`. |
| ManagementResponse.Body | Исходное тело ответа. |  | Строка JSON при контракте 6 и выше не экранируется как HTML. Ниже 6 экранирование остаётся. Текущая версия — 6. |

## 5. Типичные ошибки и границы

Когда функция обработки возвращает `error`, запрос управления получает HTTP 502, а тело — `plugin management handler failed`. Запрос ресурса тоже 502, тело — `plugin resource handler failed`.

Следующие маршруты не регистрируются: пустой путь, метод с пробелом, итоговый путь не под соответствующим префиксом, путь с пробелом, `:` или `*`. Путь ресурса также отклоняет `..`. При конфликте с зарезервированным маршрутом или с путём ресурса плагина более высокого приоритета эта запись пропускается. Объявление управления GET с непустым `Menu` не входит в `/v0/management` и регистрируется только как маршрут ресурса.

Собственный `error` метода регистрации всё ещё идёт через конверт ABI. Если `http_status` опущен или равен 0, он считается HTTP 500.

## 6. Связанные возможности

Уже существующие маршруты плоскости управления хоста на этой странице не описаны. Установка плагина описана в разделе [Загрузка плагинов и магазин](/ru/operations/plugins).

## 7. Практический опыт

Пока нет.

