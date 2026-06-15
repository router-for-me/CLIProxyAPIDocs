---
outline: 'deep'
---

# 模型提供方能力

模型提供方能力用于提供静态模型，以及按具体凭证记录动态发现模型。它比模型注册器更适合 OAuth、文件凭证或需要访问上游模型列表的插件。

## 能力字段

```json
{
  "capabilities": {
    "model_provider": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ModelProvider`、`StaticModelRequest`、`AuthModelRequest`、`ModelResponse`
- `sdk/pluginabi/types.go`：`model.static`、`model.for_auth`
- `internal/pluginhost/adapters.go`：`RegisterModels`、`ModelsForAuth`

示例参考：

- `examples/plugin/model/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodModelStatic`、`MethodModelForAuth`

## 方法

| 方法 | 作用 |
| --- | --- |
| `model.static` | 返回不依赖具体凭证的静态模型列表。 |
| `model.for_auth` | 基于某个凭证记录返回模型列表，也可以顺带返回凭证更新。 |

## 静态模型请求

`model.static` 接收 `StaticModelRequest`：

```json
{
  "Plugin": {},
  "Host": {
    "AuthDir": "~/.cli-proxy-api",
    "ProxyURL": "",
    "ForceModelPrefix": false
  }
}
```

## 按凭证发现模型

`model.for_auth` 接收 `AuthModelRequest`：

```json
{
  "AuthID": "auth-1",
  "AuthProvider": "plugin-example",
  "StorageJSON": "base64-json",
  "Metadata": {},
  "Attributes": {},
  "Host": {}
}
```

如果插件需要访问上游模型接口，应使用请求中的宿主 HTTP 客户端对应的 `host.http.*` 桥接能力，这样代理、传输策略和请求日志仍由宿主管理。

## 响应

`model.static` 和 `model.for_auth` 都返回 `ModelResponse`：

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
  ],
  "AuthUpdate": {}
}
```

`AuthUpdate` 可在模型发现过程中更新凭证数据，例如刷新上游返回的账号信息、项目 ID 或下一次刷新时间。

## 与执行器的关系

如果插件同时声明 [执行器能力](./executor)，`executor_model_scope` 会控制模型提供方的注册路径：

- `static`：只注册静态模型。
- `oauth`：只处理按凭证发现的模型。
- `both` 或空值：同时支持两类模型。

## 开发注意

- `model.for_auth` 应只处理自己识别的凭证提供方。
- 返回的 `Provider` 为空时，宿主会尝试使用当前凭证的 provider。
- 动态发现失败时返回错误会让宿主把该凭证的模型发现视为已处理但失败。
