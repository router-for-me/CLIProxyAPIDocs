---
outline: 'deep'
---

# 请求规整能力

请求规整能力用于把进入执行链路前的请求 payload 改写成宿主后续阶段更容易处理的形态。它常用于补充默认字段、修正特定 provider payload，或实现轻量请求改写。

## 能力字段

```json
{
  "capabilities": {
    "request_normalizer": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`RequestNormalizer`、`RequestTransformRequest`、`PayloadResponse`
- `sdk/pluginabi/types.go`：`request.normalize`
- `internal/pluginhost/adapters.go`：`NormalizeRequest`、`callRequestNormalizer`

示例参考：

- `examples/plugin/request-normalizer/go/main.go`
- `examples/plugin/codex-service-tier/go/main.go`
- `examples/plugin/codex-service-tier/README.md`
- `examples/plugin/simple/go/main.go`：`MethodRequestNormalize`

## 方法

| 方法 | 作用 |
| --- | --- |
| `request.normalize` | 根据格式、模型和流式标记返回新的请求体。 |

## 请求

```json
{
  "FromFormat": "chat-completions",
  "ToFormat": "codex",
  "Model": "gpt-5.5",
  "Stream": false,
  "Body": "base64-request-body"
}
```

## 响应

```json
{
  "Body": "base64-normalized-body"
}
```

## 示例：Codex service tier

`examples/plugin/codex-service-tier` 是更接近真实用法的请求规整示例。它读取插件配置中的 `fast` 字段，在满足以下条件时修改 Codex 请求：

- `ToFormat` 是 `codex`
- `Model` 是 `gpt-5.5`
- `fast` 为 `true`

配置示例：

```yaml
plugins:
  configs:
    codex-service-tier:
      enabled: true
      priority: 1
      fast: true
```

## 开发注意

- 请求规整应保持小范围、可预测，不要承担执行器职责。
- 返回空 `Body` 会让宿主无法应用有效改写；需要保持原文时返回原始 `Body`。
- 插件自有配置通过 `config_yaml` 进入 `plugin.register` / `plugin.reconfigure`，应在那里解析后缓存。

