---
outline: 'deep'
---

# Возможность перехвата стриминговых ответов

Возможность перехвата стриминговых ответов изменяет или отбрасывает SSE и другие streaming response chunk перед отправкой клиенту, а также может изменять заголовки стримингового ответа.

## Поле возможности

```json
{
  "capabilities": {
    "response_stream_interceptor": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `StreamChunkInterceptor`, `StreamChunkInterceptRequest`, `StreamChunkInterceptResponse`
- `sdk/pluginabi/types.go`: `response.intercept_stream_chunk`
- `internal/pluginhost/adapters.go`: `InterceptStreamChunk`

Пример:

- `internal/pluginhost/adapters_test.go`: тесты истории stream chunk, отбрасывания chunk и инициализации header

## Методы

| Метод | Назначение |
| --- | --- |
| `response.intercept_stream_chunk` | Изменяет инициализацию header стримингового ответа или отдельный payload chunk. |

## Запрос

```json
{
  "SourceFormat": "chat-completions",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "RequestHeaders": {},
  "ResponseHeaders": {},
  "OriginalRequest": "base64-client-body",
  "RequestBody": "base64-upstream-request",
  "Body": "base64-current-chunk",
  "HistoryChunks": ["base64-previous-chunk"],
  "ChunkIndex": 0,
  "Metadata": {}
}
```

`ChunkIndex` начинается с `0`. `-1` означает вызов только для инициализации header; в этот момент можно сначала изменить response header.

## Ответ

```json
{
  "Headers": {
    "X-Stream-Plugin": ["example"]
  },
  "Body": "base64-new-chunk",
  "ClearHeaders": ["X-Old-Header"],
  "DropChunk": false
}
```

Семантика:

- Непустой `Body` заменяет текущий chunk.
- `DropChunk: true` пропускает текущий payload chunk и не записывает его в последующие `HistoryChunks`.
- Изменения header применяются даже при отбрасывании chunk.

## Окно истории

`HistoryChunks` — снимок недавних chunk, сохраняемый хостом. Сейчас хранится максимум 64 chunk и 1 MiB байтов истории. Плагин не должен рассчитывать, что там есть полная история потока.

## Замечания по разработке

- Не выполняйте внешние запросы с высокой задержкой на каждом chunk.
- Сохраняйте границы протокола SSE; не ломайте `data:`, пустые строки и завершающие chunk.
- Callback моделей хоста, запущенные с `host_callback_id`, пропускают собственные streaming interceptor плагина-источника.

