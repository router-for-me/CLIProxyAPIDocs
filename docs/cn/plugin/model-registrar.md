---
outline: 'deep'
---

# 模型注册器能力

模型注册器能力用于把插件提供的静态模型元数据注册到 CLIProxyAPI 的模型注册表中。它适合模型集合固定、无需按凭证动态发现模型的插件。

## 能力字段

在 `plugin.register` 或 `plugin.reconfigure` 的注册结果中声明：

```json
{
  "capabilities": {
    "model_registrar": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ModelRegistrar`、`ModelRegistrationRequest`、`ModelRegistrationResponse`、`ModelInfo`
- `sdk/pluginabi/types.go`：`model.register`
- `internal/pluginhost/adapters.go`：`RegisterModels`、`callModelRegistrar`

示例参考：

- `examples/plugin/simple/go/main.go`：`MethodModelRegister`

## 调用时机

宿主加载或重新配置插件后，会在注册模型阶段调用 `model.register`。返回的模型会进入模型列表和路由匹配流程。

如果同一个插件同时声明了 [执行器能力](./executor)，这些模型会与该插件执行器关联；如果没有执行器，宿主会把它们作为插件提供的普通模型客户端注册。

## 请求

`model.register` 的请求对应 `ModelRegistrationRequest`：

```json
{
  "Plugin": {
    "Name": "example",
    "Version": "0.1.0",
    "Author": "router-for-me"
  }
}
```

`Plugin` 是当前插件的元数据，供插件按自身版本或配置决定返回哪些模型。

## 响应

返回 `ModelRegistrationResponse`：

```json
{
  "Provider": "plugin-example",
  "Models": [
    {
      "ID": "plugin-example-model",
      "Object": "model",
      "OwnedBy": "plugin-example",
      "DisplayName": "Plugin Example Model",
      "SupportedGenerationMethods": ["chat"],
      "ContextLength": 8192,
      "MaxCompletionTokens": 1024,
      "UserDefined": true
    }
  ]
}
```

关键点：

- `Provider` 必须是稳定的提供方标识。
- `Models` 必须是完整模型集合，而不是增量。
- `ID` 是客户端请求使用的模型名。
- `Thinking` 可声明模型支持的 thinking 范围，供 thinking 配置校验和后续 [Thinking 处理能力](./thinking-applier) 使用。

## 开发注意

- 不要返回空 `Provider` 或空模型 ID；宿主会跳过无效模型。
- 模型注册器只负责静态模型；需要按每个 OAuth 或文件凭证动态发现模型时，使用 [模型提供方能力](./model-provider)。
- 如果模型只应由插件执行器处理，应同时声明执行器能力，并设置合适的 `executor_model_scope`。
