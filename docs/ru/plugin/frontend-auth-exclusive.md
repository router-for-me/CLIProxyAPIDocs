---
outline: 'deep'
---

# Эксклюзивный режим фронтенд-аутентификации

Эксклюзивный режим фронтенд-аутентификации не является отдельным интерфейсом. Это дополнительная возможность провайдера фронтенд-аутентификации. Когда такой плагин выбран, хост использует только его как источник аутентификации фронтенд-запросов.

## Поле возможности

```json
{
  "capabilities": {
    "frontend_auth_provider": true,
    "frontend_auth_provider_exclusive": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `FrontendAuthProviderExclusive`
- `internal/pluginhost/rpc_schema.go`: `frontend_auth_provider_exclusive`
- `internal/pluginhost/adapters.go`: логика выбора эксклюзивного провайдера фронтенд-аутентификации

Пример:

- `examples/plugin/frontend-auth-exclusive/go/main.go`

## Правила выбора

При регистрации провайдеров фронтенд-аутентификации хост отдаёт приоритет плагинам, объявившим `frontend_auth_provider_exclusive`:

- Работает только для плагинов, которые также объявили `frontend_auth_provider`.
- Если существует несколько эксклюзивных плагинов, побеждает плагин с более высоким приоритетом.
- При одинаковом приоритете хост использует стабильное правило выбора.
- Когда эксклюзивный плагин удалён или отключён, хост очищает эксклюзивное состояние.

## Запрос и ответ

Эксклюзивный режим всё равно использует `frontend_auth.authenticate`:

```json
{
  "Authenticated": true,
  "Principal": "example-frontend-auth-exclusive-go",
  "Metadata": {
    "mode": "exclusive",
    "provider": "example-frontend-auth-exclusive-go"
  }
}
```

Пример плагина проверяет заголовок:

```text
X-Example-Frontend-Auth: exclusive
```

## Замечания по разработке

- Эксклюзивный режим меняет общую границу фронтенд-аутентификации, поэтому включайте его осторожно.
- При неуспехе плагин должен вернуть `Authenticated: false`, а не panic и не завершать процесс.
- Не объявляйте только `frontend_auth_provider_exclusive`. Без `frontend_auth_provider` это поле не создаёт валидный провайдер фронтенд-аутентификации.

