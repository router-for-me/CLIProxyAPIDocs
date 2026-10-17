---
title: Перехват ответов
feature_ids:
  - plugin.response-interceptor.intercept-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Перехват ответов

`ResponseInterceptor` переписывает успешный непотоковый результат HTTP-выполнения до передачи вниз.

## 1. Какую задачу решает этот раздел

Плагин может заменить одноимённые заголовки ответа, удалить указанные заголовки или заменить тело, если тело непустое.

## 2. Когда применимо и чего здесь нет

Обрабатывается только успешный непотоковый ответ. Потоковые блоки описаны в разделе [Перехват стриминговых ответов](/ru/plugin/response-stream-interceptor). Кадры WebSocket он не наблюдает.

## 3. Как настроить или вызвать

Задайте `capabilities.response_interceptor` равным true.

```go
InterceptResponse(context.Context, ResponseInterceptRequest) (ResponseInterceptResponse, error)
```

Имя метода ABI — `response.intercept_after`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.response-interceptor.intercept-response | `InterceptResponse`, ABI `response.intercept_after`. |  | Параметр `ResponseInterceptRequest`, возврат `ResponseInterceptResponse`. |
| ResponseInterceptRequest.RequestID | ID выполнения. |  | Строка. |
| ResponseInterceptRequest.SourceFormat | Протокол клиента. |  | Строка. |
| ResponseInterceptRequest.Model | Модель выполнения. |  | Строка. |
| ResponseInterceptRequest.RequestedModel | Модель, запрошенная клиентом. |  | Строка. |
| ResponseInterceptRequest.Stream | Помечен ли запрос как потоковый. |  | Этот интерфейс всё равно переписывает только успешный непотоковый результат. |
| ResponseInterceptRequest.RequestHeaders | Заголовки запроса. |  | `http.Header`. |
| ResponseInterceptRequest.ResponseHeaders | Текущие заголовки ответа. |  | `http.Header`. |
| ResponseInterceptRequest.OriginalRequest | Исходное тело клиента. |  | `[]byte`. |
| ResponseInterceptRequest.RequestBody | Фактически выполненный payload запроса. |  | `[]byte`. |
| ResponseInterceptRequest.Body | Текущее тело ответа. |  | `[]byte`. |
| ResponseInterceptRequest.StatusCode | Текущий код состояния. |  | Целое число. Это возвращаемое значение не может изменить код состояния. |
| ResponseInterceptRequest.Metadata | Снимок контекста. |  | Только для чтения, понимается как значения JSON. |
| ResponseInterceptResponse.Headers | Заменить одноимённые заголовки ответа. |  | Неупомянутые заголовки сохраняются. |
| ResponseInterceptResponse.Body | Заменить тело. |  | Замена только если непустое. |
| ResponseInterceptResponse.ClearHeaders | Заголовки ответа, которые удаляются сначала. |  | Удаляются до применения `Headers`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

Пустой `Body` не заменяет существующее тело. У возвращаемого значения нет поля кода состояния.

## 6. Связанные возможности

Потоковые блоки описаны в разделе [Перехват стриминговых ответов](/ru/plugin/response-stream-interceptor). Преобразование протокола — в разделе [Преобразование ответов](/ru/plugin/response-translator).

## 7. Практический опыт

Пока нет.

