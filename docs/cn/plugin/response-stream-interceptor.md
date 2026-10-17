---
title: 流式响应拦截
feature_ids:
  - plugin.stream-chunk-interceptor.intercept-stream-chunk
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 流式响应拦截

`StreamChunkInterceptor` 在成功的 HTTP 流式块交给下游之前改写它们。

## 1. 这段解决什么问题

插件先收到一次只有头的初始化调用，再逐块改写、丢弃或替换载荷。

## 2. 适用条件与不做的事

不处理非流式整包，那是 [响应拦截](/cn/plugin/response-interceptor)。不观察 WebSocket。

`StreamChunkHeaderInitIndex` 是 -1，表示头初始化，此时还没有载荷块。载荷块的 `ChunkIndex` 从 0 起。

## 3. 怎么配置或怎么调用

登记键是 `response_stream_interceptor`。

```go
InterceptStreamChunk(context.Context, StreamChunkInterceptRequest) (StreamChunkInterceptResponse, error)
```

ABI 方法名是 `response.intercept_stream_chunk`。

契约版本影响载荷块上的字段，头初始化调用不受这两条省略规则影响：

- `schema_version` 大于等于 3 时，载荷块不再带 `OriginalRequest` 和 `RequestBody`。更低版本每次都给一份新的副本。
- `schema_version` 大于等于 5 时，载荷块不再带 `HistoryChunks`。更低版本每次都给一份新的副本。

当前 `SchemaVersion` 是 6，因此载荷块省略这两类字段。需要它们的插件应保持低于对应版本。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.stream-chunk-interceptor.intercept-stream-chunk | `InterceptStreamChunk`，ABI `response.intercept_stream_chunk`。 |  | 参数 `StreamChunkInterceptRequest`，返回 `StreamChunkInterceptResponse`。 |
| StreamChunkInterceptRequest.RequestID | 执行 ID。 |  | 字符串。 |
| StreamChunkInterceptRequest.SourceFormat | 客户端协议。 |  | 字符串。 |
| StreamChunkInterceptRequest.Model | 执行模型。 |  | 字符串。 |
| StreamChunkInterceptRequest.RequestedModel | 客户端请求的模型。 |  | 字符串。 |
| StreamChunkInterceptRequest.RequestHeaders | 请求头。 |  | `http.Header`。 |
| StreamChunkInterceptRequest.ResponseHeaders | 当前流响应头。 |  | `http.Header`。 |
| StreamChunkInterceptRequest.OriginalRequest | 原始客户端正文。 |  | 头初始化始终有一份新副本。载荷块在契约 3 及以上为 nil。只读。 |
| StreamChunkInterceptRequest.RequestBody | 实际执行的请求载荷。 |  | 与 `OriginalRequest` 同一套版本规则。只读。 |
| StreamChunkInterceptRequest.Body | 当前块正文。 |  | `[]byte`。 |
| StreamChunkInterceptRequest.HistoryChunks | 已经交给下游的近期块。 |  | 最多 64 块，且总字节不超过 1 MiB。头初始化在非空时保留。载荷块在契约 5 及以上为 nil。只读。 |
| StreamChunkInterceptRequest.ChunkIndex | 块序号。 |  | 载荷从 0 起。-1 是头初始化。 |
| StreamChunkInterceptRequest.Metadata | 上下文快照。 |  | 只读，按 JSON 值理解。 |
| StreamChunkInterceptResponse.Headers | 替换同名流头。 |  | 未提到的头保留。 |
| StreamChunkInterceptResponse.Body | 替换当前块。 |  | 只有非空时才替换。 |
| StreamChunkInterceptResponse.ClearHeaders | 先删除的头。 |  | 在 `Headers` 应用之前删除。 |
| StreamChunkInterceptResponse.DropChunk | 不把当前载荷块交给下游。 |  | 被丢弃的块不进入 `HistoryChunks`。同一次返回里的头更新仍然生效。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

空 `Body` 不替换当前块。`DropChunk` 只跳过载荷块的下发。把请求正文或历史缓存在插件侧时，只能使用头初始化那一次，不能指望契约 6 的每个载荷块还带着它们。

## 6. 相关功能

非流式成功响应见 [响应拦截](/cn/plugin/response-interceptor)。WebSocket 帧见 [WebSocket 响应观察](/cn/plugin/websocket-observer)。

## 7. 使用经验

暂无
