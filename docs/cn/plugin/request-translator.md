---
outline: 'deep'
---

# 请求转换能力

请求转换能力用于把规范请求转换成目标提供方协议。它位于请求执行前的协议转换阶段，适合把 CLIProxyAPI 已经规范化后的请求体翻译成上游需要的 payload。

## 能力字段

```json
{
  "capabilities": {
    "request_translator": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`RequestTranslator`、`RequestTransformRequest`、`PayloadResponse`
- `sdk/pluginabi/types.go`：`request.translate`
- `internal/pluginhost/adapters.go`：`TranslateRequest`、`callRequestTranslator`

示例参考：

- `examples/plugin/request-translator/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodRequestTranslate`

## 方法

| 方法 | 作用 |
| --- | --- |
| `request.translate` | 将 `Body` 从 `FromFormat` 转换到 `ToFormat`。 |

## 请求

```json
{
  "FromFormat": "chat-completions",
  "ToFormat": "anthropic",
  "Model": "claude-sonnet",
  "Stream": false,
  "Body": "base64-request-body"
}
```

## 响应

```json
{
  "Body": "base64-translated-body"
}
```

## 与请求规整的区别

- [请求规整能力](./request-normalizer) 负责把提供方或特殊入口请求规整到宿主可理解的规范格式。
- 请求转换能力负责把规范格式转换到目标上游协议。

## 开发注意

- 只处理自己明确支持的格式组合；不能处理时返回错误或不要声明该能力。
- `Body` 必须是完整有效的目标协议 payload。
- 不要在转换器里做凭证选择或上游 HTTP 请求；这些属于调度器和执行器阶段。
