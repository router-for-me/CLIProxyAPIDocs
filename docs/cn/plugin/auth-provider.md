---
title: 凭证提供方
feature_ids:
  - plugin.auth-provider.identifier
  - plugin.auth-provider.parse-auth
  - plugin.auth-provider.start-login
  - plugin.auth-provider.poll-login
  - plugin.auth-provider.refresh-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 凭证提供方

`AuthProvider` 让插件解析凭证文件，并完成登录、轮询和刷新。

## 1. 这段解决什么问题

宿主把发现的凭证 JSON、登录动作和到期刷新交给插件。插件返回 `AuthData`，或在一次材料里展开多条 `Auths`。

## 2. 适用条件与不做的事

只实现 `sdk/pluginapi.AuthProvider` 的五个方法。不负责前端请求认证，那是 [前端认证提供方](/cn/plugin/frontend-auth-provider)。不负责选哪条凭证，那是 [调度器](/cn/plugin/scheduler)。不在本页写宿主私有回调。

登记时 `Name`、`Version`、`Author`、`GitHubRepository` 不能为空白，且至少打开一项能力。插件目录见 [插件加载与商店](/cn/operations/plugins)。

## 3. 怎么配置或怎么调用

在 `plugin.register` 或 `plugin.reconfigure` 的结果里设置 `auth_provider`。当前 `sdk/pluginabi.SchemaVersion` 是 6。

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-auth",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-auth"
    },
    "capabilities": {
      "auth_provider": true
    }
  }
}
```

Go 签名：

```go
Identifier() string
ParseAuth(context.Context, AuthParseRequest) (AuthParseResponse, error)
StartLogin(context.Context, AuthLoginStartRequest) (AuthLoginStartResponse, error)
PollLogin(context.Context, AuthLoginPollRequest) (AuthLoginPollResponse, error)
RefreshAuth(context.Context, AuthRefreshRequest) (AuthRefreshResponse, error)
```

ABI 方法名依次是 `auth.identifier`、`auth.parse`、`auth.login.start`、`auth.login.poll`、`auth.refresh`。没有 `json` 标签的字段使用 Go 导出名。`[]byte` 在 JSON 中是 base64。`time.Time` 是 RFC3339。

`auth.identifier` 的结果对象只有字段 `identifier`。示例见仓库 `examples/plugin/auth`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.auth-provider.identifier | `Identifier`，ABI `auth.identifier`。 |  | 无参数。返回 provider 标识字符串。失败或空白按空字符串处理。 |
| plugin.auth-provider.parse-auth | `ParseAuth`，ABI `auth.parse`。 |  | 参数 `AuthParseRequest`，返回 `AuthParseResponse`。 |
| plugin.auth-provider.start-login | `StartLogin`，ABI `auth.login.start`。 |  | 参数 `AuthLoginStartRequest`，返回 `AuthLoginStartResponse`。 |
| plugin.auth-provider.poll-login | `PollLogin`，ABI `auth.login.poll`。 |  | 参数 `AuthLoginPollRequest`，返回 `AuthLoginPollResponse`。 |
| plugin.auth-provider.refresh-auth | `RefreshAuth`，ABI `auth.refresh`。 |  | 参数 `AuthRefreshRequest`，返回 `AuthRefreshResponse`。 |
| AuthParseRequest.Provider | 正在解析的 provider 键。 |  | 字符串。 |
| AuthParseRequest.Path | 凭证材料来源路径，可空。 |  | 字符串。 |
| AuthParseRequest.FileName | 凭证文件名。 |  | 字符串。 |
| AuthParseRequest.RawJSON | 原始凭证 JSON。 |  | `[]byte`。 |
| AuthParseRequest.Host | 与插件有关的宿主配置摘要。 |  | `HostConfigSummary`。 |
| AuthParseResponse.Handled | 插件是否识别了这份材料。 |  | 为 false 时不采用 `Auth`。 |
| AuthParseResponse.Auth | 识别成功时的一条凭证。 |  | `AuthData`。 |
| AuthParseResponse.Auths | 一份材料展开成的多条运行时凭证。 |  | `[]AuthData`。 |
| AuthLoginStartRequest.Provider | 登录流程的 provider 键。 |  | 字符串。 |
| AuthLoginStartRequest.BaseURL | 宿主回调或登录基址。 |  | 字符串。 |
| AuthLoginStartRequest.Host | 宿主配置摘要。 |  | `HostConfigSummary`。 |
| AuthLoginStartRequest.HTTPClient | 按宿主传输策略发出的 HTTP 客户端。 |  | `HostHTTPClient`，JSON 忽略。见 [宿主 HTTP 客户端](/cn/plugin/host-callbacks)。 |
| AuthLoginStartRequest.Metadata | 插件自定义登录上下文。 |  | `map[string]any`。 |
| AuthLoginStartResponse.Provider | 登录流程的 provider 键。 |  | 字符串。 |
| AuthLoginStartResponse.URL | 给用户打开的登录地址。 |  | 字符串。 |
| AuthLoginStartResponse.State | 轮询用的不透明状态。 |  | 交给 `PollLogin`。 |
| AuthLoginStartResponse.ExpiresAt | 本轮登录过期时间。 |  | `time.Time`。 |
| AuthLoginStartResponse.Metadata | 插件自定义轮询上下文。 |  | `map[string]any`。 |
| AuthLoginPollRequest.Provider | 登录流程的 provider 键。 |  | 字符串。 |
| AuthLoginPollRequest.State | `StartLogin` 返回的状态。 |  | 字符串。 |
| AuthLoginPollRequest.Host | 宿主配置摘要。 |  | `HostConfigSummary`。 |
| AuthLoginPollRequest.HTTPClient | 宿主 HTTP 客户端。 |  | JSON 忽略。 |
| AuthLoginPollRequest.Metadata | 插件自定义轮询上下文。 |  | `map[string]any`。 |
| AuthLoginPollResponse.Status | 当前登录状态。 |  | 只能是 `pending`、`success`、`error`。 |
| AuthLoginPollResponse.Message | 进度或错误文本。 |  | 字符串。 |
| AuthLoginPollResponse.Auth | 成功时的一条凭证。 |  | `Status` 为 `success` 时使用。 |
| AuthLoginPollResponse.Auths | 一次登录展开的多条凭证。 |  | `[]AuthData`。 |
| AuthRefreshRequest.AuthID | 要刷新的凭证 ID。 |  | 字符串。 |
| AuthRefreshRequest.AuthProvider | 凭证提供方。 |  | 字符串。 |
| AuthRefreshRequest.StorageJSON | 插件自己的持久化数据。 |  | `[]byte`。 |
| AuthRefreshRequest.Metadata | 宿主可改的元数据。 |  | `map[string]any`。 |
| AuthRefreshRequest.Attributes | 不可变的路由和提供方属性。 |  | `map[string]string`。 |
| AuthRefreshRequest.Host | 宿主配置摘要。 |  | `HostConfigSummary`。 |
| AuthRefreshRequest.HTTPClient | 宿主 HTTP 客户端。 |  | JSON 忽略。 |
| AuthRefreshResponse.Auth | 刷新后的凭证。 |  | `AuthData`。 |
| AuthRefreshResponse.NextRefreshAfter | 下次最早可刷新时间。 |  | `time.Time`。 |
| AuthData.Provider | 凭证所属 provider。 |  | 字符串。 |
| AuthData.ID | 宿主侧稳定 ID。 |  | 字符串。 |
| AuthData.FileName | 来源或落盘文件名。 |  | 字符串。 |
| AuthData.Label | 显示名。 |  | 字符串。 |
| AuthData.Prefix | 该凭证的模型前缀。 |  | 字符串。 |
| AuthData.ProxyURL | 凭证级代理地址。 |  | 字符串。 |
| AuthData.Disabled | 是否跳过这条凭证。 |  | 布尔。 |
| AuthData.StorageJSON | 插件自己的持久化数据。 |  | `[]byte`。 |
| AuthData.Metadata | 宿主可改的元数据。 |  | `map[string]any`。 |
| AuthData.Attributes | 不可变属性。 |  | `map[string]string`。 |
| AuthData.NextRefreshAfter | 下次最早可刷新时间。 |  | `time.Time`。 |
| HostConfigSummary.AuthDir | 已解析的凭证目录。 |  | 字符串。 |
| HostConfigSummary.ProxyURL | 配置的上游代理。 |  | 字符串。 |
| HostConfigSummary.ForceModelPrefix | 别名是否保留提供方前缀。 |  | 布尔。 |
| HostConfigSummary.OAuthModelAlias | 提供方到模型别名的映射。 |  | 元素为 `ModelAlias`，含 `Name` 与 `Alias`。 |
| HostConfigSummary.ExcludedModels | 按提供方隐藏的模型名。 |  | `map[string][]string`。 |

## 5. 常见错误与边界

四个会返回 `error` 的方法失败时，ABI 信封 `ok` 为 false。`error.code` 与 `error.message` 必填，`retryable` 可省略。`http_status` 省略或为 0 时按 HTTP 500 处理。

`ParseAuth` 未识别材料时返回 `Handled: false`，而不是把空 `AuthData` 当成成功凭证。登录状态只接受 `pending`、`success`、`error`。`HTTPClient` 不进入 JSON。

## 6. 相关功能

模型列表见 [模型提供方](/cn/plugin/model-provider)。选凭证见 [调度器](/cn/plugin/scheduler)。上游调用见 [宿主 HTTP 客户端](/cn/plugin/host-callbacks)。

## 7. 使用经验

暂无
