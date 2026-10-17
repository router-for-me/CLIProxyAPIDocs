---
title: Claude Messages
feature_ids:
  - route.v1.post-messages
  - route.v1.post-messages-count-tokens
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude Messages

这里说明钉住提交里的 Claude Messages 调用和 token 计数。

## 1. 这段解决什么问题

`POST /v1/messages` 接受 Claude 兼容的 JSON，并按 `stream` 决定返回一份 JSON 还是 SSE。`POST /v1/messages/count_tokens` 用同一类请求体返回计数结果，不开启流。

## 2. 适用条件与不做的事

两个路由都在 `/v1` 分组上，先经过客户端密钥校验。密钥和示例密钥安全模式见[客户端密钥](/cn/api/access)。

本页不列出 Claude 模型。带 `Anthropic-Version` 或 `claude-cli` User-Agent 的 `GET /v1/models` 在 [OpenAI Chat](/cn/api/openai-chat)。Gemini 的 `countTokens` 不在本页。

处理函数读取 `model` 和 `stream`。其余 JSON 进入后续执行，本路由不在这里声明额外的必填字段。

## 3. 怎么配置或怎么调用

非流式消息：

```bash
curl https://example.invalid/v1/messages \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

流式消息把 `stream` 设成 JSON 布尔值 `true`。响应使用 SSE。

计数：

```bash
curl https://example.invalid/v1/messages/count_tokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

计数响应的 `Content-Type` 固定先写成 `application/json`。

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| route.v1.post-messages | `POST /v1/messages`。 |  | `stream` 缺失，或是 JSON 布尔值 `false` 时返回一份 JSON。其他已存在的 `stream` 值走 SSE。 |
| route.v1.post-messages-count-tokens | `POST /v1/messages/count_tokens`。 |  | 只返回 JSON。使用请求体里的 `model` 选择执行目标。 |

形如 `claude-fable-5-dd-` 加反转片段的模型 ID，会在路由前还原成原来的模型名。还原结果与原值相同时，请求体保持不变。

## 5. 常见错误与边界

读请求体失败时返回读取错误对应的状态；不能归类时为 400。正文的 `error.type` 为 `invalid_request_error`，`error.message` 以 `Invalid request:` 开头。

执行失败时，Claude 错误正文的外层 `type` 为 `error`。其中 `error.type` 和 `error.message` 来自执行错误。状态码沿用执行错误里的状态；没有状态时为 500。上游直接返回的响应体会按原状态写出；其中被识别为找不到线程的正文，会改写成带 `error.details.error_code` `thread_not_found` 的 Claude 错误对象。

非流式响应如果以 gzip 魔数开头，会先解压再写给客户端。解压失败时仍写出原始字节。

流式响应在无法取得 HTTP flusher 时返回 500。本页不另写一套流式错误码；执行阶段的错误沿用上面的 Claude 错误对象。

## 6. 相关功能

客户端密钥见[客户端密钥](/cn/api/access)。OpenAI 对话见 [OpenAI Chat](/cn/api/openai-chat)。

## 7. 使用经验

- [用别名把客户端模型名映射到真实模型](/cn/experience/accounts#exp-accounts-alias-client-model)
- [Claude Code 使用 Codex 登录而不是原始令牌](/cn/experience/accounts#exp-accounts-codex-login-for-claude-code)
- [兼容模型保留签名思考](/cn/experience/accounts#exp-accounts-compat-preserves-signed-thinking)
- [Antigravity Claude 走 messages](/cn/experience/api#exp-api-antigravity-claude-messages)
- [Claude Code 必须调用 messages](/cn/experience/api#exp-api-claude-code-messages)
- [计数接口按上游方式计算工具](/cn/experience/api#exp-api-count-tokens-tool-shape)
- [DeepSeek 需要客户端降低 max token](/cn/experience/api#exp-api-deepseek-max-tokens)
- [发往 Codex 前丢掉不支持的 Claude 字段](/cn/experience/api#exp-api-drop-unsupported-claude-fields)
- [非 Claude 上游在消息末尾才给用量](/cn/experience/api#exp-api-messages-usage-at-end)
- [Opus 努力值来自 output_config.effort](/cn/experience/api#exp-api-opus-effort-field)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [工具往返必须带上 id](/cn/experience/api#exp-api-tool-call-ids)
- [在模型条目上声明思考档位](/cn/experience/configuration#exp-configuration-declare-thinking-levels)
- [用括号后缀选择思考档位](/cn/experience/configuration#exp-configuration-thinking-suffix)
- [别名加覆盖表达 Opus 努力值](/cn/experience/routing#exp-routing-alias-and-override-effort)
