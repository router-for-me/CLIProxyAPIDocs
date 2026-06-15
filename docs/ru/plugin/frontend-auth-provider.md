---
outline: 'deep'
---

# Возможность провайдера фронтенд-аутентификации

Возможность провайдера фронтенд-аутентификации аутентифицирует клиентские запросы до входа в proxy-процесс. Она отвечает на вопрос «кто может вызывать CLIProxyAPI» и не отвечает за выбор upstream-учётных данных.

## Поле возможности

```json
{
  "capabilities": {
    "frontend_auth_provider": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `FrontendAuthProvider`, `FrontendAuthRequest`, `FrontendAuthResponse`
- `sdk/pluginabi/types.go`: `frontend_auth.identifier`, `frontend_auth.authenticate`
- `internal/pluginhost/adapters.go`: `RegisterFrontendAuthProviders`

Примеры:

- `examples/plugin/frontend-auth/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodFrontendAuthIdentifier`, `MethodFrontendAuthAuthenticate`

## Методы

| Метод | Назначение |
| --- | --- |
| `frontend_auth.identifier` | Возвращает стабильный идентификатор этого провайдера фронтенд-аутентификации. |
| `frontend_auth.authenticate` | По содержимому HTTP-запроса определяет, прошла ли аутентификация. |

## Запрос

`frontend_auth.authenticate` получает:

```json
{
  "Method": "POST",
  "Path": "/v1/chat/completions",
  "Headers": {
    "Authorization": ["Bearer ..."]
  },
  "Query": {},
  "Body": "base64-body"
}
```

## Ответ

```json
{
  "Authenticated": true,
  "Principal": "user-or-client-id",
  "Metadata": {
    "provider": "example-frontend-auth-go"
  }
}
```

`Principal` — аутентифицированный субъект. `Metadata` может передавать downstream атрибуты идентичности.

## Связь со встроенными API Key

Обычный провайдер фронтенд-аутентификации работает вместе с существующими способами аутентификации хоста. Только при объявлении [эксклюзивного режима фронтенд-аутентификации](./frontend-auth-exclusive) плагин после выбора может стать единственным источником фронтенд-аутентификации.

## Замечания по разработке

- Фронтенд-аутентификация проверяет только клиентские запросы и не должна читать или возвращать upstream-учётные данные.
- Будьте осторожны с размером тела запроса и чувствительной информацией при аутентификации по body. Не логируйте исходный body.
- Когда плагин возвращает `Authenticated: false`, хост продолжает текущую цепочку аутентификации или отклоняет запрос, в зависимости от того, включён ли эксклюзивный режим.

