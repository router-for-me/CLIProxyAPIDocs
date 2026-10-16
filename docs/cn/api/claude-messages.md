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

暂无
