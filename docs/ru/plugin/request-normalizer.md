---
outline: 'deep'
---

# Возможность нормализации запросов

Возможность нормализации запросов изменяет request payload перед входом в путь выполнения так, чтобы последующим этапам хоста было проще его обработать. Она часто используется для добавления значений по умолчанию, исправления provider-specific payload или лёгких изменений запроса.

## Поле возможности

```json
{
  "capabilities": {
    "request_normalizer": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `RequestNormalizer`, `RequestTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `request.normalize`
- `internal/pluginhost/adapters.go`: `NormalizeRequest`, `callRequestNormalizer`

Примеры:

- `examples/plugin/request-normalizer/go/main.go`
- `examples/plugin/codex-service-tier/go/main.go`
- `examples/plugin/codex-service-tier/README.md`
- `examples/plugin/simple/go/main.go`: `MethodRequestNormalize`

## Методы

| Метод | Назначение |
| --- | --- |
| `request.normalize` | Возвращает новое тело запроса на основе формата, модели и stream flag. |

## Запрос

```json
{
  "FromFormat": "chat-completions",
  "ToFormat": "codex",
  "Model": "gpt-5.5",
  "Stream": false,
  "Body": "base64-request-body"
}
```

## Ответ

```json
{
  "Body": "base64-normalized-body"
}
```

## Пример: Codex service tier

`examples/plugin/codex-service-tier` — пример request normalizer, близкий к реальному использованию. Он читает поле `fast` из конфигурации плагина и изменяет Codex-запросы при выполнении всех условий:

- `ToFormat` равен `codex`
- `Model` равен `gpt-5.5`
- `fast` равен `true`

Пример конфигурации:

```yaml
plugins:
  configs:
    codex-service-tier:
      enabled: true
      priority: 1
      fast: true
```

## Замечания по разработке

- Нормализация запросов должна быть узкой и предсказуемой; она не должна брать на себя обязанности executor.
- Пустой `Body` не позволяет хосту применить эффективное изменение. Если нужно сохранить исходный текст, возвращайте исходный `Body`.
- Собственная конфигурация плагина передаётся в `plugin.register` и `plugin.reconfigure` через `config_yaml`; разбирайте и кэшируйте её там.

