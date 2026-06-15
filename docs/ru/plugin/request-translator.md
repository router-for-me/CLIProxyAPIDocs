---
outline: 'deep'
---

# Возможность преобразования запросов

Возможность преобразования запросов конвертирует канонический запрос в протокол целевого провайдера. Она находится на этапе protocol translation перед выполнением запроса и подходит для перевода нормализованного CLIProxyAPI тела запроса в payload, нужный upstream.

## Поле возможности

```json
{
  "capabilities": {
    "request_translator": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `RequestTranslator`, `RequestTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `request.translate`
- `internal/pluginhost/adapters.go`: `TranslateRequest`, `callRequestTranslator`

Примеры:

- `examples/plugin/request-translator/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodRequestTranslate`

## Методы

| Метод | Назначение |
| --- | --- |
| `request.translate` | Преобразует `Body` из `FromFormat` в `ToFormat`. |

## Запрос

```json
{
  "FromFormat": "chat-completions",
  "ToFormat": "anthropic",
  "Model": "claude-sonnet",
  "Stream": false,
  "Body": "base64-request-body"
}
```

## Ответ

```json
{
  "Body": "base64-translated-body"
}
```

## Отличие от нормализации запросов

- [Возможность нормализации запросов](./request-normalizer) приводит provider или специальные входные запросы к каноническому формату, понятному хосту.
- Возможность преобразования запросов переводит канонический формат в целевой upstream-протокол.

## Замечания по разработке

- Обрабатывайте только явно поддерживаемые сочетания форматов. Если сочетание не поддерживается, верните ошибку или не объявляйте эту возможность.
- `Body` должен быть полным и валидным payload целевого протокола.
- Не выполняйте выбор учётных данных или upstream HTTP-запросы внутри translator; это относится к этапам scheduler и executor.

