---
outline: 'deep'
---

# Возможность Thinking applier

Возможность Thinking applier записывает thinking-конфигурацию, которую хост уже разобрал, нормализовал и проверил, в provider payload. Она сохраняет архитектурную границу «каноническая thinking-конфигурация → provider-specific поля».

## Поле возможности

```json
{
  "capabilities": {
    "thinking_applier": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ThinkingApplier`, `ThinkingApplyRequest`, `ThinkingConfig`
- `sdk/pluginabi/types.go`: `thinking.identifier`, `thinking.apply`
- `internal/pluginhost/adapters.go`: регистрация и вызов Thinking applier
- `internal/thinking/`: процесс разбора, нормализации и проверки thinking на стороне хоста

Примеры:

- `examples/plugin/thinking/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodThinkingIdentifier`, `MethodThinkingApply`

## Методы

| Метод | Назначение |
| --- | --- |
| `thinking.identifier` | Возвращает идентификатор provider, обрабатываемый этим плагином. |
| `thinking.apply` | Применяет каноническую thinking-конфигурацию к provider payload. |

## Запрос

```json
{
  "Provider": "plugin-example",
  "Model": {
    "ID": "plugin-example-model",
    "Thinking": {
      "Min": 0,
      "Max": 32768,
      "ZeroAllowed": true,
      "DynamicAllowed": true,
      "Levels": ["low", "medium", "high"]
    }
  },
  "Config": {
    "Mode": "budget",
    "Budget": 1024,
    "Level": ""
  },
  "Body": "base64-provider-payload"
}
```

`Config` уже является нормализованной хостом конфигурацией. Плагину не нужно заново разбирать suffix или исходный thinking input из тела запроса.

## Ответ

```json
{
  "Body": "base64-provider-payload-with-thinking"
}
```

## Замечания по разработке

- Плагин должен обрабатывать только provider, возвращённый его `thinking.identifier`.
- Не обходите проверку thinking на стороне хоста; плагин должен считать `Config` каноническим значением.
- Не выполняйте преобразование запроса, выбор учётных данных или upstream-выполнение внутри возможности Thinking applier.

