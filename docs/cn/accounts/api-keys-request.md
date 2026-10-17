---
title: 重试与请求级错误
feature_ids:
  - api-keys.claude.request-retry
  - api-keys.claude.request-scoped-errors-action
  - api-keys.claude.request-scoped-errors-match
  - api-keys.claude.request-scoped-errors-match-regexr
  - api-keys.claude.request-scoped-errors-status
  - api-keys.codex.request-retry
  - api-keys.codex.request-scoped-errors-action
  - api-keys.codex.request-scoped-errors-match
  - api-keys.codex.request-scoped-errors-match-regexr
  - api-keys.codex.request-scoped-errors-status
  - api-keys.gemini.request-retry
  - api-keys.gemini.request-scoped-errors-action
  - api-keys.gemini.request-scoped-errors-match
  - api-keys.gemini.request-scoped-errors-match-regexr
  - api-keys.gemini.request-scoped-errors-status
  - api-keys.interactions.request-retry
  - api-keys.interactions.request-scoped-errors-action
  - api-keys.interactions.request-scoped-errors-match
  - api-keys.interactions.request-scoped-errors-match-regexr
  - api-keys.interactions.request-scoped-errors-status
  - api-keys.meta.request-retry
  - api-keys.meta.request-scoped-errors-action
  - api-keys.meta.request-scoped-errors-match
  - api-keys.meta.request-scoped-errors-match-regexr
  - api-keys.meta.request-scoped-errors-status
  - api-keys.openai-compatibility.request-retry
  - api-keys.openai-compatibility.request-scoped-errors-action
  - api-keys.openai-compatibility.request-scoped-errors-match
  - api-keys.openai-compatibility.request-scoped-errors-match-regexr
  - api-keys.openai-compatibility.request-scoped-errors-status
  - api-keys.vertex.request-retry
  - api-keys.xai.request-retry
  - api-keys.xai.request-scoped-errors-action
  - api-keys.xai.request-scoped-errors-match
  - api-keys.xai.request-scoped-errors-match-regexr
  - api-keys.xai.request-scoped-errors-status
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 重试与请求级错误

## 1. 这段解决什么问题

按凭证或提供商覆盖全局重试轮数，并按上游状态码和错误正文决定停止、继续，以及是否冷却。

## 2. 适用条件与不做的事

Vertex 密钥在台账里只有 request-retry，没有请求级错误字段。OAuth 文件凭证的同类规则在 OAuth 页。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      request-retry: 3
      request-scoped-errors:
        - status: 400
          match:
            - "prompt is too long"
          match-regexr:
            - "prompt is too long$"
          action: "stop"
      keys:
        - api-key: "YOUR_API_KEY"
          request-retry: 0
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.claude.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.claude.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.claude.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.claude.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |
| api-keys.codex.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.codex.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.codex.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.codex.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.codex.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |
| api-keys.gemini.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.gemini.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.gemini.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.gemini.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.gemini.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |
| api-keys.interactions.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.interactions.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.interactions.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.interactions.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.interactions.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |
| api-keys.meta.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.meta.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.meta.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.meta.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.meta.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |
| api-keys.openai-compatibility.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.openai-compatibility.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.openai-compatibility.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.openai-compatibility.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.openai-compatibility.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |
| api-keys.vertex.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.xai.request-retry | 这一条凭证额外重试轮数。 | nil | 省略或负数使用全局 request-retry。0 关闭额外重试轮。 |
| api-keys.xai.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| api-keys.xai.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| api-keys.xai.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| api-keys.xai.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | 用上游响应的 HTTP 状态码匹配，例如 400。小于等于 0 的 OAuth 规则会被丢掉。 |

## 5. 常见错误与边界

request-retry 省略或为负时继承全局；0 关闭额外轮次。action 使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 路径会丢弃不完整规则；API 密钥规则按同样四个动作配置。

## 6. 相关功能

OAuth 规则见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。

## 7. 使用经验

- [用请求级错误规则处理特定 429](/cn/experience/accounts#exp-accounts-request-scoped-error-action)
