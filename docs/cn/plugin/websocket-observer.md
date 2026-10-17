---
title: WebSocket 响应观察
feature_ids:
  - plugin.websocket-response-observer.observe-web-socket-response-event
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# WebSocket 响应观察

`WebSocketResponseObserver` 在执行期间观察上游 WebSocket 响应事件。

## 1. 这段解决什么问题

插件收到一条上游事件的类型、载荷和当时的模型、凭证标签，用于观察。它不替换交给下游的字节。

## 2. 适用条件与不做的事

只有 `ObserveWebSocketResponseEvent`。HTTP 流式块不是本接口。契约版本 4 起才支持该观察。当前 `SchemaVersion` 是 6，已包含它。低于 4 的登记得不到这一调用。

## 3. 怎么配置或怎么调用

`capabilities.websocket_response_observer` 设为 true。

```go
ObserveWebSocketResponseEvent(context.Context, WebSocketResponseEvent) error
```

ABI 方法名是 `websocket.response_event`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.websocket-response-observer.observe-web-socket-response-event | `ObserveWebSocketResponseEvent`，ABI `websocket.response_event`。 |  | 参数 `WebSocketResponseEvent`，只返回 `error`。 |
| WebSocketResponseEvent.RequestID | 执行 ID。 |  | 字符串。 |
| WebSocketResponseEvent.TraceID | 追踪 ID。 |  | 字符串。 |
| WebSocketResponseEvent.SourceFormat | 客户端协议。 |  | 字符串。 |
| WebSocketResponseEvent.Model | 执行模型。 |  | 字符串。 |
| WebSocketResponseEvent.RequestedModel | 客户端请求的模型。 |  | 字符串。 |
| WebSocketResponseEvent.Provider | 上游提供方。 |  | 字符串。 |
| WebSocketResponseEvent.AuthID | 凭证 ID。 |  | 字符串。 |
| WebSocketResponseEvent.AuthLabel | 凭证显示名。 |  | 字符串。 |
| WebSocketResponseEvent.AuthType | 凭证类型。 |  | 字符串。 |
| WebSocketResponseEvent.EventType | 事件类型。 |  | 字符串。 |
| WebSocketResponseEvent.Payload | 事件载荷。 |  | `[]byte`，JSON 中为 base64。 |
| WebSocketResponseEvent.Metadata | 附加数据。 |  | `map[string]any`。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

返回值没有替换后的载荷。要改 HTTP 流式块，使用流式拦截，而不是本方法。

## 6. 相关功能

HTTP 流见 [流式响应拦截](/cn/plugin/response-stream-interceptor)。

## 7. 使用经验

暂无
