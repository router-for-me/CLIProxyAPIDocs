---
outline: 'deep'
---

# 响应转换后规整能力

响应转换后规整能力用于在响应已经翻译成客户端协议后做最后改写。它适合兼容严格客户端、补充字段或做轻量响应后处理。

## 能力字段

```json
{
  "capabilities": {
    "response_after_translator": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ResponseNormalizer`、`ResponseTransformRequest`、`PayloadResponse`
- `sdk/pluginabi/types.go`：`response.normalize_after`
- `internal/pluginhost/adapters.go`：`NormalizeResponse` 转换后阶段

示例参考：

- `examples/plugin/response-normalizer/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodResponseNormalizeAfter`

## 方法

| 方法 | 作用 |
| --- | --- |
| `response.normalize_after` | 在响应翻译后返回规整后的客户端响应体。 |

## 请求

请求包含原始客户端请求、翻译后的上游请求和当前响应体：

```json
{
  "FromFormat": "codex",
  "ToFormat": "chat-completions",
  "Model": "gpt-5.5",
  "Stream": false,
  "OriginalRequest": "base64-client-body",
  "TranslatedRequest": "base64-provider-request",
  "Body": "base64-translated-response"
}
```

## 响应

```json
{
  "Body": "base64-final-client-response"
}
```

## 开发注意

- 适合补齐客户端协议要求的兼容字段。
- 不要在这里再调用上游或改变计费语义。
- 如果要改 HTTP header，使用 [响应拦截能力](./response-interceptor)，不是响应规整。

