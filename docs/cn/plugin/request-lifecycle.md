---
title: 请求生命周期
feature_ids:
  - plugin.request-lifecycle-plugin.handle-request-complete
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 请求生命周期

`RequestLifecyclePlugin` 在请求到达拦截阶段之后，异步收到一条终态。

## 1. 这段解决什么问题

执行成功、执行失败、被拦截拒绝或被取消时，插件各收到一次完成记录，用来做收尾，而不是改写响应。

## 2. 适用条件与不做的事

只有 `HandleRequestComplete`。它不改请求，也不改响应。用量计数是 [用量观察](/cn/plugin/usage-plugin)。

`sdk/pluginabi` 说明契约版本 2 起才有请求完成。当前 `SchemaVersion` 是 6，已包含该能力。

## 3. 怎么配置或怎么调用

`capabilities.request_lifecycle_plugin` 设为 true。

```go
HandleRequestComplete(context.Context, RequestCompletion) error
```

ABI 方法名是 `request.complete`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.request-lifecycle-plugin.handle-request-complete | `HandleRequestComplete`，ABI `request.complete`。 |  | 参数 `RequestCompletion`，只返回 `error`。 |
| RequestCompletion.RequestID | 与拦截请求相同的执行 ID。 |  | 字符串。 |
| RequestCompletion.TraceID | 入站追踪 ID。 |  | 字符串。 |
| RequestCompletion.SourceFormat | 客户端协议。 |  | 字符串。 |
| RequestCompletion.Model | 执行模型。 |  | 字符串。 |
| RequestCompletion.RequestedModel | 客户端请求的模型。 |  | 字符串。 |
| RequestCompletion.Stream | 是否流式。 |  | 布尔。 |
| RequestCompletion.Outcome | 终态。 |  | `succeeded`、`failed`、`rejected`、`canceled`。 |
| RequestCompletion.StatusCode | 终态状态码。 |  | 取消时为 0。 |
| RequestCompletion.Error | 错误文本。 |  | 字符串。 |
| RequestCompletion.StartedAt | 开始时间。 |  | `time.Time`，JSON 为 RFC3339。 |
| RequestCompletion.CompletedAt | 完成时间。 |  | `time.Time`。 |
| RequestCompletion.Metadata | 上下文快照。 |  | `map[string]any`。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

`rejected` 表示拦截器在执行前终止了请求。`canceled` 表示上下文取消或下游断开，此时状态码为 0。`failed` 表示模型执行失败。每种到达拦截阶段的请求只有一条终态。

## 6. 相关功能

拦截见 [请求拦截](/cn/plugin/request-interceptor)。用量见 [用量观察](/cn/plugin/usage-plugin)。

## 7. 使用经验

暂无
