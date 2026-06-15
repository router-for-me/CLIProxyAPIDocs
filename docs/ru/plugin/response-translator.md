---
outline: 'deep'
---

# Возможность преобразования ответов

Возможность преобразования ответов конвертирует канонический ответ обратно в целевой протокол, запрошенный клиентом. Она симметрична [возможности преобразования запросов](./request-translator) и выполняется после возврата upstream-ответа, но до отправки клиенту.

## Поле возможности

```json
{
  "capabilities": {
    "response_translator": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ResponseTranslator`, `ResponseTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `response.translate`
- `internal/pluginhost/adapters.go`: `TranslateResponse`, `callResponseTranslator`

Примеры:

- `examples/plugin/response-translator/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodResponseTranslate`

## Методы

| Метод | Назначение |
| --- | --- |
| `response.translate` | Преобразует `Body` ответа из `FromFormat` в `ToFormat`. |

## Запрос

```json
{
  "FromFormat": "codex",
  "ToFormat": "chat-completions",
  "Model": "gpt-5.5",
  "Stream": false,
  "OriginalRequest": "base64-client-body",
  "TranslatedRequest": "base64-provider-request",
  "Body": "base64-upstream-response"
}
```

## Ответ

```json
{
  "Body": "base64-client-response"
}
```

## Замечания по разработке

- `OriginalRequest` — исходный клиентский запрос, а `TranslatedRequest` — запрос, отправленный upstream. Их можно использовать для заполнения формата ответа.
- Response translation должен выводить полный ответ, требуемый клиентским протоколом.
- Возможность преобразования стриминговых ответов зависит от executor и возможностей формата хоста; плагин должен явно тестировать stream-сценарии.

