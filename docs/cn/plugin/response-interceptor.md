---
outline: 'deep'
---

# 响应拦截能力

响应拦截能力用于在成功的非流式 HTTP 执行响应返回给客户端前，改写响应头或响应体。

## 能力字段

```json
{
  "capabilities": {
    "response_interceptor": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ResponseInterceptor`、`ResponseInterceptRequest`、`ResponseInterceptResponse`
- `sdk/pluginabi/types.go`：`response.intercept_after`
- `internal/pluginhost/adapters.go`：`InterceptResponse`

示例参考：

- `internal/pluginhost/adapters_test.go`：响应拦截链、header 清理和错误处理测试
- `examples/plugin/antigravity-web-search/go/main.go`：基于响应拦截的真实迁移示例

## 方法

| 方法 | 作用 |
| --- | --- |
| `response.intercept_after` | 改写成功的非流式响应。 |

## 请求

```json
{
  "SourceFormat": "chat-completions",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "Stream": false,
  "RequestHeaders": {},
  "ResponseHeaders": {},
  "OriginalRequest": "base64-client-body",
  "RequestBody": "base64-upstream-request",
  "Body": "base64-response-body",
  "StatusCode": 200,
  "Metadata": {}
}
```

## 响应

```json
{
  "Headers": {
    "X-Plugin": ["example"]
  },
  "Body": "base64-new-response-body",
  "ClearHeaders": ["X-Old-Header"]
}
```

## 开发注意

- 只处理成功的非流式响应；流式响应使用 [流式响应拦截能力](./response-stream-interceptor)。
- `Headers` 会覆盖同名响应头，但保留未提到的 header。
- `Body` 非空时替换响应体。
- 通过 `host_callback_id` 发起的宿主模型回调会跳过来源插件自己的响应拦截器。

