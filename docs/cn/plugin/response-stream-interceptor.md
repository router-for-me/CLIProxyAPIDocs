---
outline: 'deep'
---

# 流式响应拦截能力

流式响应拦截能力用于在 SSE 或其他流式响应 chunk 发给客户端前改写、丢弃 chunk，或调整流式响应头。

## 能力字段

```json
{
  "capabilities": {
    "response_stream_interceptor": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`StreamChunkInterceptor`、`StreamChunkInterceptRequest`、`StreamChunkInterceptResponse`
- `sdk/pluginabi/types.go`：`response.intercept_stream_chunk`
- `internal/pluginhost/adapters.go`：`InterceptStreamChunk`

示例参考：

- `internal/pluginhost/adapters_test.go`：流式 chunk 历史、丢弃 chunk 和 header 初始化测试

## 方法

| 方法 | 作用 |
| --- | --- |
| `response.intercept_stream_chunk` | 改写流式响应的 header 初始化或单个 payload chunk。 |

## 请求

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

`ChunkIndex` 从 `0` 开始。`-1` 表示 header-only 初始化调用，此时可先调整响应头。

## 响应

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

语义：

- `Body` 非空时替换当前 chunk。
- `DropChunk: true` 会跳过当前 payload chunk，且不会写入后续 `HistoryChunks`。
- 即使丢弃 chunk，返回的 header 修改仍会应用。

## 历史窗口

`HistoryChunks` 是宿主保留的近期 chunk 快照，目前最多保留 64 个 chunk 和 1 MiB 历史字节。插件不能依赖它包含完整流历史。

## 开发注意

- 不要在每个 chunk 上做高延迟外部请求。
- 对 SSE 数据要保持协议边界，不要破坏 `data:`、空行和终止 chunk。
- 通过 `host_callback_id` 发起的宿主模型回调会跳过来源插件自己的流式拦截器。

