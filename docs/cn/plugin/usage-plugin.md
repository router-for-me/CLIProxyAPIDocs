---
title: 用量观察
feature_ids:
  - plugin.usage-plugin.handle-usage
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 用量观察

`UsagePlugin` 在请求完成后接收一条用量记录。

## 1. 这段解决什么问题

插件拿到本次执行的模型、凭证、延迟、失败信息和 token 计数，用于自己的统计。

## 2. 适用条件与不做的事

`HandleUsage` 没有 `error` 返回值，不能用返回错误拒绝记录。它也不改写已经产生的响应。终态通知见 [请求生命周期](/cn/plugin/request-lifecycle)，那是另一个接口。

## 3. 怎么配置或怎么调用

`capabilities.usage_plugin` 设为 true。

```go
HandleUsage(context.Context, UsageRecord)
```

ABI 方法名是 `usage.handle`。无标签字段用 Go 导出名。`time.Time` 为 RFC3339，`time.Duration` 为纳秒整数。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.usage-plugin.handle-usage | `HandleUsage`，ABI `usage.handle`。 |  | 参数 `UsageRecord`。无返回值。 |
| UsageRecord.RequestID | 这一次模型执行的 ID。 |  | UUID v4 字符串。 |
| UsageRecord.TraceID | 入站 HTTP 追踪 ID。 |  | 8 位十六进制，可空。 |
| UsageRecord.Provider | 上游提供方。 |  | 字符串。 |
| UsageRecord.BaseURL | 该次请求或凭证上的上游基址。 |  | 可空。 |
| UsageRecord.ExecutorType | 执行器实现名。 |  | 字符串。 |
| UsageRecord.Model | 实际使用的模型。 |  | 字符串。 |
| UsageRecord.Alias | 用户侧别名。 |  | 未使用别名时可空。 |
| UsageRecord.APIKey | 客户端密钥标识。 |  | 可空。不是密钥原文的保证字段，按宿主给出的标识理解。 |
| UsageRecord.IsNativeKey | 是否由本代理原生配置提供方认证。 |  | 布尔。 |
| UsageRecord.AccessProvider | 客户端认证提供方。 |  | 例如 `config-inline` 或插件 ID。 |
| UsageRecord.SessionID | 会话 ID。 |  | 可空。 |
| UsageRecord.ParentSessionID | 父会话 ID。 |  | 可空。 |
| UsageRecord.AuthID | 选中的凭证 ID。 |  | 字符串。 |
| UsageRecord.AuthIndex | 凭证索引。 |  | 可空。 |
| UsageRecord.AuthType | 凭证类型。 |  | 字符串。 |
| UsageRecord.Source | 请求来源。 |  | 字符串。 |
| UsageRecord.ReasoningEffort | 请求的推理力度。 |  | 字符串。 |
| UsageRecord.ServiceTier | 请求或报告的服务档。 |  | 字符串。 |
| UsageRecord.ResponseServiceTier | 上游响应最终档。 |  | 字符串。 |
| UsageRecord.ResponseModel | 上游响应里的模型名。 |  | 未知时为空。 |
| UsageRecord.Generate | 客户端是否要求实际生成。 |  | 宿主在交付前把省略值规范为 true。 |
| UsageRecord.Stream | 是否流式执行。 |  | 布尔。 |
| UsageRecord.RequestedAt | 收到请求的时间。 |  | `time.Time`。 |
| UsageRecord.Latency | 总延迟。 |  | `time.Duration`。 |
| UsageRecord.TTFT | 流式首 token 时间。 |  | `time.Duration`。 |
| UsageRecord.Failed | 是否失败。 |  | 布尔。 |
| UsageRecord.Failure | 失败细节。 |  | `StatusCode` 与 `Body`。 |
| UsageRecord.Detail | token 计数。 |  | 见下方各计数字段，类型都是 `int64`。 |
| UsageRecord.ResponseHeaders | 选中的上游响应头。 |  | `http.Header`。 |
| UsageDetail.InputTokens | 输入 token。 |  | `int64`。 |
| UsageDetail.OutputTokens | 输出 token。 |  | `int64`。 |
| UsageDetail.ReasoningTokens | 推理 token。 |  | `int64`。 |
| UsageDetail.CachedTokens | 缓存 token 合计。 |  | `int64`。 |
| UsageDetail.CacheReadTokens | 缓存读取。 |  | `int64`。 |
| UsageDetail.CacheCreationTokens | 缓存创建。 |  | `int64`。 |
| UsageDetail.TotalTokens | 合计。 |  | `int64`。 |

## 5. 常见错误与边界

本方法没有错误返回。ABI 失败信封不用于拒绝一条用量。`Generate` 被省略时，到达插件之前已经是 true。失败正文在 `Failure.Body`，状态码在 `Failure.StatusCode`。

## 6. 相关功能

终态见 [请求生命周期](/cn/plugin/request-lifecycle)。

## 7. 使用经验

暂无
