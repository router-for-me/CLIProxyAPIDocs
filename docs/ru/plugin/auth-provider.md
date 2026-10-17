---
title: Провайдер учётных данных
feature_ids:
  - plugin.auth-provider.identifier
  - plugin.auth-provider.parse-auth
  - plugin.auth-provider.start-login
  - plugin.auth-provider.poll-login
  - plugin.auth-provider.refresh-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Провайдер учётных данных

`AuthProvider` позволяет плагину разбирать файлы учётных данных и выполнять вход, опрос и обновление.

## 1. Какую задачу решает этот раздел

Хост передаёт плагину обнаруженный JSON учётных данных, действие входа и обновление по истечении срока. Плагин возвращает `AuthData` или разворачивает несколько `Auths` из одного материала.

## 2. Когда применимо и чего здесь нет

Реализуйте только пять методов `sdk/pluginapi.AuthProvider`. Фронтенд-аутентификация запроса — это [Провайдер фронтенд-аутентификации](/ru/plugin/frontend-auth-provider). Выбор учётных данных — это [Планировщик](/ru/plugin/scheduler). Частные callback хоста на этой странице не описываются.

При регистрации `Name`, `Version`, `Author` и `GitHubRepository` не могут быть пустыми, и должна быть включена хотя бы одна возможность. Каталог плагинов описан в разделе [Загрузка плагинов и магазин](/ru/operations/plugins).

## 3. Как настроить или вызвать

