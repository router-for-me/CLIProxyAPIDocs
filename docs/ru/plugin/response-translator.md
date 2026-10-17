---
title: Преобразование ответов
feature_ids:
  - plugin.response-translator.translate-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Преобразование ответов

`ResponseTranslator` преобразует payload ответа в канонической форме в другой формат.

## 1. Какую задачу решает этот раздел

Плагин одновременно видит исходный запрос клиента, уже преобразованный запрос провайдера и тело ответа, которое нужно преобразовать, и возвращает байты целевого формата.

## 2. Когда применимо и чего здесь нет

Есть только `TranslateResponse`. Сведение к канонической форме делает [Нормализация ответа](/ru/plugin/response-normalizer). До и после преобразования — это два слота регистрации, а не два интерфейса. Повторное изменение успешного ответа описано в разделе [Перехват ответов](/ru/plugin/response-interceptor).

## 3. Как настроить или вызвать

Задайте `capabilities.response_translator` равным true.

```go
TranslateResponse(context.Context, ResponseTransformRequest) (PayloadResponse, error)
```

Имя метода ABI — `response.translate`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.response-translator.translate-response | `TranslateResponse`, ABI `response.translate`. |  | Параметр `ResponseTransformRequest`, возврат `PayloadResponse`. |
| ResponseTransformRequest.FromFormat | Протокол источника. |  | Строка. |
| ResponseTransformRequest.ToFormat | Целевой протокол. |  | Строка. |
| ResponseTransformRequest.Model | ID модели. |  | Строка. |
| ResponseTransformRequest.Stream | Является ли ответ потоковым. |  | Логическое значение. |
| ResponseTransformRequest.OriginalRequest | Исходное тело запроса клиента. |  | `[]byte`. |
| ResponseTransformRequest.TranslatedRequest | Тело запроса провайдера. |  | `[]byte`. |
| ResponseTransformRequest.Body | Payload ответа для преобразования. |  | `[]byte`. |
| PayloadResponse.Body | Преобразованный payload. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500. Этот метод не меняет код состояния.

## 6. Связанные возможности

Один и тот же интерфейс приведения до и после преобразования описан в разделе [Нормализация ответа](/ru/plugin/response-normalizer).

## 7. Практический опыт

Пока нет.

