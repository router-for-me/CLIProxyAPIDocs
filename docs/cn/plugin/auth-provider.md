---
outline: 'deep'
---

# 凭证提供方能力

凭证提供方能力让插件参与凭证文件解析、登录、轮询和刷新。它适合新增一个需要 OAuth、设备码、API Key 文件或自定义 JSON 凭证的上游提供方。

## 能力字段

```json
{
  "capabilities": {
    "auth_provider": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`AuthProvider`、`AuthData`、`AuthParseRequest`、`AuthLoginStartRequest`、`AuthLoginPollRequest`、`AuthRefreshRequest`
- `sdk/pluginabi/types.go`：`auth.identifier`、`auth.parse`、`auth.login.start`、`auth.login.poll`、`auth.refresh`
- `internal/pluginhost/adapters.go`：凭证解析、刷新和宿主 HTTP 客户端桥接

示例参考：

- `examples/plugin/auth/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodAuthIdentifier`、`MethodAuthParse`、`MethodAuthLoginStart`、`MethodAuthLoginPoll`、`MethodAuthRefresh`

## 方法

| 方法 | 作用 |
| --- | --- |
| `auth.identifier` | 返回插件负责的 provider 标识。 |
| `auth.parse` | 尝试解析宿主发现的凭证 JSON。 |
| `auth.login.start` | 开始登录流程，返回用户需要打开的 URL 和轮询状态。 |
| `auth.login.poll` | 轮询登录流程，成功时返回 `AuthData`。 |
| `auth.refresh` | 刷新已有凭证，返回更新后的凭证数据和下次刷新时间。 |

## AuthData

`AuthData` 是插件与宿主交换凭证数据的核心结构：

```json
{
  "Provider": "plugin-example",
  "ID": "plugin-example-auth",
  "FileName": "plugin-example.json",
  "Label": "Plugin Example",
  "Prefix": "",
  "ProxyURL": "",
  "Disabled": false,
  "StorageJSON": "base64-json",
  "Metadata": {},
  "Attributes": {},
  "NextRefreshAfter": "2026-06-15T12:00:00Z"
}
```

字段分工：

- `StorageJSON` 是插件拥有的持久化凭证内容。
- `Metadata` 是宿主管理但可变的元数据。
- `Attributes` 是路由与提供方相关的不可变属性。
- `NextRefreshAfter` 控制宿主下一次主动刷新时间。

## 登录流程

`auth.login.start` 返回：

```json
{
  "Provider": "plugin-example",
  "URL": "https://example.com/login",
  "State": "opaque-state",
  "ExpiresAt": "2026-06-15T12:05:00Z",
  "Metadata": {}
}
```

`auth.login.poll` 返回状态：

```json
{
  "Status": "pending",
  "Message": "waiting for user confirmation"
}
```

成功时 `Status` 为 `success`，并填充 `Auth`。

## 开发注意

- `auth.parse` 必须通过 `Handled` 明确表示是否识别该凭证文件。
- 插件需要访问上游登录或刷新接口时，应使用宿主 HTTP 桥接，避免绕过代理和日志策略。
- 不要在日志中输出 `StorageJSON`、access token、refresh token 或用户原始凭证。
- 如果插件同时提供模型发现，通常还会配合 [模型提供方能力](./model-provider)。
