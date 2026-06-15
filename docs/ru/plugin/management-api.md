---
outline: 'deep'
---

# Возможность Management API

Возможность Management API позволяет плагину регистрировать собственные management endpoints и браузерные ресурсные страницы. Она подходит для страниц статуса, диагностики, помощников настройки или специальных действий плагина.

## Поле возможности

```json
{
  "capabilities": {
    "management_api": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ManagementAPI`, `ManagementRegistrationRequest`, `ManagementRoute`, `ResourceRoute`, `ManagementRequest`, `ManagementResponse`
- `sdk/pluginabi/types.go`: `management.register`, `management.handle`
- `internal/pluginhost/management.go`: регистрация management routes и resource routes, границы аутентификации

Примеры:

- `examples/plugin/management-api/go/main.go`
- `examples/plugin/host-callback/go/main.go`
- `examples/plugin/host-model-callback/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodManagementRegister`, `MethodManagementHandle`

## Методы

| Метод | Назначение |
| --- | --- |
| `management.register` | Регистрирует management routes и браузерные ресурсы плагина. |
| `management.handle` | Обрабатывает HTTP-запросы, сопоставленные маршрутам плагина. |

## Типы маршрутов

| Тип | Поле регистрации | Открытый путь | Аутентификация |
| --- | --- | --- | --- |
| Management API плагина | `Routes` | `/v0/management/...` | Требует management key. |
| Браузерная ресурсная страница | `Resources` | `/v0/resource/plugins/<pluginID>/...` | Доступ как к resource route. |

## Ответ регистрации

```json
{
  "Routes": [
    {
      "Method": "POST",
      "Path": "/plugins/example/run"
    }
  ],
  "Resources": [
    {
      "Path": "/status",
      "Menu": "Example Plugin",
      "Description": "Shows example plugin status."
    }
  ]
}
```

Итоговый пример пути ресурса:

```text
/v0/resource/plugins/example/status
```

## Обработка запросов

`management.handle` получает:

```json
{
  "Method": "GET",
  "Path": "/v0/resource/plugins/example/status",
  "Headers": {},
  "Query": {},
  "Body": "base64-body"
}
```

Ответ:

```json
{
  "StatusCode": 200,
  "Headers": {
    "Content-Type": ["text/html; charset=utf-8"]
  },
  "Body": "base64-html"
}
```

## Границы аутентификации

- Plugin management API под `/v0/management/...` требует management key.
- `/v0/resource/plugins/<pluginID>/...` — браузерный ресурсный путь, он не использует ту же аутентификацию Management API.
- Устаревшие GET management route с `Menu` хост переносит в resource route, чтобы не раскрывать страницы меню как management API.

## Замечания по разработке

- Management routes плагина не могут перекрывать существующие маршруты хоста `/v0/management`.
- Resource path не может содержать пробелы, `:`, `*` или `..`.
- При возврате HTML всё равно не выводите на страницу secret, token или JSON учётных данных.
- Если нужно вызвать возможности модели, HTTP или файлов учётных данных хоста, используйте [callback хоста](./host-callbacks).

