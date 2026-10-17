---
title: 前端认证提供方
feature_ids:
  - plugin.frontend-auth-provider.identifier
  - plugin.frontend-auth-provider.authenticate
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 前端认证提供方

`FrontendAuthProvider` 在请求进入代理处理之前做前端认证。

## 1. 这段解决什么问题

插件查看入站方法、路径、头、查询和正文，决定是否接受，并给出主体标识和下游可用的属性。

## 2. 适用条件与不做的事

不解析上游凭证文件，那是 [凭证提供方](/cn/plugin/auth-provider)。独占开关不是方法，见 [前端认证独占模式](/cn/plugin/frontend-auth-exclusive)。

## 3. 怎么配置或怎么调用

`capabilities.frontend_auth_provider` 设为 true。需要独占时再加 `frontend_auth_provider_exclusive`，说明不在本页。

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-frontend-auth",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-frontend-auth"
    },
    "capabilities": {
      "frontend_auth_provider": true
    }
  }
}
```

```go
Identifier() string
Authenticate(context.Context, FrontendAuthRequest) (FrontendAuthResponse, error)
```

ABI 方法名是 `frontend_auth.identifier` 与 `frontend_auth.authenticate`。标识结果对象的字段是 `identifier`。示例见 `examples/plugin/frontend-auth`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.frontend-auth-provider.identifier | `Identifier`，ABI `frontend_auth.identifier`。 |  | 无参数。返回字符串。失败或空白按空字符串处理。 |
| plugin.frontend-auth-provider.authenticate | `Authenticate`，ABI `frontend_auth.authenticate`。 |  | 参数 `FrontendAuthRequest`，返回 `FrontendAuthResponse`。 |
| FrontendAuthRequest.Method | HTTP 方法。 |  | 字符串。 |
| FrontendAuthRequest.Path | 请求路径。 |  | 字符串。 |
| FrontendAuthRequest.Headers | 入站头。 |  | `http.Header`。 |
| FrontendAuthRequest.Query | 查询参数。 |  | `url.Values`。 |
| FrontendAuthRequest.Body | 原始正文。 |  | `[]byte`，JSON 中为 base64。 |
| FrontendAuthResponse.Authenticated | 是否接受该请求。 |  | 布尔。 |
| FrontendAuthResponse.Principal | 已认证主体标识。 |  | 字符串。 |
| FrontendAuthResponse.Metadata | 交给下游的身份属性。 |  | `map[string]string`。 |

## 5. 常见错误与边界

`Authenticate` 返回 `error` 时，ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

`Authenticated` 为 false 表示未接受，与方法返回错误不是同一条路径。

## 6. 相关功能

独占布尔值见 [前端认证独占模式](/cn/plugin/frontend-auth-exclusive)。上游凭证见 [凭证提供方](/cn/plugin/auth-provider)。

## 7. 使用经验

暂无
