---
outline: 'deep'
---

# Возможность перехвата запросов

Возможность перехвата запросов изменяет заголовки или тело запроса перед выполнением upstream-запроса. У неё два этапа: до выбора учётных данных и после выбора учётных данных.

## Поле возможности

```json
{
  "capabilities": {
    "request_interceptor": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `RequestInterceptor`, `RequestInterceptRequest`, `RequestInterceptResponse`
- `sdk/pluginabi/types.go`: `request.intercept_before`, `request.intercept_after`
- `internal/pluginhost/adapters.go`: `InterceptRequestBeforeAuth`, `InterceptRequestAfterAuth`

Примеры:

- `internal/pluginhost/adapters_test.go`: тесты цепочки request interceptor, пропуска плагина-источника и обработки ошибок
- `examples/plugin/antigravity-web-search/go/main.go`: реальный пример миграции на текущий interceptor seam

## Методы

| Метод | Назначение |
| --- | --- |
| `request.intercept_before` | Изменяет запрос до выбора учётных данных. На этом этапе `ToFormat` может быть пустым. |
| `request.intercept_after` | Изменяет запрос после выбора учётных данных. На этом этапе модель и upstream-формат уже конкретнее. |

## Запрос

```json
{
  "SourceFormat": "chat-completions",
  "ToFormat": "codex",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "Stream": false,
  "Headers": {},
  "Body": "base64-body",
  "Metadata": {}
}
```

## Ответ

```json
{
  "Headers": {
    "X-Plugin": ["example"]
  },
  "Body": "base64-new-body",
  "ClearHeaders": ["X-Old-Header"]
}
```

Семантика:

- `Headers` перезаписывает одноимённые header, но сохраняет header, которые не указаны.
- Непустой `Body` заменяет текущее body.
- `ClearHeaders` сначала удаляет указанные header, затем применяет `Headers`.

## Защита от рекурсии

Когда плагин запускает вложенный запрос модели через `host.model.*` и передаёт `host_callback_id`, хост пропускает собственные request interceptor плагина-источника, чтобы избежать рекурсивного вызова самого себя. Request interceptor других плагинов всё ещё могут обработать вложенный запрос.

## Замечания по разработке

- `Metadata` — снимок контекста хоста, его следует считать read-only.
- До выбора учётных данных не полагайтесь на поля учётных данных; изменения, требующие контекст учётных данных, делайте после выбора.
- Не вызывайте upstream-модель напрямую из request interceptor. Если нужен запрос модели, используйте [callback хоста](./host-callbacks).

