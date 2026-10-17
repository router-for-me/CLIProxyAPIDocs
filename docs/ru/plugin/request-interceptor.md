---
title: Перехват запросов
feature_ids:
  - plugin.request-interceptor.intercept-request-before-auth
  - plugin.request-interceptor.intercept-request-after-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Перехват запросов

`RequestInterceptor` переписывает запрос, который вот-вот будет выполнен, и до выбора учётных данных, и после.

## 1. Какую задачу решает этот раздел

Плагин может заменить часть заголовков и тело, удалить заголовки, изменить путь или остановить запрос до исполнителя и выдать ответ вниз.

## 2. Когда применимо и чего здесь нет

Оба метода используют `RequestInterceptRequest` и `RequestInterceptResponse`. До выбора учётных данных `ToFormat` пуст. После выбора `Model` — выбранная модель upstream. Потоковые блоки и использование он не обрабатывает.

`Body`, `Headers` и `Metadata` считаются только для чтения. Изменение тела нужно помещать в возвращаемое значение.

## 3. Как настроить или вызвать

Задайте `capabilities.request_interceptor` равным true.

```go
InterceptRequestBeforeAuth(context.Context, RequestInterceptRequest) (RequestInterceptResponse, error)
InterceptRequestAfterAuth(context.Context, RequestInterceptRequest) (RequestInterceptResponse, error)
```

Имена методов ABI — `request.intercept_before` и `request.intercept_after`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.request-interceptor.intercept-request-before-auth | `InterceptRequestBeforeAuth`, ABI `request.intercept_before`. |  | Вызывается до выбора учётных данных. |
| plugin.request-interceptor.intercept-request-after-auth | `InterceptRequestAfterAuth`, ABI `request.intercept_after`. |  | Вызывается после выбора учётных данных. |
| RequestInterceptRequest.RequestID | ID одного выполнения модели. |  | Связан с событием завершения. |
| RequestInterceptRequest.TraceID | ID трассировки входящего HTTP. Может быть пустым. |  | Строка. |
| RequestInterceptRequest.SourceFormat | Исходный протокол клиента. |  | Строка. |
| RequestInterceptRequest.ToFormat | Выбранный протокол upstream. |  | Пуст до выбора учётных данных. |
| RequestInterceptRequest.Model | Текущая модель выполнения. |  | После выбора это модель upstream. |
| RequestInterceptRequest.RequestedModel | Модель клиента до переписывания псевдонимом или пулом моделей. |  | Строка. |
| RequestInterceptRequest.Stream | Потоковый ли запрос. |  | Логическое значение. |
| RequestInterceptRequest.Headers | Текущие заголовки запроса upstream. |  | Только для чтения. |
| RequestInterceptRequest.Body | Текущий payload. |  | Только для чтения. Изменения помещаются в `Body` ответа. |
| RequestInterceptRequest.Metadata | Снимок контекста. |  | Только для чтения, понимается как значения JSON. |
| RequestInterceptResponse.Path | Необязательный целевой путь. |  | Например `/v1/images/generations`. Пустое значение означает без изменений. |
| RequestInterceptResponse.Headers | Заменить одноимённые заголовки. |  | Неупомянутые заголовки сохраняются. |
| RequestInterceptResponse.Body | Заменить тело. |  | Замена только если непустое. |
| RequestInterceptResponse.ClearHeaders | Имена заголовков, которые удаляются сначала. |  | Удаляются до применения `Headers`. |
| RequestInterceptResponse.Terminate | Остановить последующий перехват и не допустить запрос до исполнителя. |  | При true используются три поля вниз, указанные ниже. |
| RequestInterceptResponse.StatusCode | Код состояния вниз при остановке. |  | Если меньше 200 или больше 599, меняется на 403. |
| RequestInterceptResponse.ResponseHeaders | Заголовки вниз при остановке. |  | `http.Header`. |
| RequestInterceptResponse.ResponseBody | Тело вниз при остановке. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Когда метод возвращает `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

Пустой `Body` не заменяет существующее тело. Если код состояния `Terminate` вне диапазона от 200 до 599, вниз виден 403. Результат события завершения после остановки — `rejected`. См. [Жизненный цикл запроса](/ru/plugin/request-lifecycle).

## 6. Связанные возможности

Уведомление о завершении описано в разделе [Жизненный цикл запроса](/ru/plugin/request-lifecycle). Преобразование протокола — в разделе [Преобразование запросов](/ru/plugin/request-translator).

## 7. Практический опыт

Пока нет.

