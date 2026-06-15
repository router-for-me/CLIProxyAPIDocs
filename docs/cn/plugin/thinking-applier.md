---
outline: 'deep'
---

# Thinking 处理能力

Thinking 处理能力用于把宿主已经解析、规整并验证后的 thinking 配置写入 provider payload。它保持“规范 thinking 配置 → provider 专属字段”的架构边界。

## 能力字段

```json
{
  "capabilities": {
    "thinking_applier": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ThinkingApplier`、`ThinkingApplyRequest`、`ThinkingConfig`
- `sdk/pluginabi/types.go`：`thinking.identifier`、`thinking.apply`
- `internal/pluginhost/adapters.go`：Thinking applier 注册和调用
- `internal/thinking/`：宿主 thinking 解析、规整和校验流程

示例参考：

- `examples/plugin/thinking/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodThinkingIdentifier`、`MethodThinkingApply`

## 方法

| 方法 | 作用 |
| --- | --- |
| `thinking.identifier` | 返回该插件处理的 provider 标识。 |
| `thinking.apply` | 把规范 thinking 配置应用到 provider payload。 |

## 请求

```json
{
  "Provider": "plugin-example",
  "Model": {
    "ID": "plugin-example-model",
    "Thinking": {
      "Min": 0,
      "Max": 32768,
      "ZeroAllowed": true,
      "DynamicAllowed": true,
      "Levels": ["low", "medium", "high"]
    }
  },
  "Config": {
    "Mode": "budget",
    "Budget": 1024,
    "Level": ""
  },
  "Body": "base64-provider-payload"
}
```

`Config` 已经是宿主规范化后的配置，插件不需要重新解析 suffix 或请求体里的原始 thinking 输入。

## 响应

```json
{
  "Body": "base64-provider-payload-with-thinking"
}
```

## 开发注意

- 插件只处理自己 `thinking.identifier` 返回的 provider。
- 不要绕过宿主 thinking 校验；插件应假设 `Config` 已经是规范值。
- 不要在 Thinking 处理能力里做请求转换、凭证选择或上游执行。
