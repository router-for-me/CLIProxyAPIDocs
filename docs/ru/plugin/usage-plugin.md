---
outline: 'deep'
---

# Возможность наблюдения за использованием

Возможность наблюдения за использованием получает информацию об использовании, задержке, ошибках и биллинге после завершения запроса. Она подходит для интеграции внешней статистики, аудита, биллинга или мониторинга.

## Поле возможности

```json
{
  "capabilities": {
    "usage_plugin": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `UsagePlugin`, `UsageRecord`, `UsageDetail`, `UsageFailure`
- `sdk/pluginabi/types.go`: `usage.handle`
- `internal/pluginhost/adapters.go`: `RegisterUsagePlugins`, `HandleUsage`

Примеры:

- `examples/plugin/usage/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodUsageHandle`

## Методы

| Метод | Назначение |
| --- | --- |
| `usage.handle` | Получает запись использования одного завершённого запроса. |

## Содержимое записи

`UsageRecord` содержит:

```json
{
  "Provider": "codex",
  "ExecutorType": "codex",
  "Model": "gpt-5.5",
  "Alias": "gpt-5.5",
  "APIKey": "client-key-id",
  "AuthID": "auth-1",
  "AuthIndex": "0",
  "AuthType": "oauth",
  "Source": "openai",
  "ReasoningEffort": "high",
  "ServiceTier": "priority",
  "RequestedAt": "2026-06-15T12:00:00Z",
  "Latency": 1234567890,
  "TTFT": 120000000,
  "Failed": false,
  "Detail": {
    "InputTokens": 10,
    "OutputTokens": 20,
    "ReasoningTokens": 0,
    "CachedTokens": 0,
    "TotalTokens": 30
  },
  "ResponseHeaders": {}
}
```

Неуспешные запросы содержат `Failed: true` и `Failure`:

```json
{
  "Failure": {
    "StatusCode": 429,
    "Body": "rate limited"
  }
}
```

## Замечания по разработке

- Usage plugin должен быстро возвращаться, чтобы не блокировать путь завершения запроса.
- Если нужно писать во внешнюю систему, лучше буферизовать или отправлять асинхронно внутри плагина.
- Не раскрывайте клиентский API key, upstream token или полные чувствительные тела ответов.
- Наблюдение за использованием — побочная возможность; оно не должно изменять запросы или ответы.

