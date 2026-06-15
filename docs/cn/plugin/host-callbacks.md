---
outline: 'deep'
---

# 宿主回调

宿主回调是插件调用 CLIProxyAPI 宿主能力的机制。它不是插件能力字段，但对执行器、Management API、凭证和资源页面类插件非常重要。

## 方法清单

源码参考：

- `sdk/pluginabi/types.go`：所有 `host.*` 方法名
- `sdk/pluginapi/types.go`：HTTP、模型执行和凭证文件请求/响应结构
- `internal/pluginhost/host_callbacks.go`：宿主回调实现

示例参考：

- `examples/plugin/host-callback/go/main.go`
- `examples/plugin/host-callback-auth-files/go/main.go`
- `examples/plugin/host-model-callback/go/main.go`

## HTTP 回调

| 方法 | 作用 |
| --- | --- |
| `host.http.do` | 通过宿主执行普通 HTTP 请求。 |
| `host.http.do_stream` | 通过宿主执行流式 HTTP 请求。 |
| `host.http.stream_read` | 读取宿主持有的 HTTP 流。 |
| `host.http.stream_close` | 关闭宿主持有的 HTTP 流。 |

插件应优先用这些方法访问外部 HTTP 服务，这样代理、传输策略和请求日志仍由宿主管理。

## 模型执行回调

| 方法 | 作用 |
| --- | --- |
| `host.model.execute` | 发起非流式模型请求。 |
| `host.model.execute_stream` | 发起流式模型请求，返回 `stream_id`。 |
| `host.model.stream_read` | 读取模型流 chunk。 |
| `host.model.stream_close` | 关闭模型流。 |

请求核心字段：

```json
{
  "entry_protocol": "openai",
  "exit_protocol": "openai",
  "model": "gpt-5.5",
  "stream": false,
  "body": "base64-request-body",
  "headers": {},
  "query": {},
  "alt": ""
}
```

## host_callback_id

当插件在 `management.handle` 等宿主调用上下文中调用 `host.model.*` 时，应转发请求中的 `host_callback_id`。

宿主会用这个 ID 识别发起回调的插件，并在嵌套模型执行中跳过该插件自己的请求、响应和流式拦截器，避免递归调用自己。其他已启用插件仍可处理这次嵌套请求。

## 凭证文件回调

| 方法 | 作用 |
| --- | --- |
| `host.auth.list` | 列出宿主凭证记录。 |
| `host.auth.get` | 按 auth index 读取物理凭证 JSON。 |
| `host.auth.get_runtime` | 按 auth index 读取运行时凭证信息。 |
| `host.auth.save` | 写入凭证 JSON 并更新运行时凭证记录。 |

`examples/plugin/host-callback-auth-files` 展示了通过资源页面调用这些方法。

## 流桥和日志

| 方法 | 作用 |
| --- | --- |
| `host.stream.emit` | 执行器插件向宿主发送流式 chunk。 |
| `host.stream.close` | 执行器插件关闭流。 |
| `host.log` | 通过宿主日志输出。 |

## 开发注意

- 流式回调使用后应显式调用对应 close 方法。
- 不要通过宿主回调绕过插件自身的安全边界；插件仍是可信进程内代码。
- 不要把凭证 JSON、token 或用户请求体写入日志。
- 能复用宿主模型执行链路时，优先用 `host.model.*`，不要复制宿主凭证到插件里。
