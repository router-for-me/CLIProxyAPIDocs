---
title: OAuth 回调
feature_ids:
  - route.anthropic.get-callback
  - route.antigravity.get-callback
  - route.callback.get
  - route.codex.get-callback
  - route.devin.get-callback
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# OAuth 回调

## 1. 这段解决什么问题

主服务可以接收已经发起的 OAuth 会话回调，并把短时的 code 和 state 交给正在等待的登录。

## 2. 适用条件与不做的事

这些路由不校验客户端 API 密钥。本地登录命令自己监听的端口是另一条路径；只有回调打到主服务时才走本页。

## 3. 怎么配置或怎么调用

浏览器被重定向到正在运行的代理时，使用下面的路径。查询参数是 `code`、`state`，以及 `error` 或 `error_description`。

```text
GET /anthropic/callback
GET /codex/callback
GET /antigravity/callback
GET /callback
GET /devin/callback
```

地址使用你的代理根，例如 `https://example.invalid/anthropic/callback`。Anthropic、Codex 和 Antigravity 在 `state` 非空时把结果写到凭证目录里对应的等待会话。Devin 的两条路径共用一个处理函数。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| GET /anthropic/callback | 主服务端口上的 OAuth 回调。 |  | state 非空时写入等待中的 anthropic 会话。始终返回 HTTP 200 HTML。 |
| GET /antigravity/callback | 主服务端口上的 OAuth 回调。 |  | state 非空时写入等待中的 antigravity 会话。始终返回 HTTP 200 HTML。 |
| GET /callback | 主服务端口上的 OAuth 回调。 |  | 缺少 code 和 error 时返回 400 code or error is required。写入失败返回 400 invalid or expired OAuth callback。 |
| GET /codex/callback | 主服务端口上的 OAuth 回调。 |  | state 非空时写入等待中的 codex 会话。始终返回 HTTP 200 HTML。 |
| GET /devin/callback | 主服务端口上的 OAuth 回调。 |  | 与 GET /callback 使用同一处理函数。 |

## 5. 常见错误与边界

前三条即使没有 state 也返回 HTTP 200 和 HTML。Devin 在 `code` 和 `error` 都缺失时返回 400，正文是 `{"error":"code or error is required"}`。会话无效或过期时返回 400，正文是 `{"error":"invalid or expired OAuth callback"}`。Devin 响应带 `Cache-Control: no-store`。

## 6. 相关功能

发起登录见 [Claude 登录](/cn/accounts/claude)、[Codex 登录](/cn/accounts/codex)、[反重力登录](/cn/accounts/antigravity) 和 [Devin 登录](/cn/accounts/devin)。

## 7. 使用经验

暂无
