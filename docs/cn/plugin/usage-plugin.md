---
outline: 'deep'
---

# 用量观察能力

用量观察能力用于在请求完成后接收用量、延迟、失败和计费相关信息。它适合接入外部统计、审计、计费或监控系统。

## 能力字段

```json
{
  "capabilities": {
    "usage_plugin": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`UsagePlugin`、`UsageRecord`、`UsageDetail`、`UsageFailure`
- `sdk/pluginabi/types.go`：`usage.handle`
- `internal/pluginhost/adapters.go`：`RegisterUsagePlugins`、`HandleUsage`

示例参考：

- `examples/plugin/usage/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodUsageHandle`

## 方法

| 方法 | 作用 |
| --- | --- |
| `usage.handle` | 接收一次完成请求的用量记录。 |

## 记录内容

`UsageRecord` 包含：

```json
{
  "Provider": "codex",
  "ExecutorType": "codex",
  "Model": "gpt-5.5",
  "Alias": "gpt-5.5",
  "APIKey": "client-key-id",
  "AuthID": "auth-1",
  "AuthIndex": "0",
  "AuthType": "oauth",
  "Source": "openai",
  "ReasoningEffort": "high",
  "ServiceTier": "priority",
  "RequestedAt": "2026-06-15T12:00:00Z",
  "Latency": 1234567890,
  "TTFT": 120000000,
  "Failed": false,
  "Detail": {
    "InputTokens": 10,
    "OutputTokens": 20,
    "ReasoningTokens": 0,
    "CachedTokens": 0,
    "TotalTokens": 30
  },
  "ResponseHeaders": {}
}
```

失败请求会带有 `Failed: true` 和 `Failure`：

```json
{
  "Failure": {
    "StatusCode": 429,
    "Body": "rate limited"
  }
}
```

## 开发注意

- 用量插件应快速返回，避免阻塞请求完成路径。
- 如果要写外部系统，建议内部做缓冲或异步发送。
- 不要泄露客户端 API key、上游 token 或完整敏感响应体。
- 用量观察是旁路能力，不应改变请求或响应。

