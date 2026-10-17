---
title: Нормализация ответа
feature_ids:
  - plugin.response-normalizer.normalize-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Нормализация ответа

`ResponseNormalizer` сводит payload ответа к канонической форме. До и после преобразования используется один и тот же метод.

## 1. Какую задачу решает этот раздел

До собственного преобразования плагин может свести ответ upstream к канонической форме. После преобразования и перед передачей вниз он может свести ответ ещё раз. Оба вызова используют `NormalizeResponse`.

## 2. Когда применимо и чего здесь нет

На этой странице только один метод. Старые страницы до и после преобразования больше не владеют ID возможностей. Указатели: [Нормализация ответа перед преобразованием](/ru/plugin/response-before-translator) и [Нормализация ответа после преобразования](/ru/plugin/response-after-translator). Перевод канонической формы в целевой формат — это [Преобразование ответов](/ru/plugin/response-translator).

Можно включить только один из двух слотов. Какой включён, решает логическое значение регистрации, а не другой метод Go.

## 3. Как настроить или вызвать

Для момента до преобразования задайте `response_before_translator`, для момента после — `response_after_translator`. Оба могут быть true одновременно.

```go
NormalizeResponse(context.Context, ResponseTransformRequest) (PayloadResponse, error)
```

Имена методов ABI — `response.normalize_before` и `response.normalize_after`. Структура параметров одна и та же.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.response-normalizer.normalize-response | `NormalizeResponse`. |  | Оба слота используют этот метод. |
| response.normalize_before | Имя ABI слота до преобразования. |  | Соответствует ключу регистрации `response_before_translator`. |
| response.normalize_after | Имя ABI слота после преобразования. |  | Соответствует ключу регистрации `response_after_translator`. |
| ResponseTransformRequest.FromFormat | Протокол источника. |  | Строка. |
| ResponseTransformRequest.ToFormat | Целевой протокол. |  | Строка. |
| ResponseTransformRequest.Model | ID модели. |  | Строка. |
| ResponseTransformRequest.Stream | Является ли ответ потоковым. |  | Логическое значение. |
| ResponseTransformRequest.OriginalRequest | Исходное тело запроса клиента. |  | `[]byte`. |
| ResponseTransformRequest.TranslatedRequest | Тело запроса провайдера. |  | `[]byte`. |
| ResponseTransformRequest.Body | Payload ответа для приведения. |  | `[]byte`. |
| PayloadResponse.Body | Приведённый payload. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

Отдельного типа возврата до или после преобразования нет. Результат обоих имён ABI — `PayloadResponse`.

## 6. Связанные возможности

Преобразование в целевой формат описано в разделе [Преобразование ответов](/ru/plugin/response-translator). Изменение успешного ответа — в разделе [Перехват ответов](/ru/plugin/response-interceptor).

## 7. Практический опыт

Пока нет.

