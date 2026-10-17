---
title: Responses
feature_ids:
  - route.v1.post-responses
  - route.v1.get-responses
  - route.v1.post-responses-compact
  - route.backend-api.post-codex-responses
  - route.backend-api.get-codex-responses
  - route.backend-api.post-codex-responses-compact
  - route.backend-api.post-codex-alpha-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Responses

这里说明钉住提交里的 OpenAI Responses、压缩，以及 Codex CLI 可直接使用的 `/backend-api/codex` 别名。

## 1. 这段解决什么问题

`/v1/responses` 接受 Responses JSON。`stream` 为 JSON 布尔值 `true` 时返回 SSE，否则返回一份 JSON。对应的 `GET` 把连接升级为 WebSocket。`/responses/compact` 只接受非流式压缩。`/backend-api/codex` 下的同名路径调用同一批处理函数。该前缀下还有 Codex Alpha Search。

## 2. 适用条件与不做的事

这些路由分属 `/v1` 和 `/backend-api/codex` 两个分组，都先经过客户端密钥校验。密钥和示例密钥安全模式见[客户端密钥](/cn/api/access)。

`/v1/alpha/search` 不在本页，它在[其他入口](/cn/api/openai-other)，但使用同一个搜索处理函数。Chat Completions 不在本页。没有 `messages`、却带 `input` 或 `instructions` 的 Chat Completions 体会先被转换成 Chat Completions，那是 [OpenAI Chat](/cn/api/openai-chat) 的行为。

本页不描述上游协议转换。调用方提交的是 Responses JSON，或搜索处理函数所读取的 JSON。

## 3. 怎么配置或怎么调用

非流式 Responses。把主机上的 `/v1` 换成 `/backend-api/codex` 即调用同一处理函数。

```bash
curl https://example.invalid/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

流式请求把 `stream` 设为 JSON 布尔值 `true`，响应为 SSE。

压缩不能流式：

```bash
curl https://example.invalid/v1/responses/compact \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

WebSocket 使用 `GET /v1/responses` 或 `GET /backend-api/codex/responses`，并带上 WebSocket 升级头。文本消息使用 JSON。处理函数识别 `type` 为 `response.create`、`response.append` 和 `response.interrupt` 的消息。

Codex Alpha Search：

