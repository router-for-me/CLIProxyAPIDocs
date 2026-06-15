---
outline: 'deep'
---

# 执行器能力

执行器能力用于实际向上游提供方或本地后端发送模型请求。它是最接近“上游适配器”的能力。

## 能力字段

```json
{
  "capabilities": {
    "executor": true,
    "executor_model_scope": "both",
    "executor_input_formats": ["chat-completions"],
    "executor_output_formats": ["chat-completions"]
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ProviderExecutor`、`ExecutorRequest`、`ExecutorResponse`、`ExecutorStreamResponse`、`ExecutorHTTPRequest`
- `sdk/pluginabi/types.go`：`executor.identifier`、`executor.execute`、`executor.execute_stream`、`executor.count_tokens`、`executor.http_request`
- `internal/pluginhost/adapters.go`：执行器注册、协议格式选择和执行桥接

示例参考：

- `examples/plugin/executor/go/main.go`
- `examples/plugin/protocol-format/go/main.go`
- `examples/plugin/simple/go/main.go`：执行器相关方法

## 方法

| 方法 | 作用 |
| --- | --- |
| `executor.identifier` | 返回该执行器负责的 provider 标识。 |
| `executor.execute` | 执行非流式模型请求。 |
| `executor.execute_stream` | 执行流式模型请求。 |
| `executor.count_tokens` | 处理 token 计数请求。 |
| `executor.http_request` | 执行器自有 HTTP 请求入口。 |

## 协议格式

`executor_input_formats` 声明执行器能直接接收的请求协议，`executor_output_formats` 声明执行器直接输出的响应协议。

常用值：

- `chat-completions`
- `responses`
- `anthropic`

`examples/plugin/protocol-format` 演示了输入 `chat-completions`、输出 `responses` 的声明方式。

## 模型作用域

`executor_model_scope` 控制执行器与模型注册路径的关系：

| 值 | 说明 |
| --- | --- |
| `static` | 执行器只服务静态模型。 |
| `oauth` | 执行器只服务 OAuth/凭证绑定模型。 |
| `both` | 同时服务静态模型和凭证绑定模型。 |

空值按 `both` 处理。

## ExecutorRequest

执行请求包含：

```json
{
  "AuthID": "auth-1",
  "AuthProvider": "plugin-example",
  "Model": "plugin-example-model",
  "Format": "chat-completions",
  "Stream": false,
  "Headers": {},
  "Query": {},
  "OriginalRequest": "base64-client-body",
  "SourceFormat": "chat-completions",
  "Payload": "base64-provider-payload",
  "StorageJSON": "base64-auth-json",
  "AuthMetadata": {},
  "AuthAttributes": {}
}
```

插件向上游发 HTTP 请求时应使用宿主提供的 HTTP 客户端，也就是通过 `host.http.*` 完成请求。这样请求日志、代理、传输策略和凭证上下文仍在宿主控制下。

## 响应

非流式响应：

```json
{
  "Payload": "base64-response-body",
  "Headers": {
    "content-type": ["application/json"]
  },
  "Metadata": {}
}
```

流式响应返回 `Headers` 和 chunk 流。C ABI 示例会把有限 chunk 放进响应数组，宿主再转换成内部流。

## 开发注意

- 执行器必须声明至少一个输入格式和输出格式。
- `Payload` 是已经按目标协议翻译后的请求体；不要重新猜测客户端原始协议。
- 需要复用宿主模型路由时，不要写执行器，改用 [宿主回调](./host-callbacks) 中的 `host.model.*`。
- 不要在插件中保存或打印上游密钥，凭证数据应从请求中的 `StorageJSON` 使用后即丢。
