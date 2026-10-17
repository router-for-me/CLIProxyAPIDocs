---
title: Callback хоста
feature_ids:
  - plugin.host-http-client.do
  - plugin.host-http-client.do-stream
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Callback хоста

`HostHTTPClient` — публичный HTTP-клиент, который хост передаёт плагину. На этой странице только два метода, назначенные сюда.

## 1. Какую задачу решает этот раздел

Плагин отправляет непотоковые или потоковые запросы upstream через хост и тем самым следует транспортной политике хоста. Когда журнал запросов включён, исполнитель также оставляет через него исходящий запрос и исходный ответ upstream.

## 2. Когда применимо и чего здесь нет

Есть только `Do` и `DoStream`. Другие callback хоста, не назначенные этой странице, здесь не описаны. Частная реализация хоста тоже не описывается.

Точки вызова есть в структурах запроса входа по учётным данным, обновления, обнаружения моделей по учётным данным, исполнителя и запроса квоты. Имя поля всегда `HTTPClient`, а тег `json` равен `-`, поэтому в JSON запроса ABI его нет. Плагин на Go вызывает этот интерфейс напрямую.

## 3. Как настроить или вызвать

Это не возможность, которую плагин включает в `capabilities`. Это клиент, который передаёт хост.

```go
Do(context.Context, HTTPRequest) (HTTPResponse, error)
DoStream(context.Context, HTTPRequest) (HTTPStreamResponse, error)
```

Имена методов ABI — `host.http.do` и `host.http.do_stream`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.host-http-client.do | `Do`, ABI `host.http.do`. |  | Параметр `HTTPRequest`, возврат `HTTPResponse`. |
| plugin.host-http-client.do-stream | `DoStream`, ABI `host.http.do_stream`. |  | Параметр `HTTPRequest`, возврат `HTTPStreamResponse`. |
| HTTPRequest.Method | Метод HTTP. |  | Строка. |
| HTTPRequest.URL | Абсолютный адрес upstream. |  | Строка. |
| HTTPRequest.Headers | Заголовки запроса. |  | `http.Header`. |
| HTTPRequest.Body | Исходное тело. |  | `[]byte`, в JSON это base64. |
| HTTPRequest.WireProfile | Необязательное представление на проводе. |  | Пустой указатель ничего не меняет. Имя JSON `wire_profile`. |
| HTTPWireProfile.HTTP1Only | Только HTTP/1.1, без согласования HTTP/2. |  | Имя JSON `http1_only`. |
| HTTPWireProfile.DisableAutoCompression | Выключить прозрачную распаковку и автоматический `Accept-Encoding`. |  | Имя JSON `disable_auto_compression`. |
| HTTPWireProfile.HeaderProfile | Желаемый порядок и регистр имён заголовков. |  | Имя JSON `header_profile`, `[]string`. |
| HTTPResponse.StatusCode | Код состояния upstream. |  | Целое число. |
| HTTPResponse.Headers | Заголовки ответа upstream. |  | `http.Header`. |
| HTTPResponse.Body | Исходное тело ответа. |  | `[]byte`. |
| HTTPStreamResponse.StatusCode | Код состояния upstream. |  | Целое число. |
| HTTPStreamResponse.Headers | Заголовки ответа upstream. |  | `http.Header`. |
| HTTPStreamResponse.Chunks | Потоковые блоки, пока канал не закрыт. |  | Элементы — `HTTPStreamChunk`. |
| HTTPStreamChunk.Payload | Один блок исходных байтов. |  | `[]byte`. |
| HTTPStreamChunk.Err | Ошибка, приложенная к этому блоку. |  | `error`. |

## 5. Типичные ошибки и границы

Оба метода возвращают `error`. Если `http_status` в конверте ошибки ABI опущен или равен 0, он считается HTTP 500.

`URL` — абсолютный адрес. Пустой указатель `WireProfile` не добавляет конфигурацию провода. Потоковый результат доставляется через канал `Chunks`, закрытие канала означает конец.

## 6. Связанные возможности

Исполнитель должен использовать этот клиент для доступа к upstream. См. [Исполнитель](/ru/plugin/executor). Вход и обновление описаны в разделе [Провайдер учётных данных](/ru/plugin/auth-provider).

## 7. Практический опыт

Пока нет.

