---
title: WebSocket Response Observer
feature_ids:
  - plugin.websocket-response-observer.observe-web-socket-response-event
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# WebSocket Response Observer

`WebSocketResponseObserver` observes upstream WebSocket response events during execution.

## 1. What this solves

The plugin receives the type and payload of one upstream event, plus the model and credential label at that time, for observation. It does not replace the bytes handed downstream.

## 2. Scope and non-goals

There is only `ObserveWebSocketResponseEvent`. An HTTP streaming chunk is not this interface. The observation is supported from contract version 4. The current `SchemaVersion` is 6, so it is included. A registration below 4 does not receive this call.

## 3. How to configure or call it

Set `capabilities.websocket_response_observer` to true.

```go
ObserveWebSocketResponseEvent(context.Context, WebSocketResponseEvent) error
```

The ABI method name is `websocket.response_event`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.websocket-response-observer.observe-web-socket-response-event | `ObserveWebSocketResponseEvent`, ABI `websocket.response_event`. |  | Parameter `WebSocketResponseEvent`. Returns only `error`. |
| WebSocketResponseEvent.RequestID | Execution ID. |  | String. |
| WebSocketResponseEvent.TraceID | Trace ID. |  | String. |
| WebSocketResponseEvent.SourceFormat | Client protocol. |  | String. |
| WebSocketResponseEvent.Model | Execution model. |  | String. |
| WebSocketResponseEvent.RequestedModel | Model requested by the client. |  | String. |
| WebSocketResponseEvent.Provider | Upstream provider. |  | String. |
| WebSocketResponseEvent.AuthID | Credential ID. |  | String. |
| WebSocketResponseEvent.AuthLabel | Credential display name. |  | String. |
| WebSocketResponseEvent.AuthType | Credential type. |  | String. |
| WebSocketResponseEvent.EventType | Event type. |  | String. |
| WebSocketResponseEvent.Payload | Event payload. |  | `[]byte`, base64 in JSON. |
| WebSocketResponseEvent.Metadata | Extra data. |  | `map[string]any`. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

The return value has no replacement payload. To change an HTTP streaming chunk, use the streaming interceptor, not this method.

## 6. Related behavior

HTTP streams are in [Streaming Response Interceptor](/plugin/response-stream-interceptor).

## 7. Field experience

None yet.

