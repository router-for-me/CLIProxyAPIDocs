---
title: Преобразование запроса
feature_ids:
  - plugin.request-translator.translate-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Преобразование запроса

`RequestTranslator` преобразует payload запроса, который уже в канонической форме, в другой формат.

## 1. Какую задачу решает этот раздел

По формату источника, целевому формату, модели, потоковому ли ответу и телу плагин возвращает преобразованные исходные байты.

## 2. Когда применимо и чего здесь нет

Есть только `TranslateRequest`. Сведение запроса провайдера к канонической форме — это [Приведение запроса](/ru/plugin/request-normalizer), а не этот интерфейс. Ответы здесь не описаны.

## 3. Как настроить или вызвать

Задайте `capabilities.request_translator` равным true.

```go
TranslateRequest(context.Context, RequestTransformRequest) (PayloadResponse, error)
```

Имя метода ABI — `request.translate`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.request-translator.translate-request | `TranslateRequest`, ABI `request.translate`. |  | Параметр `RequestTransformRequest`, возврат `PayloadResponse`. |
| RequestTransformRequest.FromFormat | Протокол источника. |  | Строка. |
| RequestTransformRequest.ToFormat | Целевой протокол. |  | Строка. |
| RequestTransformRequest.Model | ID модели. |  | Строка. |
| RequestTransformRequest.Stream | Ожидается ли потоковый вывод. |  | Логическое значение. |
| RequestTransformRequest.Body | Payload для преобразования. |  | `[]byte`, в JSON это base64. |
| PayloadResponse.Body | Преобразованный payload. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500. Этот метод не меняет учётные данные и не прекращает запрос.

## 6. Связанные возможности

Обратное сведение к канонической форме описано в разделе [Приведение запроса](/ru/plugin/request-normalizer). Переписывание запроса, который вот-вот будет отправлен, — в разделе [Перехват запроса](/ru/plugin/request-interceptor).

## 7. Практический опыт

Пока нет.
