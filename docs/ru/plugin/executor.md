---
outline: 'deep'
---

# Возможность исполнителя

Возможность исполнителя фактически отправляет запросы модели upstream-провайдеру или локальному backend. Это возможность, наиболее близкая к upstream-адаптеру.

## Поле возможности

```json
{
  "capabilities": {
    "executor": true,
    "executor_model_scope": "both",
    "executor_input_formats": ["chat-completions"],
    "executor_output_formats": ["chat-completions"]
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ProviderExecutor`, `ExecutorRequest`, `ExecutorResponse`, `ExecutorStreamResponse`, `ExecutorHTTPRequest`
- `sdk/pluginabi/types.go`: `executor.identifier`, `executor.execute`, `executor.execute_stream`, `executor.count_tokens`, `executor.http_request`
- `internal/pluginhost/adapters.go`: регистрация исполнителя, выбор форматов протокола и мост выполнения

Примеры:

- `examples/plugin/executor/go/main.go`
- `examples/plugin/protocol-format/go/main.go`
- `examples/plugin/simple/go/main.go`: методы, связанные с executor

## Методы

| Метод | Назначение |
| --- | --- |
| `executor.identifier` | Возвращает идентификатор provider, за который отвечает этот исполнитель. |
| `executor.execute` | Выполняет нестриминговый запрос модели. |
| `executor.execute_stream` | Выполняет стриминговый запрос модели. |
| `executor.count_tokens` | Обрабатывает запрос подсчёта токенов. |
| `executor.http_request` | Входная точка для HTTP-запросов, принадлежащих исполнителю. |

## Форматы протокола

`executor_input_formats` объявляет протоколы запросов, которые исполнитель может принимать напрямую. `executor_output_formats` объявляет протоколы ответов, которые исполнитель выдаёт напрямую.

Частые значения:

- `chat-completions`
- `responses`
- `anthropic`

`examples/plugin/protocol-format` показывает объявление с входом `chat-completions` и выходом `responses`.

## Область моделей

`executor_model_scope` управляет связью исполнителя с путём регистрации моделей:

| Значение | Описание |
| --- | --- |
| `static` | Исполнитель обслуживает только статические модели. |
| `oauth` | Исполнитель обслуживает только модели, привязанные к OAuth или учётным данным. |
| `both` | Исполнитель обслуживает и статические, и привязанные к учётным данным модели. |

Пустое значение обрабатывается как `both`.

## ExecutorRequest

Запрос выполнения содержит:

```json
{
  "AuthID": "auth-1",
  "AuthProvider": "plugin-example",
  "Model": "plugin-example-model",
  "Format": "chat-completions",
  "Stream": false,
  "Headers": {},
  "Query": {},
  "OriginalRequest": "base64-client-body",
  "SourceFormat": "chat-completions",
  "Payload": "base64-provider-payload",
  "StorageJSON": "base64-auth-json",
  "AuthMetadata": {},
  "AuthAttributes": {}
}
```

Когда плагин отправляет HTTP-запросы upstream, он должен использовать HTTP-клиент хоста через `host.http.*`. Так логирование запросов, proxy, транспортная политика и контекст учётных данных остаются под контролем хоста.

## Ответы

Нестриминговый ответ:

```json
{
  "Payload": "base64-response-body",
  "Headers": {
    "content-type": ["application/json"]
  },
  "Metadata": {}
}
```

Стриминговый ответ возвращает `Headers` и поток chunk. Примеры C ABI помещают конечные chunk в массив ответа, а хост преобразует их во внутренний поток.

## Замечания по разработке

- Исполнитель должен объявить минимум один входной и один выходной формат.
- `Payload` уже переведён в тело запроса целевого протокола; не угадывайте исходный клиентский протокол заново.
- Если нужно переиспользовать маршрут моделей хоста, не пишите executor. Используйте `host.model.*` из [callback хоста](./host-callbacks).
- Не сохраняйте и не печатайте upstream-секреты в плагине. Данные учётных данных из `StorageJSON` нужно использовать и сразу отбросить.

