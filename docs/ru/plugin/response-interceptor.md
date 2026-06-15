---
outline: 'deep'
---

# Возможность перехвата ответов

Возможность перехвата ответов изменяет заголовки или тело успешного нестримингового HTTP-ответа перед возвратом клиенту.

## Поле возможности

```json
{
  "capabilities": {
    "response_interceptor": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ResponseInterceptor`, `ResponseInterceptRequest`, `ResponseInterceptResponse`
- `sdk/pluginabi/types.go`: `response.intercept_after`
- `internal/pluginhost/adapters.go`: `InterceptResponse`

Примеры:

- `internal/pluginhost/adapters_test.go`: тесты цепочки response interceptor, очистки header и обработки ошибок
- `examples/plugin/antigravity-web-search/go/main.go`: реальный пример миграции на response interception

## Методы

| Метод | Назначение |
| --- | --- |
| `response.intercept_after` | Изменяет успешный нестриминговый ответ. |

## Запрос

```json
{
  "SourceFormat": "chat-completions",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "Stream": false,
  "RequestHeaders": {},
  "ResponseHeaders": {},
  "OriginalRequest": "base64-client-body",
  "RequestBody": "base64-upstream-request",
  "Body": "base64-response-body",
  "StatusCode": 200,
  "Metadata": {}
}
```

## Ответ

```json
{
  "Headers": {
    "X-Plugin": ["example"]
  },
  "Body": "base64-new-response-body",
  "ClearHeaders": ["X-Old-Header"]
}
```

## Замечания по разработке

- Обрабатывает только успешные нестриминговые ответы; для стриминговых ответов используйте [возможность перехвата стриминговых ответов](./response-stream-interceptor).
- `Headers` перезаписывает одноимённые response header, но сохраняет header, которые не указаны.
- Непустой `Body` заменяет тело ответа.
- Callback моделей хоста, запущенные с `host_callback_id`, пропускают собственные response interceptor плагина-источника.

