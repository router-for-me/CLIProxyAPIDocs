---
outline: 'deep'
---

# 请求拦截能力

请求拦截能力用于在执行上游请求前改写请求头或请求体。它有两个阶段：选凭证前和选凭证后。

## 能力字段

```json
{
  "capabilities": {
    "request_interceptor": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`RequestInterceptor`、`RequestInterceptRequest`、`RequestInterceptResponse`
- `sdk/pluginabi/types.go`：`request.intercept_before`、`request.intercept_after`
- `internal/pluginhost/adapters.go`：`InterceptRequestBeforeAuth`、`InterceptRequestAfterAuth`

示例参考：

- `internal/pluginhost/adapters_test.go`：请求拦截链、跳过来源插件和错误处理测试
- `examples/plugin/antigravity-web-search/go/main.go`：基于当前拦截器 seam 的真实迁移示例

## 方法

| 方法 | 作用 |
| --- | --- |
| `request.intercept_before` | 在凭证选择前改写请求。此时 `ToFormat` 可能为空。 |
| `request.intercept_after` | 在凭证选择后改写请求。此时模型和上游格式已更具体。 |

## 请求

```json
{
  "SourceFormat": "chat-completions",
  "ToFormat": "codex",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "Stream": false,
  "Headers": {},
  "Body": "base64-body",
  "Metadata": {}
}
```

## 响应

```json
{
  "Headers": {
    "X-Plugin": ["example"]
  },
  "Body": "base64-new-body",
  "ClearHeaders": ["X-Old-Header"]
}
```

语义：

- `Headers` 会覆盖同名 header，但保留未提到的 header。
- `Body` 非空时替换当前 body。
- `ClearHeaders` 会先删除指定 header，再应用 `Headers`。

## 递归保护

当插件通过 `host.model.*` 发起嵌套模型请求并传递 `host_callback_id` 时，宿主会跳过发起插件自己的请求拦截器，避免递归调用自己。其他插件的请求拦截器仍可处理嵌套请求。

## 开发注意

- `Metadata` 是宿主上下文快照，应视为只读。
- 选凭证前不要依赖凭证字段；选凭证后再处理需要凭证上下文的改写。
- 不要在请求拦截器里直接调用上游模型；需要模型请求时使用 [宿主回调](./host-callbacks)。
