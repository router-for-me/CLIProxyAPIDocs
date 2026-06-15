---
outline: 'deep'
---

# 响应转换能力

响应转换能力用于把规范响应转换回客户端请求的目标协议。它与 [请求转换能力](./request-translator) 对称，发生在上游响应返回后、交给客户端前。

## 能力字段

```json
{
  "capabilities": {
    "response_translator": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ResponseTranslator`、`ResponseTransformRequest`、`PayloadResponse`
- `sdk/pluginabi/types.go`：`response.translate`
- `internal/pluginhost/adapters.go`：`TranslateResponse`、`callResponseTranslator`

示例参考：

- `examples/plugin/response-translator/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodResponseTranslate`

## 方法

| 方法 | 作用 |
| --- | --- |
| `response.translate` | 将响应 `Body` 从 `FromFormat` 转换到 `ToFormat`。 |

## 请求

```json
{
  "FromFormat": "codex",
  "ToFormat": "chat-completions",
  "Model": "gpt-5.5",
  "Stream": false,
  "OriginalRequest": "base64-client-body",
  "TranslatedRequest": "base64-provider-request",
  "Body": "base64-upstream-response"
}
```

## 响应

```json
{
  "Body": "base64-client-response"
}
```

## 开发注意

- `OriginalRequest` 是客户端原始请求，`TranslatedRequest` 是发给上游的请求，可用于响应格式补全。
- 响应转换应输出客户端协议需要的完整响应。
- 流式响应是否可转换取决于宿主执行器和格式能力，插件应明确测试流式场景。

