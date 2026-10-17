---
title: Streaming Response Interceptor
feature_ids:
  - plugin.stream-chunk-interceptor.intercept-stream-chunk
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Streaming Response Interceptor

`StreamChunkInterceptor` rewrites successful HTTP streaming chunks before they are handed downstream.

## 1. What this solves

The plugin first receives one initialization call that has only headers, then rewrites, drops, or replaces the payload chunk by chunk.

## 2. Scope and non-goals

It does not handle a non-streaming whole body. That is [Response Interceptor](/plugin/response-interceptor). It does not observe WebSocket.

`StreamChunkHeaderInitIndex` is -1 and means header initialization, when there is not yet a payload chunk. Payload chunks have `ChunkIndex` starting at 0.

## 3. How to configure or call it

The registration key is `response_stream_interceptor`.

```go
InterceptStreamChunk(context.Context, StreamChunkInterceptRequest) (StreamChunkInterceptResponse, error)
```

The ABI method name is `response.intercept_stream_chunk`.

The contract version affects fields on payload chunks. The header-initialization call is not affected by these two omission rules:

- When `schema_version` is greater than or equal to 3, payload chunks no longer carry `OriginalRequest` and `RequestBody`. Lower versions give a fresh copy every time.
- When `schema_version` is greater than or equal to 5, payload chunks no longer carry `HistoryChunks`. Lower versions give a fresh copy every time.

The current `SchemaVersion` is 6, so payload chunks omit both kinds of fields. A plugin that needs them should stay below the matching version.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.stream-chunk-interceptor.intercept-stream-chunk | `InterceptStreamChunk`, ABI `response.intercept_stream_chunk`. |  | Parameter `StreamChunkInterceptRequest`, return `StreamChunkInterceptResponse`. |
| StreamChunkInterceptRequest.RequestID | Execution ID. |  | String. |
| StreamChunkInterceptRequest.SourceFormat | Client protocol. |  | String. |
| StreamChunkInterceptRequest.Model | Execution model. |  | String. |
| StreamChunkInterceptRequest.RequestedModel | Model requested by the client. |  | String. |
| StreamChunkInterceptRequest.RequestHeaders | Request headers. |  | `http.Header`. |
| StreamChunkInterceptRequest.ResponseHeaders | Current stream response headers. |  | `http.Header`. |
| StreamChunkInterceptRequest.OriginalRequest | Original client body. |  | Header initialization always has a fresh copy. Payload chunks are nil at contract 3 and above. Read-only. |
| StreamChunkInterceptRequest.RequestBody | Request payload that was actually executed. |  | The same version rule as `OriginalRequest`. Read-only. |
| StreamChunkInterceptRequest.Body | Current chunk body. |  | `[]byte`. |
| StreamChunkInterceptRequest.HistoryChunks | Recent chunks already handed downstream. |  | At most 64 chunks, and the total bytes do not exceed 1 MiB. Header initialization keeps them when non-empty. Payload chunks are nil at contract 5 and above. Read-only. |
| StreamChunkInterceptRequest.ChunkIndex | Chunk index. |  | Payloads start at 0. -1 is header initialization. |
| StreamChunkInterceptRequest.Metadata | Context snapshot. |  | Read-only, understood as JSON values. |
| StreamChunkInterceptResponse.Headers | Replace stream headers of the same name. |  | Headers not mentioned are kept. |
| StreamChunkInterceptResponse.Body | Replace the current chunk. |  | Replaced only when non-empty. |
| StreamChunkInterceptResponse.ClearHeaders | Headers to delete first. |  | Deleted before `Headers` is applied. |
| StreamChunkInterceptResponse.DropChunk | Do not hand the current payload chunk downstream. |  | A dropped chunk does not enter `HistoryChunks`. Header updates in the same return still take effect. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

An empty `Body` does not replace the current chunk. `DropChunk` only skips delivery of a payload chunk. If the plugin caches the request body or history on its own side, it can use only the header-initialization call. It cannot expect every payload chunk of contract 6 to still carry them.

## 6. Related behavior

A successful non-streaming response is in [Response Interceptor](/plugin/response-interceptor). WebSocket frames are in [WebSocket Response Observer](/plugin/websocket-observer).

## 7. Field experience

None yet.

