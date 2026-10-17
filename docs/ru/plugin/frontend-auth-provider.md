---
title: Провайдер фронтенд-аутентификации
feature_ids:
  - plugin.frontend-auth-provider.identifier
  - plugin.frontend-auth-provider.authenticate
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Провайдер фронтенд-аутентификации

`FrontendAuthProvider` выполняет фронтенд-аутентификацию до того, как запрос войдёт в обработку прокси.

## 1. Какую задачу решает этот раздел

Плагин смотрит входящий метод, путь, заголовки, запрос и тело, решает, принимать ли запрос, и выдаёт идентификатор субъекта и атрибуты, доступные дальше.

## 2. Когда применимо и чего здесь нет

Он не разбирает файлы учётных данных upstream. Это [Провайдер учётных данных](/ru/plugin/auth-provider). Переключатель исключительности — не метод. См. [Эксклюзивный режим фронтенд-аутентификации](/ru/plugin/frontend-auth-exclusive).

## 3. Как настроить или вызвать

Задайте `capabilities.frontend_auth_provider` равным true. Если нужен исключительный режим, добавьте ещё `frontend_auth_provider_exclusive`. Этот переключатель на этой странице не объясняется.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-frontend-auth",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-frontend-auth"
    },
    "capabilities": {
      "frontend_auth_provider": true
    }
  }
}
```

```go
Identifier() string
Authenticate(context.Context, FrontendAuthRequest) (FrontendAuthResponse, error)
```

Имена методов ABI — `frontend_auth.identifier` и `frontend_auth.authenticate`. Поле объекта результата идентификатора — `identifier`. Пример — `examples/plugin/frontend-auth`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.frontend-auth-provider.identifier | `Identifier`, ABI `frontend_auth.identifier`. |  | Без параметров. Возвращает строку. Ошибка или пустое значение считаются пустой строкой. |
| plugin.frontend-auth-provider.authenticate | `Authenticate`, ABI `frontend_auth.authenticate`. |  | Параметр `FrontendAuthRequest`, возврат `FrontendAuthResponse`. |
| FrontendAuthRequest.Method | Метод HTTP. |  | Строка. |
| FrontendAuthRequest.Path | Путь запроса. |  | Строка. |
| FrontendAuthRequest.Headers | Входящие заголовки. |  | `http.Header`. |
| FrontendAuthRequest.Query | Параметры запроса. |  | `url.Values`. |
| FrontendAuthRequest.Body | Исходное тело. |  | `[]byte`, в JSON это base64. |
| FrontendAuthResponse.Authenticated | Принят ли запрос. |  | Логическое значение. |
| FrontendAuthResponse.Principal | Идентификатор аутентифицированного субъекта. |  | Строка. |
| FrontendAuthResponse.Metadata | Атрибуты личности, передаваемые дальше. |  | `map[string]string`. |

## 5. Типичные ошибки и границы

Когда `Authenticate` возвращает `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

`Authenticated` равный false означает, что запрос не принят. Это не тот же путь, что возврат ошибки методом.

## 6. Связанные возможности

Логическое значение исключительности описано в разделе [Эксклюзивный режим фронтенд-аутентификации](/ru/plugin/frontend-auth-exclusive). Учётные данные upstream — в разделе [Провайдер учётных данных](/ru/plugin/auth-provider).

## 7. Практический опыт

Пока нет.

