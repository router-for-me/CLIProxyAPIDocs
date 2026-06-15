---
outline: 'deep'
---

# Streaming Response Interceptor Capability

The streaming response interceptor capability rewrites or drops SSE and other streaming response chunks before they are sent to the client, and can also adjust streaming response headers.

## Capability Field

```json
{
  "capabilities": {
    "response_stream_interceptor": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `StreamChunkInterceptor`, `StreamChunkInterceptRequest`, `StreamChunkInterceptResponse`
- `sdk/pluginabi/types.go`: `response.intercept_stream_chunk`
- `internal/pluginhost/adapters.go`: `InterceptStreamChunk`

Example reference:

- `internal/pluginhost/adapters_test.go`: tests for stream chunk history, dropping chunks, and header initialization

## Methods

| Method | Purpose |
| --- | --- |
| `response.intercept_stream_chunk` | Rewrites streaming response header initialization or a single payload chunk. |

## Request

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

`ChunkIndex` starts at `0`. `-1` means a header-only initialization call, where the response headers can be adjusted before payload chunks are handled.

## Response

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

Semantics:

- A non-empty `Body` replaces the current chunk.
- `DropChunk: true` skips the current payload chunk and prevents it from being written into later `HistoryChunks`.
- Header changes are still applied even when a chunk is dropped.

## History Window

`HistoryChunks` is a recent chunk snapshot retained by the host. It currently keeps up to 64 chunks and 1 MiB of history bytes. A plugin cannot depend on it containing the full stream history.

## Development Notes

- Do not make high-latency external requests for every chunk.
- Preserve SSE protocol boundaries; do not break `data:`, blank lines, or terminal chunks.
- Host model callbacks started with `host_callback_id` skip the originating plugin's own streaming interceptors.