Задайте `auth_provider` в результате `plugin.register` или `plugin.reconfigure`. Текущий `sdk/pluginabi.SchemaVersion` равен 6.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-auth",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-auth"
    },
    "capabilities": {
      "auth_provider": true
    }
  }
}
```

Сигнатуры Go:

```go
Identifier() string
ParseAuth(context.Context, AuthParseRequest) (AuthParseResponse, error)
StartLogin(context.Context, AuthLoginStartRequest) (AuthLoginStartResponse, error)
PollLogin(context.Context, AuthLoginPollRequest) (AuthLoginPollResponse, error)
RefreshAuth(context.Context, AuthRefreshRequest) (AuthRefreshResponse, error)
```

Имена методов ABI по порядку: `auth.identifier`, `auth.parse`, `auth.login.start`, `auth.login.poll` и `auth.refresh`. Поля без тега `json` используют экспортируемое имя Go. `[]byte` в JSON — это base64. `time.Time` — RFC3339.

У объекта результата `auth.identifier` есть только поле `identifier`. Пример — `examples/plugin/auth` в репозитории.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.auth-provider.identifier | `Identifier`, ABI `auth.identifier`. |  | Без параметров. Возвращает строку идентификатора provider. Ошибка или пустое значение считаются пустой строкой. |
| plugin.auth-provider.parse-auth | `ParseAuth`, ABI `auth.parse`. |  | Параметр `AuthParseRequest`, возврат `AuthParseResponse`. |
| plugin.auth-provider.start-login | `StartLogin`, ABI `auth.login.start`. |  | Параметр `AuthLoginStartRequest`, возврат `AuthLoginStartResponse`. |
| plugin.auth-provider.poll-login | `PollLogin`, ABI `auth.login.poll`. |  | Параметр `AuthLoginPollRequest`, возврат `AuthLoginPollResponse`. |
| plugin.auth-provider.refresh-auth | `RefreshAuth`, ABI `auth.refresh`. |  | Параметр `AuthRefreshRequest`, возврат `AuthRefreshResponse`. |
| AuthParseRequest.Provider | Разбираемый ключ provider. |  | Строка. |
| AuthParseRequest.Path | Путь источника материала учётных данных. Может быть пустым. |  | Строка. |
| AuthParseRequest.FileName | Имя файла учётных данных. |  | Строка. |
| AuthParseRequest.RawJSON | Исходный JSON учётных данных. |  | `[]byte`. |
| AuthParseRequest.Host | Сводка конфигурации хоста, связанная с плагином. |  | `HostConfigSummary`. |
| AuthParseResponse.Handled | Распознал ли плагин этот материал. |  | При false `Auth` не применяется. |
| AuthParseResponse.Auth | Одни учётные данные при успешном распознавании. |  | `AuthData`. |
| AuthParseResponse.Auths | Несколько рабочих учётных данных, развёрнутых из одного материала. |  | `[]AuthData`. |
| AuthLoginStartRequest.Provider | Ключ provider потока входа. |  | Строка. |
| AuthLoginStartRequest.BaseURL | Callback хоста или базовый адрес входа. |  | Строка. |
| AuthLoginStartRequest.Host | Сводка конфигурации хоста. |  | `HostConfigSummary`. |
| AuthLoginStartRequest.HTTPClient | HTTP-клиент, отправляющий по транспортной политике хоста. |  | `HostHTTPClient`, JSON игнорирует. См. [Callback хоста](/ru/plugin/host-callbacks). |
| AuthLoginStartRequest.Metadata | Контекст входа, заданный плагином. |  | `map[string]any`. |
| AuthLoginStartResponse.Provider | Ключ provider потока входа. |  | Строка. |
| AuthLoginStartResponse.URL | Адрес входа, который открывает пользователь. |  | Строка. |
| AuthLoginStartResponse.State | Непрозрачное состояние для опроса. |  | Передаётся в `PollLogin`. |
| AuthLoginStartResponse.ExpiresAt | Время истечения этого круга входа. |  | `time.Time`. |
| AuthLoginStartResponse.Metadata | Контекст опроса, заданный плагином. |  | `map[string]any`. |
| AuthLoginPollRequest.Provider | Ключ provider потока входа. |  | Строка. |
| AuthLoginPollRequest.State | Состояние, возвращённое `StartLogin`. |  | Строка. |
| AuthLoginPollRequest.Host | Сводка конфигурации хоста. |  | `HostConfigSummary`. |
| AuthLoginPollRequest.HTTPClient | HTTP-клиент хоста. |  | JSON игнорирует. |
| AuthLoginPollRequest.Metadata | Контекст опроса, заданный плагином. |  | `map[string]any`. |
| AuthLoginPollResponse.Status | Текущее состояние входа. |  | Только `pending`, `success` или `error`. |
| AuthLoginPollResponse.Message | Текст хода или ошибки. |  | Строка. |
| AuthLoginPollResponse.Auth | Одни учётные данные при успехе. |  | Используется, когда `Status` равен `success`. |
| AuthLoginPollResponse.Auths | Несколько учётных данных, развёрнутых из одного входа. |  | `[]AuthData`. |
| AuthRefreshRequest.AuthID | ID учётных данных для обновления. |  | Строка. |
| AuthRefreshRequest.AuthProvider | Провайдер учётных данных. |  | Строка. |
| AuthRefreshRequest.StorageJSON | Собственные сохранённые данные плагина. |  | `[]byte`. |
| AuthRefreshRequest.Metadata | Метаданные, которые хост может менять. |  | `map[string]any`. |
| AuthRefreshRequest.Attributes | Неизменяемые атрибуты маршрута и провайдера. |  | `map[string]string`. |
| AuthRefreshRequest.Host | Сводка конфигурации хоста. |  | `HostConfigSummary`. |
| AuthRefreshRequest.HTTPClient | HTTP-клиент хоста. |  | JSON игнорирует. |
| AuthRefreshResponse.Auth | Учётные данные после обновления. |  | `AuthData`. |
| AuthRefreshResponse.NextRefreshAfter | Самое раннее время следующего обновления. |  | `time.Time`. |
| AuthData.Provider | Provider, которому принадлежат учётные данные. |  | Строка. |
| AuthData.ID | Стабильный ID на стороне хоста. |  | Строка. |
| AuthData.FileName | Имя файла источника или сохранения. |  | Строка. |
| AuthData.Label | Отображаемое имя. |  | Строка. |
| AuthData.Prefix | Префикс модели этих учётных данных. |  | Строка. |
| AuthData.ProxyURL | Адрес прокси уровня учётных данных. |  | Строка. |
| AuthData.Disabled | Пропускать ли эти учётные данные. |  | Логическое значение. |
| AuthData.StorageJSON | Собственные сохранённые данные плагина. |  | `[]byte`. |
| AuthData.Metadata | Метаданные, которые хост может менять. |  | `map[string]any`. |
| AuthData.Attributes | Неизменяемые атрибуты. |  | `map[string]string`. |
| AuthData.NextRefreshAfter | Самое раннее время следующего обновления. |  | `time.Time`. |
| HostConfigSummary.AuthDir | Разобранный каталог учётных данных. |  | Строка. |
| HostConfigSummary.ProxyURL | Настроенный прокси upstream. |  | Строка. |
| HostConfigSummary.ForceModelPrefix | Сохраняет ли псевдоним префикс провайдера. |  | Логическое значение. |
| HostConfigSummary.OAuthModelAlias | Отображение провайдера в псевдонимы моделей. |  | Элементы — `ModelAlias`, с `Name` и `Alias`. |
| HostConfigSummary.ExcludedModels | Имена моделей, скрытые по провайдеру. |  | `map[string][]string`. |

## 5. Типичные ошибки и границы

Когда любой из четырёх методов с `error` завершается ошибкой, конверт ABI `ok` равен false. `error.code` и `error.message` обязательны. `retryable` можно опустить. Если `http_status` опущен или равен 0, он считается HTTP 500.

Если `ParseAuth` не распознал материал, он возвращает `Handled: false`, а не считает пустой `AuthData` успешными учётными данными. Состояние входа принимает только `pending`, `success` и `error`. `HTTPClient` не входит в JSON.

## 6. Связанные возможности

Список моделей описан в разделе [Провайдер моделей](/ru/plugin/model-provider). Выбор учётных данных — в разделе [Планировщик](/ru/plugin/scheduler). Вызовы upstream — в разделе [Callback хоста](/ru/plugin/host-callbacks).

## 7. Практический опыт

Пока нет.

