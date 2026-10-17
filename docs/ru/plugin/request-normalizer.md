---
title: Приведение запроса
feature_ids:
  - plugin.request-normalizer.normalize-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Приведение запроса

`RequestNormalizer` сводит payload запроса, специфичный для провайдера, к канонической форме.

## 1. Какую задачу решает этот раздел

Плагин получает формат источника, целевой формат, модель, потоковый ли ответ и тело, и возвращает байты канонического payload.

## 2. Когда применимо и чего здесь нет

Есть только `NormalizeRequest`. Перевод канонической формы в формат провайдера — это [Преобразование запроса](/ru/plugin/request-translator). Приведение ответа — другой интерфейс.

## 3. Как настроить или вызвать

Задайте `capabilities.request_normalizer` равным true.

```go
NormalizeRequest(context.Context, RequestTransformRequest) (PayloadResponse, error)
```

Имя метода ABI — `request.normalize`. Параметры и возвращаемое значение используют ту же пару структур, что и преобразование запроса.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.request-normalizer.normalize-request | `NormalizeRequest`, ABI `request.normalize`. |  | Параметр `RequestTransformRequest`, возврат `PayloadResponse`. |
| RequestTransformRequest.FromFormat | Протокол источника. |  | Строка. |
| RequestTransformRequest.ToFormat | Целевой протокол. |  | Строка. |
| RequestTransformRequest.Model | ID модели. |  | Строка. |
| RequestTransformRequest.Stream | Ожидается ли потоковый вывод. |  | Логическое значение. |
| RequestTransformRequest.Body | Payload для приведения. |  | `[]byte`. |
| PayloadResponse.Body | Приведённый payload. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

## 6. Связанные возможности

Обратный вывод канонической формы описан в разделе [Преобразование запроса](/ru/plugin/request-translator).

## 7. Практический опыт

Пока нет.
