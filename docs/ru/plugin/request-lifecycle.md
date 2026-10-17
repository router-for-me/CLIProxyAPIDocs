---
title: Жизненный цикл запроса
feature_ids:
  - plugin.request-lifecycle-plugin.handle-request-complete
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Жизненный цикл запроса

`RequestLifecyclePlugin` асинхронно получает одно конечное состояние после того, как запрос дошёл до стадии перехвата.

## 1. Какую задачу решает этот раздел

При успехе выполнения, ошибке выполнения, отказе перехватчика или отмене плагин каждый раз получает одну запись завершения. Она нужна для завершения работы, а не для переписывания ответа.

## 2. Когда применимо и чего здесь нет

Есть только `HandleRequestComplete`. Он не меняет запрос и не меняет ответ. Подсчёт использования — это [Наблюдение за использованием](/ru/plugin/usage-plugin).

`sdk/pluginabi` указывает, что завершение запроса есть начиная с версии контракта 2. Текущий `SchemaVersion` равен 6, поэтому возможность уже включена.

## 3. Как настроить или вызвать

Задайте `capabilities.request_lifecycle_plugin` равным true.

```go
HandleRequestComplete(context.Context, RequestCompletion) error
```

Имя метода ABI — `request.complete`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.request-lifecycle-plugin.handle-request-complete | `HandleRequestComplete`, ABI `request.complete`. |  | Параметр `RequestCompletion`, возвращается только `error`. |
| RequestCompletion.RequestID | ID выполнения, тот же, что у перехваченного запроса. |  | Строка. |
| RequestCompletion.TraceID | ID трассировки входящего запроса. |  | Строка. |
| RequestCompletion.SourceFormat | Протокол клиента. |  | Строка. |
| RequestCompletion.Model | Модель выполнения. |  | Строка. |
| RequestCompletion.RequestedModel | Модель, запрошенная клиентом. |  | Строка. |
| RequestCompletion.Stream | Потоковый ли запрос. |  | Логическое значение. |
| RequestCompletion.Outcome | Конечное состояние. |  | `succeeded`, `failed`, `rejected`, `canceled`. |
| RequestCompletion.StatusCode | Код состояния конечного результата. |  | При отмене равен 0. |
| RequestCompletion.Error | Текст ошибки. |  | Строка. |
| RequestCompletion.StartedAt | Время начала. |  | `time.Time`, в JSON это RFC3339. |
| RequestCompletion.CompletedAt | Время завершения. |  | `time.Time`. |
| RequestCompletion.Metadata | Снимок контекста. |  | `map[string]any`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

`rejected` означает, что перехватчик остановил запрос до выполнения. `canceled` означает отмену контекста или разрыв вниз по потоку, и код состояния тогда равен 0. `failed` означает ошибку выполнения модели. У каждого запроса, дошедшего до стадии перехвата, только одно конечное состояние.

## 6. Связанные возможности

Перехват описан в разделе [Перехват запросов](/ru/plugin/request-interceptor). Использование — в разделе [Наблюдение за использованием](/ru/plugin/usage-plugin).

## 7. Практический опыт

Пока нет.

