---
title: Перехват стриминговых ответов
feature_ids:
  - plugin.stream-chunk-interceptor.intercept-stream-chunk
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Перехват стриминговых ответов

`StreamChunkInterceptor` переписывает успешные блоки HTTP-потока до передачи вниз.

## 1. Какую задачу решает этот раздел

Плагин сначала получает один вызов инициализации только с заголовками, затем по блокам переписывает, отбрасывает или заменяет payload.

## 2. Когда применимо и чего здесь нет

Целый непотоковый пакет он не обрабатывает. Это [Перехват ответов](/ru/plugin/response-interceptor). WebSocket он не наблюдает.

`StreamChunkHeaderInitIndex` равен -1 и означает инициализацию заголовков, когда блока payload ещё нет. У блоков payload `ChunkIndex` начинается с 0.

## 3. Как настроить или вызвать

Ключ регистрации — `response_stream_interceptor`.

```go
InterceptStreamChunk(context.Context, StreamChunkInterceptRequest) (StreamChunkInterceptResponse, error)
```

Имя метода ABI — `response.intercept_stream_chunk`.

Версия контракта влияет на поля блоков payload. Вызов инициализации заголовков этими двумя правилами пропуска не затрагивается:

- Когда `schema_version` больше или равен 3, блоки payload больше не несут `OriginalRequest` и `RequestBody`. Более низкие версии каждый раз дают новую копию.
- Когда `schema_version` больше или равен 5, блоки payload больше не несут `HistoryChunks`. Более низкие версии каждый раз дают новую копию.

Текущий `SchemaVersion` равен 6, поэтому блоки payload опускают оба вида полей. Плагину, которому они нужны, следует оставаться ниже соответствующей версии.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.stream-chunk-interceptor.intercept-stream-chunk | `InterceptStreamChunk`, ABI `response.intercept_stream_chunk`. |  | Параметр `StreamChunkInterceptRequest`, возврат `StreamChunkInterceptResponse`. |
| StreamChunkInterceptRequest.RequestID | ID выполнения. |  | Строка. |
| StreamChunkInterceptRequest.SourceFormat | Протокол клиента. |  | Строка. |
| StreamChunkInterceptRequest.Model | Модель выполнения. |  | Строка. |
| StreamChunkInterceptRequest.RequestedModel | Модель, запрошенная клиентом. |  | Строка. |
| StreamChunkInterceptRequest.RequestHeaders | Заголовки запроса. |  | `http.Header`. |
| StreamChunkInterceptRequest.ResponseHeaders | Текущие заголовки потокового ответа. |  | `http.Header`. |
| StreamChunkInterceptRequest.OriginalRequest | Исходное тело клиента. |  | Инициализация заголовков всегда имеет новую копию. У блоков payload при контракте 3 и выше значение nil. Только для чтения. |
| StreamChunkInterceptRequest.RequestBody | Фактически выполненный payload запроса. |  | То же правило версии, что у `OriginalRequest`. Только для чтения. |
| StreamChunkInterceptRequest.Body | Тело текущего блока. |  | `[]byte`. |
| StreamChunkInterceptRequest.HistoryChunks | Недавние блоки, уже переданные вниз. |  | Не больше 64 блоков, и суммарные байты не превышают 1 MiB. Инициализация заголовков сохраняет их, если они непусты. У блоков payload при контракте 5 и выше значение nil. Только для чтения. |
| StreamChunkInterceptRequest.ChunkIndex | Номер блока. |  | Payload начинается с 0. -1 — инициализация заголовков. |
| StreamChunkInterceptRequest.Metadata | Снимок контекста. |  | Только для чтения, понимается как значения JSON. |
| StreamChunkInterceptResponse.Headers | Заменить одноимённые заголовки потока. |  | Неупомянутые заголовки сохраняются. |
| StreamChunkInterceptResponse.Body | Заменить текущий блок. |  | Замена только если непустой. |
| StreamChunkInterceptResponse.ClearHeaders | Заголовки, которые удаляются сначала. |  | Удаляются до применения `Headers`. |
| StreamChunkInterceptResponse.DropChunk | Не передавать текущий блок payload вниз. |  | Отброшенный блок не входит в `HistoryChunks`. Обновления заголовков в том же возврате всё равно действуют. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

Пустой `Body` не заменяет текущий блок. `DropChunk` только пропускает выдачу блока payload. Если плагин кэширует тело запроса или историю на своей стороне, он может использовать только вызов инициализации заголовков. Нельзя ожидать, что каждый блок payload контракта 6 всё ещё несёт их.

## 6. Связанные возможности

Успешный непотоковый ответ описан в разделе [Перехват ответов](/ru/plugin/response-interceptor). Кадры WebSocket — в разделе [Наблюдатель WebSocket-ответа](/ru/plugin/websocket-observer).

## 7. Практический опыт

Пока нет.

