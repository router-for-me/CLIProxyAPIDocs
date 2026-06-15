---
outline: 'deep'
---

# 前端认证独占模式

前端认证独占模式不是独立接口，而是前端认证提供方的附加能力。它表示该插件被选中后，宿主只使用这个插件作为前端请求认证来源。

## 能力字段

```json
{
  "capabilities": {
    "frontend_auth_provider": true,
    "frontend_auth_provider_exclusive": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`FrontendAuthProviderExclusive`
- `internal/pluginhost/rpc_schema.go`：`frontend_auth_provider_exclusive`
- `internal/pluginhost/adapters.go`：独占前端认证提供方选择逻辑

示例参考：

- `examples/plugin/frontend-auth-exclusive/go/main.go`

## 选择规则

宿主注册前端认证提供方时，会优先选择声明了 `frontend_auth_provider_exclusive` 的插件：

- 只对同时声明 `frontend_auth_provider` 的插件有效。
- 多个独占插件存在时，优先级更高的插件胜出。
- 优先级相同的情况下，宿主按稳定规则选择。
- 独占插件移除或关闭后，宿主会清理独占状态。

## 请求和响应

独占模式仍然使用 `frontend_auth.authenticate`：

```json
{
  "Authenticated": true,
  "Principal": "example-frontend-auth-exclusive-go",
  "Metadata": {
    "mode": "exclusive",
    "provider": "example-frontend-auth-exclusive-go"
  }
}
```

示例插件通过请求头判断：

```text
X-Example-Frontend-Auth: exclusive
```

## 开发注意

- 独占模式会改变整体前端认证边界，必须谨慎启用。
- 插件应对失败返回 `Authenticated: false`，不要 panic 或退出进程。
- 不要只声明 `frontend_auth_provider_exclusive`；没有 `frontend_auth_provider` 时该字段不会形成有效的前端认证提供方。