```bash
curl https://example.invalid/backend-api/codex/alpha/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| route.v1.post-responses | `POST /v1/responses`。 |  | JSON 布尔 `stream: true` 走 SSE，否则走一份 JSON。使用请求体中的 `model`。 |
| route.v1.get-responses | `GET /v1/responses`。 |  | 升级为 WebSocket。升级器允许任意 Origin。 |
| route.v1.post-responses-compact | `POST /v1/responses/compact`。 |  | JSON 布尔 `stream: true` 直接拒绝。`stream` 存在但不是该布尔值时先删掉该字段，再按非流式执行。 |
| route.backend-api.post-codex-responses | `POST /backend-api/codex/responses`。 |  | 与 `POST /v1/responses` 同一处理函数。 |
| route.backend-api.get-codex-responses | `GET /backend-api/codex/responses`。 |  | 与 `GET /v1/responses` 同一 WebSocket 处理函数。 |
| route.backend-api.post-codex-responses-compact | `POST /backend-api/codex/responses/compact`。 |  | 与 `POST /v1/responses/compact` 同一处理函数。 |
| route.backend-api.post-codex-alpha-search | `POST /backend-api/codex/alpha/search`。 |  | 读取最多 16 MiB。JSON 对象里的 `id` 和 `model` 参与选路；`id` 非空时写入选择用的 `X-Session-ID`。 |

搜索请求如果能解析成 JSON 对象，转发前会去掉 `prompt_cache_key` 和 `prompt_cache_retention`。解析失败时保留原始字节。API key 形态的 Codex 凭证必须带有 base URL，转发路径是该地址下的 `/alpha/search`。OAuth 凭证走 Codex 搜索上游。模型路由如果把目标指到非 `codex` 提供商，请求不会发出。

WebSocket 上的 `response.interrupt` 转给当前上游套接字，不因此新开一轮。`response.create` 和 `response.append` 是同一连接上的 Responses 请求。上游要求改走 HTTP 重放时，连接以关闭码 1012 结束，原因是 `upstream requires HTTP replay`。

## 5. 常见错误与边界

两个 Responses `POST` 和压缩读请求体失败时，返回读取错误对应的状态；不能归类时为 400。`error.type` 为 `invalid_request_error`，消息以 `Invalid request:` 开头。

压缩在 `stream` 为 JSON 布尔 `true` 时返回 400，消息为 `Streaming not supported for compact responses`，`error.type` 为 `invalid_request_error`。

流式 Responses 无法取得 HTTP flusher 时返回 500，`error.type` 为 `server_error`。WebSocket 升级失败时，处理函数不再继续会话；错误由升级器写回。

搜索在认证管理器不可用时返回 503，正文 `error` 为 `Codex auth manager unavailable`。没有选中凭证时返回 503，`error` 为 `Codex auth unavailable`。API key 凭证没有 base URL 时返回 503，`error` 为 `Codex Alpha Search API key base URL unavailable`。模型路由目标不受支持时返回该错误对应的状态；不能归类时为 503，正文 `error` 是路由错误文本。选路失败时同样返回其状态，不能归类时为 503，并原样附加 `Retry-After`。读请求体失败时，不能归类则为 400，`error` 为 `Failed to read search request`。上游请求失败时，不能归类则为 502。读上游正文失败时，不能归类则为 502，`error` 为 `Failed to read Codex search response`。成功到达上游后，状态码和正文按上游原样写回；上游给了 `Content-Type` 时一并写回。

## 6. 相关功能

同一搜索处理函数的 `/v1/alpha/search` 见[其他入口](/cn/api/openai-other)。客户端密钥见[客户端密钥](/cn/api/access)。实时 WebSocket 见[实时会话](/cn/api/realtime)。

## 7. 使用经验

- [Antigravity 会隐藏账号不能用的模型](/cn/experience/accounts#exp-accounts-antigravity-hides-unusable-models)
- [responses 上游写到 Codex API key](/cn/experience/accounts#exp-accounts-codex-api-key-base-url)
- [Codex 客户端要匹配 User-Agent 默认值](/cn/experience/accounts#exp-accounts-codex-client-user-agent)
- [内置图像使用 Codex OAuth](/cn/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Codex 可用客户端或代理的 WebSocket](/cn/experience/accounts#exp-accounts-codex-websocket-or-http)
- [OpenAI 兼容基址带上版本段](/cn/experience/accounts#exp-accounts-openai-base-url-v1)
- [Codex 客户端调用 responses 路由](/cn/experience/api#exp-api-call-responses)
- [压缩需要上游提供压缩模型](/cn/experience/api#exp-api-compaction-needs-model)
- [停止注入图像工具](/cn/experience/api#exp-api-disable-image-tool-injection)
- [图像模型走 Gemini 协议](/cn/experience/api#exp-api-gemini-for-images)
- [Kimi responses 保持 Kimi 自己的工具](/cn/experience/api#exp-api-kimi-native-responses)
- [推理摘要只在请求要求时出现](/cn/experience/api#exp-api-reasoning-summary-vs-effort)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [responses 用 instructions 代替 system](/cn/experience/api#exp-api-responses-instructions)
- [responses 流不使用 DONE 作为结束](/cn/experience/api#exp-api-responses-stream-shape)
- [用括号后缀选择思考档位](/cn/experience/configuration#exp-configuration-thinking-suffix)
- [用载荷过滤去掉上游拒绝的字段](/cn/experience/routing#exp-routing-filter-rejected-fields)
- [responses 靠共享缓存键轮换](/cn/experience/routing#exp-routing-responses-cache-key)
- [打开会话粘性保住加密推理](/cn/experience/routing#exp-routing-session-affinity)
