---
outline: 'deep'
---

# Возможность планировщика

Возможность планировщика выбирает учётные данные из candidate credential records перед запуском встроенного планировщика хоста или явно делегирует выбор встроенному планировщику.

## Поле возможности

```json
{
  "capabilities": {
    "scheduler": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `Scheduler`, `SchedulerPickRequest`, `SchedulerPickResponse`
- `sdk/pluginabi/types.go`: `scheduler.pick`
- `internal/pluginhost/adapters.go`: регистрация и вызов scheduler capability

Примеры:

- `examples/plugin/scheduler/go/main.go`
- `examples/plugin/scheduler/README.md`

## Методы

| Метод | Назначение |
| --- | --- |
| `scheduler.pick` | Возвращает решение планирования на основе контекста запроса и candidate учётных данных. |

## Запрос

```json
{
  "Provider": "codex",
  "Providers": ["codex"],
  "Model": "gpt-5.5",
  "Stream": true,
  "Options": {
    "Headers": {},
    "Metadata": {}
  },
  "Candidates": [
    {
      "ID": "auth-1",
      "Provider": "codex",
      "Priority": 1,
      "Status": "available",
      "Attributes": {},
      "Metadata": {}
    }
  ]
}
```

## Ответ

Выбрать конкретные учётные данные:

```json
{
  "AuthID": "auth-1",
  "Handled": true
}
```

Делегировать встроенному планировщику:

```json
{
  "DelegateBuiltin": "round-robin",
  "Handled": true
}
```

Не обрабатывать текущий запрос планирования:

```json
{
  "Handled": false
}
```

Поддерживаемые значения встроенного делегирования:

- `round-robin`
- `fill-first`

## Пример конфигурации

```yaml
plugins:
  configs:
    scheduler:
      enabled: true
      priority: 1
      auth_id: ""
      delegate: ""
      deny: false
```

Поведение примера плагина:

- При `deny: true` возвращает ошибку.
- Если `delegate` равен `fill-first` или `round-robin`, делегирует встроенному планировщику.
- Если `auth_id` непустой и есть в списке кандидатов, выбирает эти учётные данные.

## Замечания по разработке

- Выбирайте только credential ID из `Candidates`; не возвращайте ID вне контекста запроса.
- Возврат ошибки проваливает текущую попытку планирования и подходит для явного отказа.
- Если плагин не хочет обрабатывать запрос, возвращайте `Handled: false`, чтобы последующие плагины или встроенная логика хоста продолжили обработку.

