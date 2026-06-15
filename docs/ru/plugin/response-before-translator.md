---
outline: 'deep'
---

# Возможность нормализации ответа перед преобразованием

Возможность нормализации ответа перед преобразованием изменяет upstream-ответ до встроенного преобразования ответа хостом. Она подходит для исправления provider-native payload перед передачей его хосту или response translator плагина.

## Поле возможности

```json
{
  "capabilities": {
    "response_before_translator": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ResponseNormalizer`, `ResponseTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `response.normalize_before`
- `internal/pluginhost/adapters.go`: этап перед преобразованием в `NormalizeResponse`

Примеры:

- `examples/plugin/response-normalizer/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodResponseNormalizeBefore`

## Методы

| Метод | Назначение |
| --- | --- |
| `response.normalize_before` | До преобразования ответа возвращает нормализованное тело ответа. |

## Запрос и ответ

Запрос использует `ResponseTransformRequest`, ответ использует `PayloadResponse`:

```json
{
  "Body": "base64-normalized-provider-response"
}
```

## Отличие от нормализации после преобразования

- `response_before_translator` обрабатывает provider-native ответы.
- [Возможность нормализации ответа после преобразования](./response-after-translator) обрабатывает ответы, уже переведённые в клиентский протокол.

## Замечания по разработке

- Подходит для исправления отсутствующих upstream-полей и совместимости с нестандартными ответами provider.
- Не выводите формат клиентского протокола, если текущий `ToFormat` на этом этапе не является этим форматом.
- Если нужно поддержать оба этапа, можно объявить обе возможности.

