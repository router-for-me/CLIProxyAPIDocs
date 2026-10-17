---
title: Gemini
feature_ids:
  - route.v1beta.get-models
  - route.v1beta.get-models-action
  - route.v1beta.post-models-action
  - route.v1beta.post-interactions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Gemini

这里说明钉住提交里的 Gemini 兼容路由：模型列表、单模型查询、`models/*action` 调用，以及 Interactions。

## 1. 这段解决什么问题

这些路由挂在 `/v1beta` 分组上。调用方可以列出 Gemini 形态的模型、读取其中一个模型、对 `模型名:方法名` 发起生成或计数，或者向 `/v1beta/interactions` 提交只含 `model` 或只含 `agent` 的请求。

## 2. 适用条件与不做的事

四个路由都先经过客户端密钥校验。密钥和示例密钥安全模式见[客户端密钥](/cn/api/access)。

本页不说明 OpenAI 的 `/v1/models`，也不说明 Claude Messages。Interactions 的 `agent` 会固定走 Interactions 提供商；普通 `model` 请求不强制该提供商。

`POST /v1beta/models/*action` 只进入三个方法：`generateContent`、`streamGenerateContent`、`countTokens`。其他方法名不会被这三个分支处理。

## 3. 怎么配置或怎么调用

模型列表和单模型。单模型路径写在 `models/` 后面，名称可以带或不带 `models/` 前缀。

```bash
curl https://example.invalid/v1beta/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

生成、流式生成和计数。路径必须是一个模型段、一个冒号和一个方法名。

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID>:generateContent \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl "https://example.invalid/v1beta/models/<已登记的模型 ID>:streamGenerateContent?alt=sse" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID>:countTokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Interactions。`model` 和 `agent` 只能有一个非空。`stream` 如果出现，必须是 JSON 布尔值。

```bash
curl https://example.invalid/v1beta/interactions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| route.v1beta.get-models | `GET /v1beta/models`。 |  | 正文是 `{"models":[...]}`。已有名称如果不带 `models/` 前缀，响应里会补上。空的 `displayName` 和 `description` 用名称填充。没有 `supportedGenerationMethods` 时写成 `["generateContent"]`。 |
| route.v1beta.get-models-action | `GET /v1beta/models/*action`。 |  | 去掉前导斜杠后，按模型名或 `models/` 加模型名匹配。命中时把名称补成带 `models/` 前缀的对象。 |
| route.v1beta.post-models-action | `POST /v1beta/models/*action`。 |  | 路径去掉前导斜杠后必须正好分成 `模型名:方法名`。方法只处理 `generateContent`、`streamGenerateContent` 和 `countTokens`。 |
| route.v1beta.post-interactions | `POST /v1beta/interactions`。 |  | JSON 必须合法。`model` 与 `agent` 恰好一个非空。`stream` 缺省为 false；出现时必须是布尔值。 |

`streamGenerateContent` 读取查询参数 `alt`，没有时再读 `$alt`。值为 `sse` 或两者都没有时按 SSE 写出，块前带 `data: `。其他 `alt` 值按原始块写出，不套这层 SSE 帧。

Interactions 的 `model` 如果以 `models/` 开头，执行前会去掉这一层前缀。`agent` 非空时，凭证选择使用的模型名是 `gemini-2.5-flash`，并且强制提供商为 Interactions。这不改变调用方写在 `agent` 里的值。

## 5. 常见错误与边界

`GET` 或 `POST` 的 `*action` 无法绑定路径时返回 400，`error.type` 为 `invalid_request_error`，消息以 `Invalid request:` 开头。

单模型未命中返回 404，`error.message` 为 `Not Found`，`error.type` 为 `not_found`。

`POST` 路径不是正好一个冒号分成的两段时返回 404，`error.type` 为 `invalid_request_error`，消息是请求路径加 ` not found.`。方法名不是 `generateContent`、`streamGenerateContent` 或 `countTokens` 时，处理函数不写响应。

`POST` 读请求体失败，且原请求体存在时，返回读取错误对应的状态；不能归类时为 400，`error.type` 为 `invalid_request_error`。

`streamGenerateContent` 无法取得 HTTP flusher 时返回 500，`error.message` 为 `Streaming not supported`，`error.type` 为 `server_error`。

Interactions 的 JSON 不合法时返回 400，消息为 `invalid JSON body`。`model` 与 `agent` 同时为空或同时非空时返回 400，消息为 `request requires exactly one of model or agent`。`stream` 不是布尔值时返回 400，消息为 `stream must be a boolean`。这些正文的 `error.type` 都是 `invalid_request_error`。`stream: true` 走 SSE；无法取得 flusher 时同样返回 500 `Streaming not supported`。

启用 Home 时，列表和单模型改向 Home 取目录。控制中心不可用返回 503，`error.message` 为 `home control center unavailable`，`error.type` 为 `server_error`。取目录失败返回 502。Home 标成认证失败时，`error.type` 为 `authentication_error`。Home 单模型未命中仍是 404 `Not Found`。

## 6. 相关功能

客户端密钥见[客户端密钥](/cn/api/access)。OpenAI 模型列表见 [OpenAI Chat](/cn/api/openai-chat)。

## 7. 使用经验

- [图像模型走 Gemini 协议](/cn/experience/api#exp-api-gemini-for-images)
- [Gemini 图像和结构化输出走原生路由](/cn/experience/api#exp-api-gemini-native-route)
- [按上游字段转发 AI Studio 思考](/cn/experience/api#exp-api-gemini-thinking-field)
