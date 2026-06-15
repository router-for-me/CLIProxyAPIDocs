---
outline: 'deep'
---

# 前端认证提供方能力

前端认证提供方能力用于在请求进入代理流程前认证客户端请求。它面向“谁可以调用 CLIProxyAPI”这个问题，不负责上游凭证选择。

## 能力字段

```json
{
  "capabilities": {
    "frontend_auth_provider": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`FrontendAuthProvider`、`FrontendAuthRequest`、`FrontendAuthResponse`
- `sdk/pluginabi/types.go`：`frontend_auth.identifier`、`frontend_auth.authenticate`
- `internal/pluginhost/adapters.go`：`RegisterFrontendAuthProviders`

示例参考：

- `examples/plugin/frontend-auth/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodFrontendAuthIdentifier`、`MethodFrontendAuthAuthenticate`

## 方法

| 方法 | 作用 |
| --- | --- |
| `frontend_auth.identifier` | 返回该前端认证提供方的稳定标识。 |
| `frontend_auth.authenticate` | 根据 HTTP 请求内容判断是否认证通过。 |

## 请求

`frontend_auth.authenticate` 接收：

```json
{
  "Method": "POST",
  "Path": "/v1/chat/completions",
  "Headers": {
    "Authorization": ["Bearer ..."]
  },
  "Query": {},
  "Body": "base64-body"
}
```

## 响应

```json
{
  "Authenticated": true,
  "Principal": "user-or-client-id",
  "Metadata": {
    "provider": "example-frontend-auth-go"
  }
}
```

`Principal` 是认证主体，`Metadata` 可携带给下游使用的身份属性。

## 与内置 API Key 的关系

普通前端认证提供方会与宿主已有认证方式一起工作。只有声明 [前端认证独占模式](./frontend-auth-exclusive) 时，插件才会在被选中后成为唯一前端认证来源。

## 开发注意

- 前端认证只认证客户端请求，不应读取或返回上游凭证。
- 对请求体做认证时要注意大小和敏感信息，不要在日志里输出原始 body。
- 插件返回 `Authenticated: false` 时，宿主会继续按当前认证链路处理或拒绝请求，具体取决于是否启用了独占模式。
