---
outline: 'deep'
---

# Возможность нормализации ответа после преобразования

Возможность нормализации ответа после преобразования выполняет финальные изменения после того, как ответ уже переведён в клиентский протокол. Она подходит для совместимости со строгими клиентами, добавления полей или лёгкой постобработки ответа.

## Поле возможности

```json
{
  "capabilities": {
    "response_after_translator": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ResponseNormalizer`, `ResponseTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `response.normalize_after`
- `internal/pluginhost/adapters.go`: этап после преобразования в `NormalizeResponse`

Примеры:

- `examples/plugin/response-normalizer/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodResponseNormalizeAfter`

## Методы

| Метод | Назначение |
| --- | --- |
| `response.normalize_after` | После преобразования ответа возвращает нормализованное тело клиентского ответа. |

## Запрос

Запрос содержит исходный клиентский запрос, преобразованный upstream-запрос и текущее тело ответа:

```json
{
  "FromFormat": "codex",
  "ToFormat": "chat-completions",
  "Model": "gpt-5.5",
  "Stream": false,
  "OriginalRequest": "base64-client-body",
  "TranslatedRequest": "base64-provider-request",
  "Body": "base64-translated-response"
}
```

## Ответ

```json
{
  "Body": "base64-final-client-response"
}
```

## Замечания по разработке

- Подходит для добавления совместимых полей, обязательных для клиентского протокола.
- Не вызывайте upstream повторно и не меняйте семантику биллинга на этом этапе.
- Чтобы изменить HTTP header, используйте [возможность перехвата ответов](./response-interceptor), а не нормализацию ответа.

