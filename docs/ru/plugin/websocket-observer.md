---
title: Наблюдатель WebSocket-ответа
feature_ids:
  - plugin.websocket-response-observer.observe-web-socket-response-event
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Наблюдатель WebSocket-ответа

`WebSocketResponseObserver` во время выполнения наблюдает события ответа WebSocket upstream.

## 1. Какую задачу решает этот раздел

Плагин получает тип и payload одного события upstream, а также модель и метку учётных данных в этот момент. Это наблюдение. Он не заменяет байты, передаваемые вниз.

## 2. Когда применимо и чего здесь нет

Есть только `ObserveWebSocketResponseEvent`. Блок HTTP-потока — не этот интерфейс. Наблюдение поддерживается с версии контракта 4. Текущий `SchemaVersion` равен 6, поэтому оно включено. Регистрация ниже 4 этот вызов не получает.

## 3. Как настроить или вызвать

Задайте `capabilities.websocket_response_observer` равным true.

```go
ObserveWebSocketResponseEvent(context.Context, WebSocketResponseEvent) error
```

Имя метода ABI — `websocket.response_event`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.websocket-response-observer.observe-web-socket-response-event | `ObserveWebSocketResponseEvent`, ABI `websocket.response_event`. |  | Параметр `WebSocketResponseEvent`, возвращается только `error`. |
| WebSocketResponseEvent.RequestID | ID выполнения. |  | Строка. |
| WebSocketResponseEvent.TraceID | ID трассировки. |  | Строка. |
| WebSocketResponseEvent.SourceFormat | Протокол клиента. |  | Строка. |
| WebSocketResponseEvent.Model | Модель выполнения. |  | Строка. |
| WebSocketResponseEvent.RequestedModel | Модель, запрошенная клиентом. |  | Строка. |
| WebSocketResponseEvent.Provider | Провайдер upstream. |  | Строка. |
| WebSocketResponseEvent.AuthID | ID учётных данных. |  | Строка. |
| WebSocketResponseEvent.AuthLabel | Отображаемое имя учётных данных. |  | Строка. |
| WebSocketResponseEvent.AuthType | Тип учётных данных. |  | Строка. |
| WebSocketResponseEvent.EventType | Тип события. |  | Строка. |
| WebSocketResponseEvent.Payload | Payload события. |  | `[]byte`, в JSON это base64. |
| WebSocketResponseEvent.Metadata | Дополнительные данные. |  | `map[string]any`. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

В возвращаемом значении нет заменяющего payload. Чтобы изменить блок HTTP-потока, используйте перехват потока, а не этот метод.

## 6. Связанные возможности

HTTP-поток описан в разделе [Перехват стриминговых ответов](/ru/plugin/response-stream-interceptor).

## 7. Практический опыт

Пока нет.

