---
title: OpenAI Chat
feature_ids:
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-completions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# OpenAI Chat

这里说明钉住提交里的 OpenAI Chat Completions、Completions 和默认模型列表。

## 1. 这段解决什么问题

这三个路由让调用方用 OpenAI 兼容的 JSON 列出模型、发起对话补全，或发起旧式文本补全。它们都挂在 `/v1` 分组上。

## 2. 适用条件与不做的事

三个路由都先经过客户端密钥校验。密钥的写法和示例密钥安全模式见[客户端密钥](/cn/api/access)。安全模式命中时，请求在进入本页处理函数之前返回 403。

本页不说明单个模型的查询。`GET /v1/models/*model` 在[其他入口](/cn/api/openai-other)。Claude Messages、Gemini 和 Responses 也不在本页。

`model` 必须是当前进程能够路由的模型。本页不新增模型名。

## 3. 怎么配置或怎么调用

模型列表：

```bash
curl https://example.invalid/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

对话补全。只有 JSON 布尔值 `true` 的 `stream` 才返回 SSE；省略或其他值返回一份 JSON。

```bash
curl https://example.invalid/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

旧式补全同样只把 JSON 布尔值 `true` 的 `stream` 当作流式。`prompt` 为空字符串时，送去执行的用户文本是 `Complete this:`。

```bash
curl https://example.invalid/v1/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","prompt":"Continue.","stream":false}'
```

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| route.v1.get-models | `GET /v1/models`，返回当前可见模型。 |  | 见第 5 节的格式选择。普通 OpenAI 列表只保留 `id`、`object`、`created` 和 `owned_by`，外层是 `{"object":"list","data":[...]}`。 |
| route.v1.post-chat-completions | `POST /v1/chat/completions`。 |  | JSON 布尔 `stream: true` 走 SSE，否则走一份 JSON。没有 `messages` 但有 `input` 或 `instructions` 时，先把 Responses 体转换成 Chat Completions 再执行。 |
| route.v1.post-completions | `POST /v1/completions`。 |  | JSON 布尔 `stream: true` 走 SSE。空 `prompt` 变成用户文本 `Complete this:`。非流式响应的 `object` 为 `text_completion`。 |

`POST /v1/completions` 会把请求里已经存在的 `model`、`max_tokens`、`temperature`、`top_p`、`frequency_penalty`、`presence_penalty`、`stop`、`stream`、`logprobs`、`top_logprobs` 和 `echo` 带入执行。没有出现的字段不会被本路由补上。

## 5. 常见错误与边界

读请求体失败时，两个 `POST` 都返回读取错误对应的状态；不能归类时为 400。正文的 `error.type` 为 `invalid_request_error`，`error.message` 以 `Invalid request:` 开头。

`GET /v1/models` 按请求选择目录格式：

- `User-Agent` 包含 `grok-shell` 时返回 Grok Shell 目录。比较不区分大小写。
- 查询串里出现 `client_version` 这个键时，即使值为空，也返回 Codex 客户端目录。编码失败返回 500，`error.type` 为 `server_error`，消息以 `Failed to encode model list:` 开头。
- 请求带 `Anthropic-Version`，或 `User-Agent` 以 `claude-cli` 开头时，返回 Claude 模型列表。
- 其余情况返回上面的 OpenAI 列表。

启用 Home 时，`client_version` 改用 Home 的 Codex 客户端目录，其他列表改用 Home 模型目录。控制中心不可用返回 503，`error.type` 为 `server_error`，`error.message` 为 `home control center unavailable`。向 Home 取目录失败返回 502，`error.type` 为 `server_error`。Home 把结果标成认证失败时，状态沿用该结果，`error.type` 为 `authentication_error`。

要求返回单条模型时，只有整份目录 `json.Unmarshal` 失败才返回 502，正文为 `{"error":{"message":"Invalid model catalog","type":"api_error"}}`。目录是合法 JSON、但没有 `data` 或 `models` 数组时，返回 404，正文为 `{"error":{"message":"Model not found","type":"invalid_request_error","code":"model_not_found"}}`。本页的列表路径不走这条选择，直接写出目录。

## 6. 相关功能

单条模型见[其他入口](/cn/api/openai-other)。客户端密钥见[客户端密钥](/cn/api/access)。Responses 见 [Responses](/cn/api/responses)。

## 7. 使用经验

- [用别名把客户端模型名映射到真实模型](/cn/experience/accounts#exp-accounts-alias-client-model)
- [在单份凭证上排除模型](/cn/experience/accounts#exp-accounts-exclude-model)
- [兼容模型要写入配置才出现在列表](/cn/experience/accounts#exp-accounts-list-compat-models)
- [Antigravity 图像走聊天补全](/cn/experience/api#exp-api-antigravity-image-chat)
- [能直连上游协议时不要经聊天补全转换](/cn/experience/api#exp-api-avoid-chat-translation)
- [聊天补全流以 DONE 结束](/cn/experience/api#exp-api-chat-done-marker)
- [图像对话模型仍走聊天补全](/cn/experience/api#exp-api-chat-image-model)
- [聊天补全要带 reasoning effort 才流出思考](/cn/experience/api#exp-api-chat-reasoning-effort)
- [兼容凭证固定调用聊天补全](/cn/experience/api#exp-api-compat-always-chat)
- [Copilot 走 /v1 时省略 top_p](/cn/experience/api#exp-api-copilot-chat-sampling)
- [第三方 DeepSeek 不会填 OpenAI 思考字段](/cn/experience/api#exp-api-deepseek-no-openai-thinking)
- [Gemini 音频走聊天补全](/cn/experience/api#exp-api-gemini-audio-chat)
- [目录不返回思考文本时不要期待代理补写](/cn/experience/api#exp-api-no-synthetic-reasoning)
- [推理摘要只在请求要求时出现](/cn/experience/api#exp-api-reasoning-summary-vs-effort)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [删除凭证后重启才更新模型列表](/cn/experience/api#exp-api-restart-after-auth-removal)
- [客户端使用目录中的模型 id](/cn/experience/api#exp-api-use-listed-model-id)
- [不要发送模型拒绝的思考档](/cn/experience/configuration#exp-configuration-reject-minimal-effort)
- [用括号后缀选择思考档位](/cn/experience/configuration#exp-configuration-thinking-suffix)
- [可见模型以钉住目录为准](/cn/experience/introduction#exp-introduction-catalog-is-authoritative)
- [关闭冷却以保持凭证可选](/cn/experience/routing#exp-routing-disable-cooling)
- [gpt-image-2 通过覆盖后的聊天补全调用](/cn/experience/routing#exp-routing-gpt-image-override)
