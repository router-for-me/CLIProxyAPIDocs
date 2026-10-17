---
title: 管理 OAuth
feature_ids:
  - management.v8.delete-oauth-session
  - management.v8.get-oauth-auth-url
  - management.v8.get-oauth-callback
  - management.v8.get-oauth-status
  - management.v8.post-oauth-callback
  - management.v8.post-oauth-import
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理 OAuth

## 1. 这段解决什么问题

通过管理 API 开始提供商登录、提交回调、查询或取消会话，以及导入受支持的凭证。

## 2. 适用条件与不做的事

开始登录、查询状态、取消会话和导入都需要管理密钥。`GET` 与 `POST /v8/management/oauth/callback` 不经过管理密钥中间件，但仍受管理接口是否启用的限制：Home 模式或未启用管理路由时返回 404。已保存文件的增删见 [管理凭证](/cn/management/v8-credentials)。

## 3. 怎么配置或怎么调用

基址使用 `https://example.invalid`。需要密钥的请求使用 `Authorization: Bearer YOUR_API_KEY`。

| 方法与路径 | 作用 |
| --- | --- |
| GET /v8/management/oauth/auth-url?provider= | 按提供商开始登录并返回认证 URL 或设备码信息。 |
| GET /v8/management/oauth/status?state= | 查询会话。省略 `state` 时只返回 `{"status":"ok"}`。 |
| DELETE /v8/management/oauth/session?state= | 取消该 state 对应的待处理会话。 |
| POST /v8/management/oauth/import?provider= | 导入凭证。当前内置分派只接受 `vertex`。 |
| GET /v8/management/oauth/callback | 用查询参数接收提供商回调。 |
| POST /v8/management/oauth/callback | 用 JSON 接收回调。 |

`provider` 查询值会转成小写再匹配。开始登录接受 `claude`、`codex`、`antigravity`、`kimi`、`kimi-ai`、`xai`、`devin`、`meta`。都不匹配时，若已注册的插件能处理该提供商，则交给插件；否则 404 `provider_not_found`。

POST 回调的 JSON 字段为 `provider`、`redirect_url`、`code`、`state`、`error`。`redirect_url` 里的 `state`、`code`、`error` 或 `error_description` 会在对应字段为空时补上。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| DELETE /v8/management/oauth/session | 取消待处理 OAuth 会话。 |  | 缺少 `state` 时 400 `missing state`。state 不合法时 400 `invalid state`。成功返回 `status: ok` 和 `cancelled` 布尔值。 |
| GET /v8/management/oauth/auth-url | 按 `provider` 开始登录。 |  | 未给 provider 时 400 `provider is required`。未知且无插件处理时 404 `provider_not_found`。 |
| GET /v8/management/oauth/callback | 用查询参数完成回调。 |  | 不要求管理密钥。`state` 必填。`code` 与 `error` 至少有一个。 |
| GET /v8/management/oauth/status | 读取会话状态。 |  | state 不合法时 400 `invalid state`。未知或过期时 HTTP 仍是 200，正文 `status` 为 `error`。完成时 `status` 为 `ok`。仍在等待时为 `wait`。 |
| POST /v8/management/oauth/callback | 用 JSON 完成回调。 |  | 正文无法绑定时 400 `invalid body`。`redirect_url` 无法解析时 400 `invalid redirect_url`。 |
| POST /v8/management/oauth/import | 按 `provider` 导入。 |  | 未给 provider 时 400 `provider is required`。不是 `vertex` 时 404 `provider_not_found`。 |

## 5. 常见错误与边界

回调里的 state 必须仍是待处理会话。未知或过期返回 404 `unknown or expired state`。已经完成返回 409 `oauth flow is already completed`。提供商与会话不一致返回 400 `provider does not match state`。会话上已有错误状态时返回 409，正文 `error` 为该状态。不支持的提供商字符串返回 400 `unsupported provider`。取消一个并不存在的合法 state 仍返回 200，但 `cancelled` 为 false。

## 6. 相关功能

上传已有 JSON 见 [管理凭证](/cn/management/v8-credentials)。密钥见 [管理端设置](/cn/operations/management-settings)。

## 7. 使用经验

暂无
